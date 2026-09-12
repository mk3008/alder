# Accepted scope and decisions

This fixture implements only the selected availability, booking and receipt path,
not the whole application. Authentication and other Activities have existing
external owners and are outside this change/review. The supplied actor is trusted
from that authentication boundary. The room and booking dictionaries are the
accepted in-memory test environment. Room administration is outside scope.

The product owner has not decided the guarantee made by the availability Output
"予約可能な会議室の一覧". No separate contract clarifies its relationship to
booking eligibility. No alternative query/UI solution has been approved.
