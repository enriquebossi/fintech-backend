const { toHaveNoViolations } = require('jest-axe');
require('@testing-library/jest-dom');
expect.extend(toHaveNoViolations);
