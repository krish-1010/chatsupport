import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises"; //mannikavum, no db, time saving kaaga 'json' :) file
//todo: url ah env la maathu
const LANGFLOW_URL =
  "http://localhost:7860/api/v1/run/2a6bbeb0-801d-49f1-833e-cd5e27100f11";

export async function POST(req: NextRequest) {
  try {
    const { message, session_id } = await req.json();

    const payload = {
      input_value: message,
      output_type: "chat",
      input_type: "chat",
      session_id: session_id || "user_1",
    };

    const response = await fetch(LANGFLOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

   
    let aiText = "";
    try {
      aiText =
        data.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text ||
        JSON.stringify(data);
    } catch {
      aiText = JSON.stringify(data);
    }

    const logEntry = {
      user: message,
      ai: aiText,
      timestamp: new Date().toISOString(),
      session_id: session_id || "user_1",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let logs: any[] = []; //ts kaaran prechana panran, todo
    try {
      logs = JSON.parse(await fs.readFile("chatlog.json", "utf8"));
    } catch {}
    logs.push(logEntry);
    await fs.writeFile("chatlog.json", JSON.stringify(logs, null, 2));

    return NextResponse.json({ reply: aiText });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || e.toString() },
      { status: 500 }
    );
  }
}
