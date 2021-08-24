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
   * Given a node, return an array of its parents, where the last index is the
   * original argument.
   * @param {Node} node argument node
   * @return {Array}
   */
  function getNodePath(node) {
    let path = [];
    let currentNode = node;
    while (currentNode.object) {
      path.push(currentNode);
      currentNode = currentNode.object;
    }
    path.push(currentNode);
    return path.reverse();
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
      const nodePath = getNodePath(argument);
      const rootSelectorNode = nodePath.shift();

      // resolves to the defined object for the selector. (right side of the assignment)
      let resolvedObject;

      if (rootSelectorNode.type === 'ThisExpression') {
        // This accounts for variables defined on 'this context'
        const rootVarNode = nodePath.shift();
        const { name } = rootVarNode.property;
        resolvedObject = root.find(j.AssignmentExpression, {
          left: { property: { name } },
        });
      } else {
        resolvedObject = root.find(j.VariableDeclarator, {
          id: { name: rootSelectorNode.name },
        });
      }

      const keyPaths = nodePath.reduce((red, node) => {
        const next = red.find(j.ObjectProperty, { key: { name: node.property.name } });
        return next;
      }, resolvedObject);

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
