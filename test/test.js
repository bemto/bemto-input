import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';

import BemtoInput from '..';

const testSnapshot = function(tag, props, children) {
  const tree = renderer.create(
    React.createElement(
      tag,
      props,
      children
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
}

test('Just an input', () => {
  testSnapshot(
    BemtoInput,
    {}
  );
});
