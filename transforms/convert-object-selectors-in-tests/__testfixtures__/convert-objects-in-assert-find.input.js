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
