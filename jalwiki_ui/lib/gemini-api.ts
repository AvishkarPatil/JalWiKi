import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Part,
  Content,
} from "@google/generative-ai";

export interface GeminiRecommendation {
  id: number;
  title: string;
  slug: string;
  added_by: number;
  impact: "low" | "medium" | "high";
  region: Array<{ id: number; name: string }>;
  categories: Array<{
    id: number;
    name: string;
    description: string;
  }>;
  summary: string;
  detailed_content: string;
  benefits: string[];
  materials: string[];
  steps: string[];
  main_image: string;
  created_on: string;
  updated_on: string;
  is_published: boolean;
  likes: any[];
  images: Array<{
    id: number;
    image_url: string;
    caption: string;
    order: number;
    type: string;
  }>;
}

// Helper function to convert File to GenerativePart
// This function is client-side specific due to FileReader.
async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(",")[1]); // Get base64 part
      } else {
        reject(new Error("Failed to read file as base64 string."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}


const systemInstructionParts: Part[] = [{
  text: `You are a water conservation expert assistant. Your job is to suggest *one* personalized water-saving technique or method based on the provided user profile.

You MUST respond in **pure JSON format** and match the schema below. If any field is not applicable for the selected context, provide an appropriate empty value (e.g., empty string "", empty array [], or 0 for numbers where applicable). Do NOT add or remove any fields. Do NOT include explanations or markdown.

Use the following JSON format for your response:

{
  "id": 0,
  "title": "<technique name>",
  "slug": "<URL-friendly title, lowercase with hyphens>",
  "added_by": 0,
  "impact": "<low | medium | high>",
  "region": [],
  "categories": [
    {
      "id": 0,
      "name": "<category name related to userType or technique>",
      "description": "<short category description>"
    }
  ],
  "summary": "<1 sentence explanation of the technique>",
  "detailed_content": "<detailed description of the method, how it helps save water, and basic implementation steps>",
  "benefits": [
    "<benefit 1>",
    "<benefit 2>"
  ],
  "materials": [
    "<material 1>",
    "<material 2>"
  ],
  "steps": [
    "<step 1: Detailed explanation>",
    "<step 2: Detailed explanation>"
  ],
  "main_image": "<URL to a relevant placeholder or leave empty if none>",
  "created_on": "${new Date().toISOString()}",
  "updated_on": "${new Date().toISOString()}",
  "is_published": true,
  "likes": [],
  "images": [
    { "id": 0, "image_url": "<URL to relevant image or placeholder>", "caption": "<Brief image caption>", "order": 1, "type": "illustration" }
  ]
}
`,
}];


export async function getWaterEfficiencyRecommendation(formData: any): Promise<GeminiRecommendation> {
  const apiKey = "AIzaSyBVow81VcDgXNwRUGz7Z3wkCzP8ti-wLw8";
  if (!apiKey) {
    console.error("NEXT_PUBLIC_GEMINI_API_KEY is not set.");
    throw new Error("API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  // Construct the text prompt from formData
  let userPromptText = `User Profile for Water Saving Recommendation:
- Location: ${formData.location || "Not specified"}
- User Type: ${formData.userType || "Not specified"}
- Current Water Usage (Optional): ${formData.waterUsage || "Not specified"}
- Current Water Practices (Optional): ${formData.currentPractices || "Not specified"}
- Current Water Resource (Optional): ${formData.currentWaterResource || "Not specified"}
- Rainwater Harvesting Present: ${formData.rainwaterHarvesting === "yes" ? "Yes" : "No"}
- Size (e.g., household members, farm area, facility sq ft - Optional): ${formData.size || "Not specified"}
- Water Usage Areas (Optional): ${formData.waterUsageAreas || "Not specified"}
- Awareness Level: ${formData.awarenessLevel || "Not specified"}
`;
  if (formData.userType === "agriculture") {
    userPromptText += `\n- Land Area (Optional): ${formData.landArea || "Not specified"}`;
    userPromptText += `\n- Crop Type (Optional): ${formData.cropType || "Not specified"}`;
  } else if (formData.userType === "industry") {
    userPromptText += `\n- Industry Type (Optional): ${formData.industryType || "Not specified"}`;
  }
  userPromptText += "\nPlease provide one specific, actionable water-saving technique based on this profile, following the JSON schema provided in the system instructions.";

  const promptParts: Part[] = [{ text: userPromptText }];

  if (formData.image && formData.image instanceof File) {
    try {
      const imagePart = await fileToGenerativePart(formData.image);
      promptParts.push(imagePart);
      promptParts.push({text: "\nConsider the uploaded image (if relevant) showing the user's space or context when making your recommendation."});
    } catch (error) {
      console.error("Error processing image for Gemini:", error);
      // Decide if you want to throw or proceed without image
      // For now, proceeding without image if conversion fails
    }
  }

  console.log("Sending to Gemini. Prompt parts:", promptParts.map(p => p.text ? `Text: ${p.text.substring(0,100)}...` : (p.inlineData ? `Image: ${p.inlineData.mimeType}`: 'Unknown Part')) );

  try {
    const result = await model.generateContent({
        contents: [{ role: "user", parts: promptParts }],
        // Corrected systemInstruction: Wrap Part[] in a Content object
        systemInstruction: {
            role: "system", // Or "model" if preferred by SDK for system prompts
            parts: systemInstructionParts
        },
        generationConfig: {
            responseMimeType: "application/json",
        },
        // Optional: Configure safety settings if needed
        // safetySettings: [
        //   { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        //   { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        // ],
    });

    const response = result.response;
    const responseText = response.text();

    console.log("Gemini Raw Response Text:", responseText);

    if (!responseText) {
        throw new Error("Empty response from Gemini API.");
    }

    let parsedJson: GeminiRecommendation;
    try {
        parsedJson = JSON.parse(responseText) as GeminiRecommendation;
    } catch (e) {
        console.error("Failed to parse Gemini JSON response:", e);
        console.error("Problematic Gemini Response:", responseText); // Log the problematic response
        throw new Error("Invalid JSON response from Gemini API. Check the console for the raw response.");
    }

    console.log("Gemini Parsed JSON:", parsedJson);
    return parsedJson;

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    // Check for specific error types from Gemini if available, e.g., safety blocks
    if (error.message && error.message.includes("SAFETY")) { // Basic check
        throw new Error("Content blocked by Gemini safety filters. Please revise your input or adjust safety settings.");
    }
    if (error.message && error.message.includes("API key not valid")) {
        throw new Error("Invalid Gemini API Key. Please check your .env.local file.");
    }
    throw new Error(`Failed to get recommendation from Gemini API: ${error.message || 'Unknown error'}`);
  }
}