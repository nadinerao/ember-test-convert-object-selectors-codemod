import { module, test } from 'qunit';
import { render, find, click, fillIn } from '@ember/test-helpers';

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

  test('find test 1', async function(assert) {
    assert.expect(1);

    assert.notOk(find('[data-test-block]'));
  });

  test('find test 2', async function(assert) {
    assert.expect(2);

    assert.ok(find('[data-test-container]'));
    assert.notOk(find('[data-test-button]'));
  });

  test('click test', async function(assert) {
    assert.expect(1);

    await click('[data-test-container]');

    assert.dom('[data-test-button]').exists();
  });

  test('fillIn test', async function(assert) {
    assert.expect(1);

    await fillIn('[data-test-block]', 'foo');

    assert.dom('[data-test-image]').exists();
  });
});
