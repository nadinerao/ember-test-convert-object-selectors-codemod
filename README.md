# ember-test-convert-object-selectors-codemod
Contains a codemod to replace object selectors in `assert.dom`, `find`, `click` or `fillIn` with their corresponding string values.

## Motivation
Selectors assigned to variables in tests can allow the selectors to be shared across multiple tests, and in fact across multiple test modules. However in a larger application, doing so can make tests harder to read, understand, and follow. Using the selector string instead of a variable keeps the test more atomic, allows the test to be more resilient when changes to the selector occur outside the test, and ensures the test is readable top-to-bottom.

## Usage

To run a specific codemod from this project, you would run the following:

```
npx ember-test-convert-object-selectors-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js

# or

yarn global add ember-test-convert-object-selectors-codemod
ember-test-convert-object-selectors-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
* [convert-object-selectors-in-tests](transforms/convert-object-selectors-in-tests/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`
