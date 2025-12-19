import { APIResponse } from '@playwright/test';

export async function toRespondWithin(
  response: APIResponse | Promise<APIResponse> | (() => Promise<APIResponse>), 
  timeout: number
) {
  if (!(response instanceof Promise) && typeof response !== 'function') {
      return {
          message: () => `toRespondWithin: expected received value to be a Promise or async function, but got ${typeof response}. ` +
          `Did you await the request? Remove 'wait' to allow measurement.`,
          pass: false
      };
  }
  
  const start = Date.now();
  try {
     if (typeof response === 'function') {
         await response();

     } else {
         await response;
     }
  } catch (e) {
      // If it throws, we measure failure time
  }
  const duration = Date.now() - start;
  
  const pass = duration <= timeout;
  
  if (pass) {
    return {
        message: () => `expected request not to answer within ${timeout}ms, took ${duration}ms`,
        pass: true,
      };
  } else {
      return {
        message: () => `expected request to answer within ${timeout}ms, but took ${duration}ms`,
        pass: false,
      };
  }
}
