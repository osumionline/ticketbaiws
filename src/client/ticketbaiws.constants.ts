import type TicketBaiWsEnvironment from '../model/common/ticketbaiws-environment.type.js';

const TICKETBAIWS_BASE_URLS: Readonly<Record<TicketBaiWsEnvironment, string>> =
  {
    test: 'https://api-test.ticketbaiws.eus/',
    production: 'https://api.ticketbaiws.eus/',
  };

export default TICKETBAIWS_BASE_URLS;
