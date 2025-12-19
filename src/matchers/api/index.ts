// API matchers
export { toMatchJSON } from './toMatchJSON';
export * from './toMatchJSON';
export * from './toMatchSchema';
export * from './toHaveStatus';
export * from './toHaveHeader';
export * from './toRespondWithin';

import { toMatchJSON } from './toMatchJSON';
import { toMatchSchema } from './toMatchSchema';
import { toHaveStatus } from './toHaveStatus';
import { toHaveHeader } from './toHaveHeader';
import { toRespondWithin } from './toRespondWithin';

export const apiMatchers = {
  toMatchJSON,
  toMatchSchema,
  toHaveStatus,
  toHaveHeader,
  toRespondWithin,
};
