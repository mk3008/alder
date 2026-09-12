# Receipt mirror implementation

The task explicitly selects a disk mirror rebuilt from `service.rooms()` for every receipt. Retain that local implementation choice and the authoritative service dictionary. Read the freshly written JSON to obtain the room name, and reject unknown stored booking IDs before filesystem work. Disk errors propagate as operations permits.

Operations estimates four extra staff-hours per month for support of a shipped mirror. This is a concrete disadvantage versus the existing local Map lookup for the sole stated goal of current names. The estimate is affordable, not a prohibition; neither this implementation nor passing tests approves deployment or commits the product to that future support cost. No alternative means was substituted and no new business policy was inferred.
