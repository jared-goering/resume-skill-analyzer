import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import admin from 'firebase-admin';

// Initialize Firebase Admin (only once in your codebase)
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

// Retrieve the bucket (explicitly specifying the bucket name if needed)
const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET || 'your-bucket-name.appspot.com');
const db = admin.firestore();

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  console.log("POST /api/analyze invoked");

  try {
    // 1. Parse the incoming multipart form data
    console.log("Parsing form data...");
    const formData = await req.formData();

    // 2. Extract fields from the form
    console.log("Extracting email and resume input...");
    const email = formData.get('email') as string | null;
    const resumeFile = formData.get('resume') as File | null;
    const manualResume = formData.get('manualResume') as string | null;

    if (!email || (!resumeFile && !manualResume)) {
      console.error("Missing email or resume input");
      return NextResponse.json(
        { error: 'Email and resume file or manual resume information are required.' },
        { status: 400 }
      );
    }

    // 3. Determine the resume text
    let resumeText = '';
    if (resumeFile) {
      // Process the uploaded file
      console.log("File provided. Processing resume file...");
      console.log("File name:", resumeFile.name);
      console.log("File size:", resumeFile.size);

      console.log("Converting file to buffer...");
      const arrayBuffer = await resumeFile.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      console.log("Buffer snippet:", fileBuffer.toString('utf-8', 0, 4));
      console.log("Buffer length:", fileBuffer.length);

      const fileType = resumeFile.type;
      console.log("File type:", fileType);

      console.log("Parsing file content...");
      if (fileType === 'application/pdf') {
        console.log("Using pdf-parse...");
        try {
          const data = await pdfParse(fileBuffer);
          resumeText = data.text;
        } catch (parseErr) {
          console.error("Error parsing resume file:", parseErr);
          return NextResponse.json(
            { error: 'Error parsing resume file' },
            { status: 500 }
          );
        }
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/msword'
      ) {
        console.log("Using mammoth...");
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        resumeText = result.value;
      } else {
        console.log("Falling back to plain text conversion...");
        resumeText = fileBuffer.toString('utf-8');
      }
    } else if (manualResume) {
      // Use the manual resume text provided by the user
      console.log("Manual resume input provided.");
      resumeText = manualResume;
    }
    console.log("Final resume text length:", resumeText.length);

    // 4. Build the prompt for OpenAI using the extracted resume text
    console.log("Building prompt for OpenAI...");
    const prompt = `
You are an AI career analyst designed to evaluate resumes for individuals considering returning to school to upskill. Your task is to analyze the resume below and rank the user's proficiency in the following predefined skill categories on a scale of 1 to 10. The ranking should be based on work experience, education, certifications, and keywords found in the resume. If a skill is not mentioned or inferred, it should be ranked as 1.

Skill Categories and Skills:

Professional Skills:
- Communication
- Time Management
- Decision Making
- Influencing
- Storytelling
- Planning
- Research Ability

Innovation Skills:
- Observation
- Risk Taking
- Creativity
- Innovation Processes
- Complex Problem Solving
- Collaboration
- Critical Thinking

Digital Skills:
- Digital Fluency
- Scrum
- Agile
- Data Visualization
- Customer Success
- UX Design
- Tech Talent Management
- AI fluency

Leadership Skills:
- Leadership Skills
- Culture Development
- People Management
- Change Management
- Business Sense
- Strategic Thinking

Analyze the resume below and output the results in valid JSON using this structure:

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
}

Resume:
${resumeText}

Please output only valid JSON.
    `;
    console.log("Calling OpenAI with prompt (first 200 chars):", prompt.substring(0, 200));

    // 5. Call OpenAI using the correct integration
    console.log("Calling OpenAI...");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      console.error("No response content from OpenAI");
      return NextResponse.json({ error: "No response from OpenAI." }, { status: 500 });
    }
    console.log("OpenAI response received (first 200 chars):", responseContent.substring(0, 200));

    // 6. Parse the JSON output from OpenAI
    let analysisResults;
    try {
      analysisResults = JSON.parse(responseContent);
    } catch (jsonErr) {
      console.error("Error parsing OpenAI response:", jsonErr);
      return NextResponse.json(
        { error: "Error parsing OpenAI response", raw: responseContent },
        { status: 500 }
      );
    }
    console.log("OpenAI analysis results parsed.");

    // 7. Return the final JSON response with the analysis results
    console.log("Returning final response...");
    return NextResponse.json(
      {
        analysisResults,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing POST /api/analyze:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Hello from /api/analyze" });
}