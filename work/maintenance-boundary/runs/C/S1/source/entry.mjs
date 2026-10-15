import { bookShipment } from './features/book.mjs';
import { cancelShipment } from './features/cancel.mjs';
import { shipmentDetail } from './features/detail.mjs';

export function createApp({ alphaUrl, alphaToken, betaUrl, betaToken }) {
  const records = new Map();
  const context = { records, alphaUrl, alphaToken, betaUrl, betaToken };
  return {
    book: input => bookShipment(context, input),
    cancel: id => cancelShipment(context, id),
    detail: id => shipmentDetail(records, id),
  };
}
