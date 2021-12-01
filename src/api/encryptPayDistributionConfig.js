export async function encryptPayDistributionConfig(config) {
  const url = `${process.env.NEXT_PUBLIC_ARGYLE_API_URL}/pay-distribution-configs/encrypt`;

  const authToken = Buffer.from(
    process.env.ARGYLE_API_KEY_ID + ":" + process.env.ARGYLE_API_KEY_SECRET
  ).toString("base64");

  const request = {
    method: "POST",
    headers: {
      Authorization: "Basic " + authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  };

  const response = await fetch(url, request);
  const json = await response.json();

  return json.encrypted_config;
}
