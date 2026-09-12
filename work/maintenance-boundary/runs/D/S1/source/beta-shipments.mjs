// Beta implements the same application-facing operations as Alpha.
export function createBetaShipments({betaUrl, betaToken}) {
  async function post(path, body) {
    const response = await fetch(betaUrl + path, {
      method: 'POST',
      redirect: 'manual',
      headers: {'Content-Type': 'application/json', 'X-Api-Key': betaToken},
      body: JSON.stringify(body),
    });
    if (response.status !== 200) throw new Error('Beta request failed');
    const result = await response.json();
    if (!result || typeof result !== 'object' || Array.isArray(result) || result.ok !== true) {
      throw new Error('Invalid Beta response');
    }
    return result;
  }

  return {
    async book({id, address, grams}) {
      const result = await post('/v2/jobs', {
        client_ref: id,
        parcel: {destination: address, mass_kg: grams / 1000},
      });
      if (!result.job || typeof result.job !== 'object' || Array.isArray(result.job) ||
          typeof result.job.code !== 'string' || result.job.code.length === 0) {
        throw new Error('Invalid Beta booking response');
      }
      return result.job.code;
    },
    async cancel(trackingId) {
      await post('/v2/void', {job_code: trackingId});
    },
  };
}
