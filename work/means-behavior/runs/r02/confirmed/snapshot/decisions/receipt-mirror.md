# Receipt mirror choice

After considering the existing local lookup and the additional operational estimate, the requester confirmed retaining the disk mirror. Exercising JSON serialization and rebuild behavior is now an explicit acceptance condition. This resolves the previously raised means choice; it does not authorize deployment.

The reader rebuilds the JSON mirror from `service.rooms()` on every valid receipt request, reads that file, and resolves the stored booking's room from the parsed data. Disk failures propagate as allowed by operations. The authoritative room and booking dictionaries remain unchanged.
