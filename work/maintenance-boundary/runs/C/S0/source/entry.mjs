import { bookShipment } from './features/book.mjs';
import { cancelShipment } from './features/cancel.mjs';
import { shipmentDetail } from './features/detail.mjs';

export function createApp({ alphaUrl, alphaToken }) {
  const records = new Map();
  const context = { records, alphaUrl, alphaToken };
  return {
    book: input => bookShipment(context, input),
    cancel: id => cancelShipment(context, id),
    detail: id => shipmentDetail(records, id),
  };
}
