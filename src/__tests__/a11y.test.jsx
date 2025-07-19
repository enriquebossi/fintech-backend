const React = require('react');
const { render } = require('@testing-library/react');
const { axe } = require('jest-axe');
const App = require('../App');

test('App is accessible', async () => {
  const { container } = render(React.createElement(App));
  expect(await axe(container)).toHaveNoViolations();
});
