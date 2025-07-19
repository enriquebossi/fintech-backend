const fs = require('fs');
const path = require('path');
const React = require('react');
const { render } = require('@testing-library/react');
const { axe } = require('jest-axe');

describe('Main page accessibility', () => {
  it('has no accessibility violations', async () => {
    const html = fs.readFileSync(path.join(__dirname, '../../public/index.html'), 'utf8');
    function HtmlWrapper() {
      return React.createElement('div', { dangerouslySetInnerHTML: { __html: html } });
    }
    const { container } = render(React.createElement(HtmlWrapper));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
