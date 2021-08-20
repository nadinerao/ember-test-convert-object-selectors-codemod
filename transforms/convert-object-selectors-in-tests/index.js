const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);

  const emberTestHelpers = ['find', 'click', 'fillIn'];

  function hasAssertDomOrTestHelper({ callee }) {
    const hasAssertDom =
      callee.object &&
      callee.property &&
      callee.object.name === 'assert' &&
      callee.property.name === 'dom';
    return hasAssertDom || emberTestHelpers.includes(callee.name);
  }

  /**
   * Given a node resolve it's selector value.
   * @param {Node} argument the argument node (e.g in find(selector.pickle), selector.pickle is the node)
   * @return {String} the resolved selector
   */
  function resolveArgument(argument) {
    if (argument.type === 'Identifier') {
      const constName = argument.name;
      const variableDefinition = root.find(j.VariableDeclarator, {
        type: 'VariableDeclarator',
        id: { type: 'Identifier', name: constName },
      });
      const varValue = variableDefinition.get(0).node.init.value;
      return varValue;
    } else if (argument.type === 'MemberExpression') {
      // for each object selector, try to find its associated definition and the string value,
      // e.g. if we have assert.dom(SELECTORS.NAME), look for const SELECTORS = { NAME: '[data-test-foo]' } }
      if (!argument.object) {
        return;
      }

      // this should be the name for the object selector, e.g. 'SELECTORS'
      const objectIdentifierName =
        argument.object.name || (argument.object.object && argument.object.object.name);
      // this should be the object property key, e.g. 'NAME'
      const keyName = argument.property && argument.property.name;

      let objectExpressions = root
        .findVariableDeclarators(objectIdentifierName)
        .find(j.ObjectExpression);
      // go one level deeper if the node we're currently looking at is still a MemberExpression
      // this accounts for something like SELECTORS.AT.NAME
      if (argument.object.type === 'MemberExpression') {
        objectExpressions = objectExpressions.find(j.ObjectExpression);
      }
      const keyPaths = objectExpressions.find(j.ObjectProperty, {
        key: {
          name: keyName,
        },
      });
      if (keyPaths.length) {
        const { node } = keyPaths.get(0);
        const value = node.value && node.value.value;
        if (value) {
          return value;
        }
      }
    }
  }

  root
    .find(j.CallExpression, hasAssertDomOrTestHelper)
    .filter((p) => {
      return p.value.arguments.find((arg) => arg.type !== 'Literal');
    })
    .forEach((p) => {
      // Handles the case when the argument passed into a qunit function is a template literal.
      if (p.value.arguments[0].type === 'TemplateLiteral') {
        const templateArgumentMap = p.value.arguments[0].expressions
          .map((templateArg) => {
            return resolveArgument(templateArg);
          })
          .filter((resolvedArg) => !!resolvedArg);

        // This check ensures that we don't substitute a template literal that we
        // don't have the full resolution to. (var was probably imported from a consts file)
        if (p.value.arguments[0].expressions.length === templateArgumentMap.length) {
          const resolvedTemplateString = p.value.arguments[0].quasis.reduce(
            (red, templateElement) => {
              const [literal, ...rest] = red.rest;
              red.value = red.value + templateElement.value.raw + (literal || '');
              return { value: red.value, rest: rest };
            },
            { value: '', rest: templateArgumentMap }
          );

          p.value.arguments[0] = j.stringLiteral(resolvedTemplateString.value);
        }
      } else {
        var resolvedArg = resolveArgument(p.value.arguments[0]);
        if (resolvedArg) {
          p.value.arguments[0] = j.stringLiteral(resolvedArg);
        }
      }
    });

  return root.toSource({ quote: 'single' });
};
