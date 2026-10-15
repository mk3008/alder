# Accepted scope and decisions

This fixture implements only the selected availability, booking and receipt path,
not the whole application. Authentication and other Activities have existing
external owners and are outside this change/review. The supplied actor is trusted
from that authentication boundary. The room and booking dictionaries are the
accepted in-memory test environment. Room administration is outside scope.

For this product, the availability Output means matching room state and overlap
at query time; it is not a promise of admission for a past interval or after state
changes. Booking checks future time and overlap again. The product owner confirmed
this interpretation. The receipt shows the room's current name and stored booking ID.

The product owner explicitly accepted the disk mirror and its operational estimate
for a serialization exercise. It is not an unresolved means choice. File-system
failure may fail receipt delivery; the original stored booking is kept, and the
existing caller retains its booking ID for retry. No stronger receipt-delivery
guarantee is claimed. Local I/O and rebuild behavior are intentional.
