// Alpha's wire contract is isolated here; the application owns local records.
export function createAlphaClient({alphaUrl, alphaToken}) {
  const authorization = 'Bearer ' + alphaToken;
  return {
    async book({id, address, grams}) {
      const response = await fetch(alphaUrl + '/shipments', {
        method: 'POST',
        redirect: 'error',
        headers: {'Content-Type': 'application/json', Authorization: authorization},
        body: JSON.stringify({reference: id, destination: address, weightGrams: grams}),
      });
      if (response.status !== 201) throw new Error('Alpha booking failed');
      const body = await response.json();
      if (body === null || typeof body !== 'object' || Array.isArray(body) ||
          body.accepted !== true || typeof body.shipmentId !== 'string' ||
          body.shipmentId.length === 0) {
        throw new Error('Invalid Alpha booking response');
      }
      return body.shipmentId;
    },
    async cancel(trackingId) {
      const response = await fetch(alphaUrl + '/shipments/' + encodeURIComponent(trackingId), {
        method: 'DELETE',
        redirect: 'error',
        headers: {Authorization: authorization},
      });
      if (response.status !== 204) throw new Error('Alpha cancellation failed');
    },
  };
}
