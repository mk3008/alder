import {createBookingService} from './booking.mjs';
import {createMemoryRecords} from './memory-records.mjs';
import {createAlphaShipments} from './alpha-shipments.mjs';

import {createBetaShipments} from './beta-shipments.mjs';

export function createApp({alphaUrl, alphaToken, betaUrl, betaToken}) {
  return createBookingService({
    records: createMemoryRecords(),
    shipments: {
      alpha: createAlphaShipments({alphaUrl, alphaToken}),
      beta: createBetaShipments({betaUrl, betaToken}),
    },
  });
}
