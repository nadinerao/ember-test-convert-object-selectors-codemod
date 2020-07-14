# convert-object-selectors-in-tests

Replace object selectors in `assert.dom` or `find` with their corresponding string values.

## Usage

```
npx ember-test-convert-object-selectors-codemod convert-object-selectors-in-tests path/of/files/ or/some**/*glob.js

# or

yarn global add ember-test-convert-object-selectors-codemod
ember-test-convert-object-selectors-codemod convert-object-selectors-in-tests path/of/files/ or/some**/*glob.js
```

## Limitations

* Does not transform imported object selectors, e.g. `import SELECTORS from 'test-helpers/test-selectors'`
* Does not transform simple variables, e.g. `assert.dom(myTestSelector)`
* Does not remove unused object definitions after transform

## Input / Output

<!--FIXTURES_TOC_START-->
* [convert-objects-in-assert-dom](#convert-objects-in-assert-dom)
* [convert-objects-in-assert-find](#convert-objects-in-assert-find)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="convert-objects-in-assert-dom">**convert-objects-in-assert-dom**</a>

**Input** (<small>[convert-objects-in-assert-dom.input.js](transforms/convert-object-selectors-in-tests/__testfixtures__/convert-objects-in-assert-dom.input.js)</small>):
```js
import { module, test } from 'qunit';

module('foo', function() {

  const SELECTORS = {
    block: '[data-test-block]',
    image: '[data-test-image]',
  };

  const NESTED_SELECTORS = {
    WITH: {
      CONTAINER: '[data-test-container]',
      BUTTON: '[data-test-button]',
    },
  };

  test('assert dom test 1', async function(assert) {
    assert.expect(1);

    assert.dom(SELECTORS.block).exists();
  });

  test('assert dom test 2', async function(assert) {
    assert.expect(2);

    assert.dom(NESTED_SELECTORS.WITH.CONTAINER).exists();
    assert.dom(NESTED_SELECTORS.WITH.BUTTON).exists();
  });
});

```

**Output** (<small>[convert-objects-in-assert-dom.output.js](transforms/convert-object-selectors-in-tests/__testfixtures__/convert-objects-in-assert-dom.output.js)</small>):
```js
import { module, test } from 'qunit';

module('foo', function() {

  const SELECTORS = {
    block: '[data-test-block]',
    image: '[data-test-image]',
  };

  const NESTED_SELECTORS = {
    WITH: {
      CONTAINER: '[data-test-container]',
      BUTTON: '[data-test-button]',
    },
  };

  test('assert dom test 1', async function(assert) {
    assert.expect(1);

    assert.dom('[data-test-block]').exists();
  });

  test('assert dom test 2', async function(assert) {
    assert.expect(2);

    assert.dom('[data-test-container]').exists();
    assert.dom('[data-test-button]').exists();
  });
});

```
---
<a id="convert-objects-in-assert-find">**convert-objects-in-assert-find**</a>

**Input** (<small>[convert-objects-in-assert-find.input.js](transforms/convert-object-selectors-in-tests/__testfixtures__/convert-objects-in-assert-find.input.js)</small>):
```js
import { module, test } from 'qunit';
import { find } from '@ember/test-helpers';

module('foo', function() {

  const SELECTORS = {
    block: '[data-test-block]',
    image: '[data-test-image]',
  };

  const NESTED_SELECTORS = {
    WITH: {
      CONTAINER: '[data-test-container]',
      BUTTON: '[data-test-button]',
    },
  };

  test('find test 1', async function(assert) {
    assert.expect(1);

    assert.notOk(find(SELECTORS.block));
  });

  test('find test 2', async function(assert) {
    assert.expect(2);

    assert.ok(find(NESTED_SELECTORS.WITH.CONTAINER));
    assert.notOk(find(NESTED_SELECTORS.WITH.BUTTON));
  });
});

```

**Output** (<small>[convert-objects-in-assert-find.output.js](transforms/convert-object-selectors-in-tests/__testfixtures__/convert-objects-in-assert-find.output.js)</small>):
```js
import { module, test } from 'qunit';
import { find } from '@ember/test-helpers';

module('foo', function() {

  const SELECTORS = {
    block: '[data-test-block]',
    image: '[data-test-image]',
  };

  const NESTED_SELECTORS = {
    WITH: {
      CONTAINER: '[data-test-container]',
      BUTTON: '[data-test-button]',
    },
  };

  test('find test 1', async function(assert) {
    assert.expect(1);

    assert.notOk(find('[data-test-block]'));
  });

  test('find test 2', async function(assert) {
    assert.expect(2);

    assert.ok(find('[data-test-container]'));
    assert.notOk(find('[data-test-button]'));
  });
});

```
<!--FIXTURES_CONTENT_END-->
