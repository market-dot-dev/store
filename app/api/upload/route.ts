import { generateId } from "@/lib/utils";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(
      "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
      {
        status: 401
      }
    );
  }

  const file = req.body || "";
  const contentType = req.headers.get("content-type") || "text/plain";
  const filename = `${generateId()}.${contentType.split("/")[1]}`; // @TODO: random ids might not be necessary with @vercel/blob v1 anymore
  const blob = await put(filename, file, {
    contentType,
    access: "public"
  });

  return NextResponse.json(blob);
}
