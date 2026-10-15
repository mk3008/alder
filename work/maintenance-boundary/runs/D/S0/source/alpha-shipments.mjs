// Alpha's wire format and response validation stay outside application rules.
export function createAlphaShipments({alphaUrl, alphaToken}) {
  const authorization = 'Bearer ' + alphaToken;
  return {
    async book({id, address, grams}) {
      const response = await fetch(alphaUrl + '/shipments', {
        method: 'POST',
        redirect: 'manual',
        headers: {'Content-Type': 'application/json', Authorization: authorization},
        body: JSON.stringify({reference: id, destination: address, weightGrams: grams}),
      });
      if (response.status !== 201) throw new Error('Alpha booking failed');
      const result = await response.json();
      if (!result || typeof result !== 'object' || Array.isArray(result) ||
          result.accepted !== true || typeof result.shipmentId !== 'string' ||
          result.shipmentId.length === 0) {
        throw new Error('Invalid Alpha booking response');
      }
      return result.shipmentId;
    },
    async cancel(trackingId) {
      const response = await fetch(alphaUrl + '/shipments/' + encodeURIComponent(trackingId), {
        method: 'DELETE',
        redirect: 'manual',
        headers: {Authorization: authorization},
      });
      if (response.status !== 204) throw new Error('Alpha cancellation failed');
    },
  };
}
