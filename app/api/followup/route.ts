// app/api/followup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already done.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-bucket-name.appspot.com',
  });
}

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get('email') as string | null;
    const resumeFile = formData.get('resume') as File | null;
    const manualResume = formData.get('manualResume') as string | null;
    const followupResponsesStr = formData.get('followupResponses') as string | null;
    const originalAnalysisStr = formData.get('originalAnalysis') as string | null;
    const questionsStr = formData.get('questions') as string | null;

    if (!email || (!resumeFile && !manualResume)) {
      return NextResponse.json({ error: 'Missing email or resume input.' }, { status: 400 });
    }
    if (!followupResponsesStr) {
      return NextResponse.json({ error: 'Missing follow-up responses.' }, { status: 400 });
    }
    if (!originalAnalysisStr) {
      return NextResponse.json({ error: 'Missing original analysis data.' }, { status: 400 });
    }
    if (!questionsStr) {
      return NextResponse.json({ error: 'Missing follow-up questions.' }, { status: 400 });
    }
    const followupResponses = JSON.parse(followupResponsesStr);
    const originalAnalysis = JSON.parse(originalAnalysisStr);
    const questions = JSON.parse(questionsStr);

    // Process resume text as before.
    let resumeText = '';
    if (resumeFile) {
      const arrayBuffer = await resumeFile.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      const fileType = resumeFile.type;
      if (fileType === 'application/pdf') {
        const data = await pdfParse(fileBuffer);
        resumeText = data.text;
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/msword'
      ) {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        resumeText = result.value;
      } else {
        resumeText = fileBuffer.toString('utf-8');
      }
    } else if (manualResume) {
      resumeText = manualResume;
    }

    // Build a prompt that includes the original analysis and follow-up Q&A.
    const prompt = `
You are an AI career analyst tasked with updating your initial analysis based on additional context provided by the user.

Original Analysis (the candidate's skills were originally scored as follows):
${JSON.stringify(originalAnalysis, null, 2)}

User Follow-up Q&A:
${questions.map((q: string, i: number) => `Question ${i+1}: ${q}\nResponse ${i+1}: ${followupResponses[i] || ''}`).join("\n\n")}

Resume:
${resumeText}

Based on the above, please update the candidate's scores for each skill category accordingly. Output valid JSON using the following structure:

{
  "Professional Skills": {
    "Communication": <number>,
    "Time Management": <number>,
    "Decision Making": <number>,
    "Influencing": <number>,
    "Storytelling": <number>,
    "Planning": <number>,
    "Research Ability": <number>
  },
  "Innovation Skills": {
    "Observation": <number>,
    "Risk Taking": <number>,
    "Creativity": <number>,
    "Innovation Processes": <number>,
    "Complex Problem Solving": <number>,
    "Collaboration": <number>,
    "Critical Thinking": <number>
  },
  "Digital Skills": {
    "Digital Fluency": <number>,
    "Scrum": <number>,
    "Agile": <number>,
    "Data Visualization": <number>,
    "Customer Success": <number>,
    "UX Design": <number>,
    "Tech Talent Management": <number>,
    "AI fluency": <number>
  },
  "Leadership Skills": {
    "Leadership Skills": <number>,
    "Culture Development": <number>,
    "People Management": <number>,
    "Change Management": <number>,
    "Business Sense": <number>,
    "Strategic Thinking": <number>
  }
    
Please output only valid JSON.
    `;

    console.log(prompt)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      return NextResponse.json({ error: "No response from OpenAI." }, { status: 500 });
    }
    let updatedAnalysis;
    try {
      let cleanedResponse = responseContent.trim();
      cleanedResponse = cleanedResponse
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "");
      updatedAnalysis = JSON.parse(cleanedResponse);
    } catch (jsonErr) {
      return NextResponse.json({ error: "Error parsing OpenAI response", raw: responseContent }, { status: 500 });
    }

    return NextResponse.json({ updatedAnalysis }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
