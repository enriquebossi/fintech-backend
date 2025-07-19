require('@testing-library/jest-dom');
const { toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);
const { TextEncoder, TextDecoder } = require('util');
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;
