// Re-export all matcher modules
export * from './locator';
export * from './page';
export * from './api';
export * from './asymmetric';
export * from './general';


// Import combined objects
import { locatorMatchers } from './locator';
import { pageMatchers } from './page';
import { apiMatchers } from './api';
import { generalMatchers } from './general';
import { asymmetricMatchers } from './asymmetric';



// All matchers combined (for expect.extend)
export const allMatchers = {
  ...locatorMatchers,
  ...pageMatchers,
  ...apiMatchers,
  ...generalMatchers,
  ...asymmetricMatchers,
};


// Re-export combined objects
export { locatorMatchers } from './locator';
export { pageMatchers } from './page';
export { apiMatchers } from './api';
export { asymmetricMatchers } from './asymmetric';
export { generalMatchers } from './general';

