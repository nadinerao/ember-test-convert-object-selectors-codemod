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
