import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a roofing expert assistant for Roofalo, a residential roofing company in Western New York.
A homeowner has uploaded 1-4 photos of their roof or a roofing concern.

Analyze the image(s) and provide a preliminary, plain-language assessment. Be honest, helpful, and NOT alarming.
WNY climate context: Lake-effect snow, ice dams, freeze-thaw cycles, and older housing stock (many century homes) are common.

Respond with ONLY valid JSON in this exact format:
{
  "title": "Short, plain description (e.g., 'Looks like wind-lifted shingles')",
  "likely": "1-3 sentences in plain language about what you observe and what it typically means. Not alarming, not dismissive.",
  "checklist": ["What an inspector would check — 3 items, each under 15 words"]
}

Rules:
- Never diagnose definitively — always frame as "looks like", "appears to be"
- Never use technical jargon without explaining it
- Never be alarmist
- Always imply a free inspection can confirm
- Keep it warm and human`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // If images were included as base64 in body
    const images = body.images as Array<{ data: string; mediaType: string }> | undefined;

    if (!images || images.length === 0) {
      // Return a generic helpful fallback
      return NextResponse.json({
        title: "Photo received — let us take a closer look",
        likely: "We'd love to give you a proper read. Upload your photo and we'll take a quick look at what might be going on.",
        checklist: [
          "Whether the issue is cosmetic or needs attention",
          "How urgent any repair might be",
          "Whether it's a quick fix or worth inspecting in person",
        ],
      });
    }

    const imageContent = images.slice(0, 4).map((img) => ({
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: img.mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
        data: img.data,
      },
    }));

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            ...imageContent,
            {
              type: "text",
              text: "Please analyze this roof photo and provide your preliminary assessment in the JSON format specified.",
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      title: "Something caught our eye",
      likely: "Your photo came through. Based on common WNY roof issues, this could be weather wear, storm damage, or aging materials — but we'd need a real look to say for sure.",
      checklist: [
        "The overall condition and remaining life of the roof",
        "Whether repairs would suffice or replacement makes more sense",
        "Any signs of water infiltration or structural concerns",
      ],
    });
  }
}
