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

  test('constant selector test', async function(assert) {
    assert.expect(1);

    assert.notOk(find('[data-test-a-cool-selector]'));
  });

  test('constant within template literal test', async function(assert) {
    assert.expect(1);

    assert.dom('[data-test-a-cool-selector] [data-test-nested]').exists();
    assert.ok(find('[data-test-button] [data-test-nested]'));
    assert.ok(find('[data-test-nested] [data-test-button]'));
    assert.ok(find('[data-test-nested] [data-test-button] [data-test-nested] [data-test-a-cool-selector]'));
  });

  test('unresolveable template literal test', async function(assert) {
    assert.expect(1);

    assert.dom(`${IMPORTED_CONSTS.module} [data-test-nested]`).exists();
  });

  test('resolves variable defined on this', async function(assert) {
    assert.expect(2);

    assert.dom('[data-test-button-in-this] [data-test-nested]').exists();
    assert.dom('[data-test-button-in-nested-this] [data-test-nested]').exists();
  });
});
