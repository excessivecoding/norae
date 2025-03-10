import { NextResponse } from "next/server";

// Type for KV operations
type KVOperation = {
  method: "GET" | "PUT";
  key: string;
  value?: any;
};

export async function POST(request: Request) {
  try {
    const body: KVOperation = await request.json();
    const { method, key, value } = body;

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    // Access KV through Cloudflare binding
    if (method === "GET") {
      const result = await (KV as any).get(key);
      return NextResponse.json({ data: result || null });
    } else if (method === "PUT") {
      if (value === undefined) {
        return NextResponse.json(
          { error: "Value is required for PUT operation" },
          { status: 400 }
        );
      }

      await (KV as any).put(key, value);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Invalid method. Must be GET or PUT" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("KV API error:", error);
    return NextResponse.json(
      { error: "Failed to perform KV operation" },
      { status: 500 }
    );
  }
}
