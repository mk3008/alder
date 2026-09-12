# Stage 6 environment and verification assumptions

These are not Business Rules. The external inventory boundary eventually yields a result for an outstanding reservation request, eventually completes a processable release request, and the application continues to process those authoritative events. Permanent external unavailability is outside the liveness claim. Tests use `InventoryAuthorityFake`, independent from production DDL/local reservation status, to observe held inventory separately.
