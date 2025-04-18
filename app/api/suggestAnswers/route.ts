// app/api/suggestAnswers/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// You may need to adjust your import or environment variable usage
// depending on your project structure.
export async function POST(req: NextRequest) {
  try {
    const { question, originalAnalysis, resume } = await req.json();

    // Build a prompt for short answer suggestions
    const prompt = `
You are an AI that suggests 3-4 short and concise, relevant and different answers to a follow-up question about a user's resume. Vary the types of answers ranging from a lot of experience in this area to little experience. Make it short.
The user question is: "${question}".
Their original analysis: ${originalAnalysis || "N/A"}
Their resume content: ${resume || "N/A"}

Please return valid JSON in the format:
{
  "suggestions": [
    "Short answer suggestion 1...",
    "Short answer suggestion 2..."
  ]
}
    `;

    // Call OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-2024-08-06',
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      // If no content, return empty suggestions
      return NextResponse.json({ suggestions: [] });
    }

    // Remove any triple-backticks from the response
    let cleaned = responseContent.trim();
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "");

    // Parse the JSON
    let suggestions: string[] = [];
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        suggestions = parsed.suggestions;
      }
    } catch (err) {
      // If there's an error, fallback to empty array
      console.error("Error parsing suggestions:", err);
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
