export async function generateRPM({
  apiKey,
  payload,
}: {
  apiKey: string;
  payload: any;
}) {
  const res = await fetch("/api/v1/generate-rpm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apiKey, payload }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed generate RPM");
  }

  return data.data;
}
