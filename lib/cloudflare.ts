import Cloudflare from "cloudflare";

const client = new Cloudflare({
  apiEmail: process.env["CLOUDFLARE_API_EMAIL"],
  apiKey: process.env["CLOUDFLARE_API_KEY"],
});

export async function getValue<T>(key: string) {
  return client.kv.namespaces.values
    .get(process.env["CLOUDFLARE_KV_NAMESPACE"]!, key, {
      account_id: process.env["CLOUDFLARE_ACCOUNT_ID"]!,
    })
    .then((response) => response.json())
    .then((data) => data.value as string)
    .catch(() => "");
}

export const setValue = async (key: string, value: string) => {
  return client.kv.namespaces.values.update(
    process.env["CLOUDFLARE_KV_NAMESPACE"]!,
    key,
    {
      account_id: process.env["CLOUDFLARE_ACCOUNT_ID"]!,
      value,
      metadata: JSON.stringify({}),
    }
  );
};
