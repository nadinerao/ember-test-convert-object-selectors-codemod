import { module, test } from 'qunit';
import { render, find, click, fillIn } from '@ember/test-helpers';

module('foo', function() {

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
});
