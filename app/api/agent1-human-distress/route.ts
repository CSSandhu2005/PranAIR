import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.HF_API_KEY) {
      return NextResponse.json(
        { error: "HF_API_KEY missing" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/detr-resnet-50",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": image.type || "image/jpeg",
          Accept: "application/json",
        },
        body: buffer,
      }
    );

    const text = await response.text();

    // If model is still loading
    if (!text.trim().startsWith("[")) {
      console.log("HF RAW RESPONSE:", text);
      return NextResponse.json(
        { error: "Vision model warming up. Try again in 10 seconds." },
        { status: 503 }
      );
    }

    const detections = JSON.parse(text);

    const people = detections.filter((d: any) => d.label === "person");

    const confidence =
      people.length > 0 ? Math.max(...people.map((p: any) => p.score)) : 0;

    const urgency =
      people.length === 0 ? "Low" : confidence > 0.7 ? "High" : "Medium";

    return NextResponse.json({
      success: true,
      analysis: {
        humanVisible: people.length > 0,
        numberOfPeople: people.length,
        bodyPosture: "unknown",
        visibleBlood: false,
        signsOfDistress: people.length ? ["Human detected"] : [],
        movementObserved: false,
        personLyingDown: false,
        appearsMotionless: false,
        urgencyLevel: urgency,
        lifeThreat: urgency,
        summary:
          people.length > 0
            ? "Human detected in the scene"
            : "No person detected",
        confidence,
      },
    });
  } catch (err: any) {
    console.error("Agent 1 HF Error:", err);
    return NextResponse.json(
      { error: "Vision failed", message: err.message },
      { status: 500 }
    );
  }
}
