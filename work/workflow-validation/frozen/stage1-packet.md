# Stage 1 — report equipment fault

At the time a site reporter observes a fault, they record the equipment,
reporter identity, observation time, and nonblank description. The request is
open. The application must reject an unknown equipment id. A reporter may make
more than one request; no deduplication policy is supplied.

Current Business Rules: a request has an existing equipment, a nonblank
description, and begins open. No later activity is part of this packet.
