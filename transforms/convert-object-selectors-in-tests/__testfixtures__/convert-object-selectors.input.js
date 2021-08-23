import { module, test } from 'qunit';
import { render, find, click, fillIn } from '@ember/test-helpers';
import { IMPORTED_CONSTS } from 'fake-location';

module('foo', function(hooks) {
  hooks.beforeEach(function() {
    this.NESTED_SELECTORS = {
      IMAGE: '[data-test-image-in-this]',
      BUTTON: '[data-test-button-in-this]',
      WITH: {
        BUTTON: '[data-test-button-in-nested-this]',
      }
    };
  })

  const SELECTORS = {
    block: '[data-test-block]',
    image: '[data-test-image]',
  };

  const constantSelector = '[data-test-a-cool-selector]';

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

  test('find test 1', async function(assert) {
    assert.expect(1);

    assert.notOk(find(SELECTORS.block));
  });

  test('find test 2', async function(assert) {
    assert.expect(2);

    assert.ok(find(NESTED_SELECTORS.WITH.CONTAINER));
    assert.notOk(find(NESTED_SELECTORS.WITH.BUTTON));
  });

  test('click test', async function(assert) {
    assert.expect(1);

    await click(NESTED_SELECTORS.WITH.CONTAINER);

    assert.dom(NESTED_SELECTORS.WITH.BUTTON).exists();
  });

  test('fillIn test', async function(assert) {
    assert.expect(1);

    await fillIn(SELECTORS.block, 'foo');

    assert.dom(SELECTORS.image).exists();
  });

  test('constant selector test', async function(assert) {
    assert.expect(1);

    assert.notOk(find(constantSelector));
  });

  test('constant within template literal test', async function(assert) {
    assert.expect(1);

    assert.dom(`${constantSelector} [data-test-nested]`).exists();
    assert.ok(find(`${NESTED_SELECTORS.WITH.BUTTON} [data-test-nested]`));
    assert.ok(find(`[data-test-nested] ${NESTED_SELECTORS.WITH.BUTTON}`));
    assert.ok(find(`[data-test-nested] ${NESTED_SELECTORS.WITH.BUTTON} [data-test-nested] ${constantSelector}`));
  });

  test('unresolveable template literal test', async function(assert) {
    assert.expect(1);

    assert.dom(`${IMPORTED_CONSTS.module} [data-test-nested]`).exists();
  });

  test('resolves variable defined on this', async function(assert) {
    assert.expect(2);

    assert.dom(`${this.NESTED_SELECTORS.BUTTON} [data-test-nested]`).exists();
    assert.dom(`${this.NESTED_SELECTORS.WITH.BUTTON} [data-test-nested]`).exists();
  });
});
