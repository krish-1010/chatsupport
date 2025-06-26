import { NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET() {
  try {
    const logs = await fs.readFile("chatlog.json", "utf8");
    return NextResponse.json(JSON.parse(logs));
  } catch {
    return NextResponse.json([]);
  }
}
