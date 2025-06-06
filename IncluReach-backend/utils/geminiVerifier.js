import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTIONS = `
You are a job posting verification system for AbilityLinks. Analyze job postings for:

1. RED FLAGS (Fake job indicators):
- Vague company information
- Unrealistic salaries (>$100/hour for entry-level)
- Requests for payment
- Poor grammar/spelling
- No clear job responsibilities
- Contact outside platform
- "Earn quick money" claims
- Requests for personal documents upfront

2. VALIDATION CRITERIA:
- Legitimate company name (not generic like "Global Solutions")
- Clear job responsibilities
- Professional description
- No financial requests
- Proper contact methods

Respond STRICTLY in this JSON format:
{
  "isValid": boolean,
  "riskScore": 0-100,
  "redFlags": string[],
  "suggestions": string[]
}
`;

export const verifyJobPosting = async (jobData) => {
  // 1. First do quick client-side checks for obvious scams
  const obviousScamIndicators = [
    {
      pattern: /(\$[0-9,]+\/?(week|month|hour))|(earn.*\$\d+)/i,
      reason: "Unrealistic salary claims",
    },
    {
      pattern: /(pay.*upfront)|(starter.*kit)|(investment required)/i,
      reason: "Requests for payment",
    },
    {
      pattern: /(no experience needed)|(no qualifications)/i,
      test: () => !jobData.title.includes("Intern"), // Allow internships
      reason: "Lack of requirements for professional position",
    },
  ];

  const redFlags = obviousScamIndicators
    .filter(
      ({ pattern, test }) =>
        pattern.test(jobData.title + jobData.description) && (!test || test())
    )
    .map(({ reason }) => reason);

  if (redFlags.length > 0) {
    return {
      isValid: false,
      riskScore: 100,
      redFlags,
      suggestions: ["This appears to be a scam"],
    };
  }

  // 2. If basic checks pass, verify with Gemini
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Verify if this is a legitimate job posting (true/false):
        Title: ${jobData.title}
        Company: ${jobData.company}
        Description: ${jobData.description.substring(0, 200)}...
        Requirements: ${jobData.requirements?.join(", ") || "None"}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().toLowerCase().trim();

    const isValid = text.includes("true");
    return {
      isValid,
      riskScore: isValid ? 0 : 70,
      redFlags: isValid ? [] : ["Potential scam indicators found"],
      suggestions: isValid ? [] : ["Please review job details carefully"],
    };
  } catch (error) {
    console.error("Gemini error:", error);
    // If Gemini fails, allow the job but flag for review
    return {
      isValid: true,
      riskScore: 30,
      redFlags: ["Verification system unavailable"],
      suggestions: ["Job requires manual review"],
    };
  }
};
