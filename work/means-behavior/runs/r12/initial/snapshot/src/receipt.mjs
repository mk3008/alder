export const receiptHeading = 'Booking';

export class ReceiptFormatter {
  format({ id, roomName }) {
    return `${id}: ${roomName}`;
  }
}
