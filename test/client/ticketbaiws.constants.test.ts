import { describe, expect, it } from 'vitest';

import TICKETBAIWS_BASE_URLS from '../../src/client/ticketbaiws.constants.js';

describe('TICKETBAIWS_BASE_URLS', (): void => {
  it('defines the test environment URL', (): void => {
    expect(TICKETBAIWS_BASE_URLS.test).toBe(
      'https://api-test.ticketbaiws.eus/',
    );
  });

  it('defines the production environment URL', (): void => {
    expect(TICKETBAIWS_BASE_URLS.production).toBe(
      'https://api.ticketbaiws.eus/',
    );
  });
});
