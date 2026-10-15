// Beta's wire contract uses the same small application-facing interface as Alpha.
export function createBetaClient({betaUrl, betaToken}) {
  async function post(path, payload) {
    const response = await fetch(betaUrl + path, {
      method: 'POST',
      redirect: 'error',
      headers: {'Content-Type': 'application/json', 'X-Api-Key': betaToken},
      body: JSON.stringify(payload),
    });
    if (response.status !== 200) throw new Error('Beta request failed');
    const body = await response.json();
    if (body === null || typeof body !== 'object' || Array.isArray(body) || body.ok !== true) {
      throw new Error('Invalid Beta response');
    }
    return body;
  }

  return {
    async book({id, address, grams}) {
      const body = await post('/v2/jobs', {
        client_ref: id,
        parcel: {destination: address, mass_kg: grams / 1000},
      });
      if (body.job === null || typeof body.job !== 'object' || Array.isArray(body.job) ||
          typeof body.job.code !== 'string' || body.job.code.length === 0) {
        throw new Error('Invalid Beta booking response');
      }
      return body.job.code;
    },
    async cancel(trackingId) {
      await post('/v2/void', {job_code: trackingId});
    },
  };
}
