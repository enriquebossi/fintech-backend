const fs = require('fs');
const path = require('path');
const { axe } = require('jest-axe');

describe('public/index.html accessibility', () => {
  test('should have no accessibility violations', async () => {
    const html = fs.readFileSync(path.join(__dirname, '../../public/index.html'), 'utf8');
    document.documentElement.innerHTML = html;
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});
