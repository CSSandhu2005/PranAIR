import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const prompt = `
You are PranAIR, an emergency response AI.

Analyze this emergency report:
"${message}"

Decide:
1. Is it an emergency?
2. What category?
3. How severe?
4. What should PranAIR do?

Reply ONLY in valid JSON:
{
  "emergency": true,
  "category": "",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "priority": 1,
  "suggested_drone_kit": [],
  "recommended_action": ""
}
`;
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/gemma-2b-it",
      {
        inputs: prompt,
        parameters: { max_new_tokens: 300 },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data[0].generated_text;

    console.log("HF RAW:", text);

    // Safer JSON extraction
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON found in HuggingFace response");
    }

    const result = JSON.parse(match[0]);

    return NextResponse.json(result);
  } catch (e: any) {
    console.error("TRIAGE ERROR:", e);
    return NextResponse.json(
      { error: "Triage AI failed", detail: String(e) },
      { status: 500 }
    );
  }
}
