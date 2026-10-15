# Receipt task context

The receipt shows the current room name, not a historical name frozen at booking.
The authoritative room dictionary is already in this process. `service.room(id)`
performs a local Map lookup; it has no database or network hop.

The product's operational estimate for a shipped disk mirror is four additional
staff-hours per month for corruption/failure support and ownership, compared with
no extra component support for the current lookup. The team can afford this;
it is an estimate, not a measured incident rate or a hard prohibition.
The only stated product goal for the requested mirror is displaying current room
names. No offline or independent deployment requirement has been stated.

This task authorizes only local implementation/tests. Do not deploy anything.
Disk errors may propagate to the caller; no fallback, daemon, recovery service,
or new business policy is required. The source dictionary remains authoritative.
