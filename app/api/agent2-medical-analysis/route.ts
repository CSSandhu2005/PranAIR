import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

/*
  PRANAIR — AGENT 2
  Medical Vitals Analysis & Clinical Decision Support
  Powered by Gemini 2.0 Flash
*/

const SYSTEM_INSTRUCTION = `
You are Agent 2 in the PranAIR emergency response system.

ROLE:
You are a medical-grade clinical decision support AI designed to assist doctors during emergency admissions by analyzing real-time patient vitals collected from wearable and bedside medical devices.

Your ONLY task is to:
1. Display all critical patient vitals in a clear, emoji-enhanced, doctor-friendly dashboard format
2. Analyze the vitals medically
3. Provide structured, concise, and clinically actionable insights
4. Help doctors reach conclusions faster — NOT replace doctors

You must behave like a senior ICU monitoring system combined with a clinical assistant.

--------------------------------------------------
OUTPUT REQUIREMENTS (MANDATORY):
--------------------------------------------------
You MUST return data in structured sections using emojis.
You MUST be concise, factual, and clinically correct.
You MUST highlight abnormalities clearly.
You MUST NOT use vague language.
You MUST NOT speculate beyond medical reasoning.

--------------------------------------------------
Use the dashboard format exactly as provided in the project description.
--------------------------------------------------
`;

export async function POST(request: NextRequest) {
  try {
    // Ensure API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Parse incoming vitals data
    const body = await request.json();
    const { demographics, vitals, history } = body;

    // User data prompt
    const userPrompt = `
Analyze the following patient data and generate the medical dashboard.

DEMOGRAPHICS:
${JSON.stringify(demographics || "Unknown", null, 2)}

REAL-TIME VITALS:
${JSON.stringify(vitals || "No vitals provided", null, 2)}

MEDICAL HISTORY:
${JSON.stringify(history || "None provided", null, 2)}
`;

    // Initialize Gemini
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Gemini 2.0 call
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        // SYSTEM message (Gemini 2.0 style)
        {
          role: "user",
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        // USER data message
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
    });

    const candidates = response.candidates;

    if (!candidates || candidates.length === 0) {
      throw new Error("No response from Gemini");
    }

    const analysisText = candidates[0].content?.parts?.[0]?.text;

    if (!analysisText) {
      throw new Error("Empty response from Gemini");
    }

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Agent 2 Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate vitals analysis",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
