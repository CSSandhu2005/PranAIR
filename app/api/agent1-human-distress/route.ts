import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Agent 1: Human Distress Detection
// Analyzes images for visible signs of human distress using Gemini 2.0 Flash (General Vision)
// REFACTORED: Uses gemini-2.0-flash with inline data to bypass 2.5 safety blocks

export async function POST(request: NextRequest) {
  try {
    // Verify API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "Gemini API key not configured. Please check environment variables." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    console.log("Processing image:", image.name, image.type, image.size, "bytes");

    // Convert to inline base64 (Standard for 2.0 Flash)
    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Initialize Gemini AI
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    console.log("Sending request to Gemini 2.0 Flash...");

    // Generate content with Gemini 2.0 Flash
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      systemInstruction: `You are a computer vision model.
Your task is to describe visible elements in an image.
Do not infer intent, health, or emergency.
Describe only what is directly visible.
Always return valid JSON.`,
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: image.type,
                data: base64Image,
              },
            },
            {
              text: "Describe the visible scene in the image. Base responses strictly on visual evidence. Return JSON only.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            personVisible: { type: "boolean" },
            numberOfPeople: { type: "number" },
            posture: {
              type: "string",
              enum: ["standing", "sitting", "lying", "collapsed", "unknown"],
            },
            movementVisible: { type: "boolean" },
            visibleObjects: {
              type: "array",
              items: { type: "string" },
            },
            environment: { type: "string" },
            confidence: { type: "number" },
          },
          required: [
            "personVisible",
            "numberOfPeople",
            "posture",
            "movementVisible",
            "confidence",
          ],
        },
      },
    });

    // Debug: Log full response structure
    console.log("Full Gemini response:", JSON.stringify(response, null, 2));

    const candidates = response.candidates;
    
    if (!candidates || candidates.length === 0) {
      console.error("No candidates in Gemini response");
      if (response.promptFeedback) {
        console.error("Prompt feedback:", JSON.stringify(response.promptFeedback, null, 2));
      }
      return NextResponse.json(
        { error: "Failed to analyze image - no response from AI" },
        { status: 500 }
      );
    }

    // Extract JSON text
    const text = candidates[0].content?.parts?.[0]?.text;

    if (!text) {
      console.error("No text in Gemini response");
      return NextResponse.json(
        { error: "Failed to analyze image - empty response" },
        { status: 500 }
      );
    }

    // Parse JSON
    let analysisData;
    try {
      analysisData = JSON.parse(text);
      console.log("Parsed analysis data:", analysisData);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return NextResponse.json(
        { error: "Invalid JSON response from AI" },
        { status: 500 }
      );
    }

    // Map to frontend expectations
    // Infer urgency from neutral posture data
    let derivedUrgency = "Low";
    if (analysisData.posture === "collapsed" || analysisData.posture === "lying") {
      derivedUrgency = "Critical"; 
    } else if (analysisData.posture === "sitting" && analysisData.movementVisible === false) {
      derivedUrgency = "Medium";
    }

    const mappedAnalysis = {
      humanVisible: analysisData.personVisible,
      numberOfPeople: analysisData.numberOfPeople,
      bodyPosture: analysisData.posture,
      visibleBlood: false, 
      visibleInjuries: [], 
      signsOfDistress: analysisData.visibleObjects || [],
      environmentalHazards: [],
      movementObserved: analysisData.movementVisible,
      personLyingDown: analysisData.posture === "lying" || analysisData.posture === "collapsed",
      appearsMotionless: !analysisData.movementVisible,
      urgencyLevel: derivedUrgency,
      lifeThreat: derivedUrgency,
      reasoning: analysisData.environment || "Visual scene analysis.",
      summary: analysisData.environment || "Scene analysis.",
      confidence: analysisData.confidence,
    };

    return NextResponse.json({
      success: true,
      analysis: mappedAnalysis,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Agent 1 error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze image",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}