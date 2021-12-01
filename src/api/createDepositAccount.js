export async function createDepositAccount() {
  const url = `${process.env.UNIT_API_URL}/accounts`;

  const request = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.UNIT_API_KEY,
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "depositAccount",
        attributes: {
          depositProduct: "checking",
          tags: {
            purpose: "checking",
          },
        },
        relationships: {
          customer: {
            data: {
              type: "customer",
              id: process.env.UNIT_CUSTOMER_ID,
            },
          },
        },
      },
    }),
  };

  const response = await fetch(url, request);
  const json = await response.json();

  return json.data;
}
