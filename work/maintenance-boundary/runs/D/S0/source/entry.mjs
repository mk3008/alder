import {createBookingService} from './booking.mjs';
import {createMemoryRecords} from './memory-records.mjs';
import {createAlphaShipments} from './alpha-shipments.mjs';

export function createApp({alphaUrl, alphaToken}) {
  return createBookingService({
    records: createMemoryRecords(),
    shipments: createAlphaShipments({alphaUrl, alphaToken}),
  });
}
