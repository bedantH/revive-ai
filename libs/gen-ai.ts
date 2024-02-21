import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export function fileToGenerativePart(
  image: string,
  mimeType: string
): {
  inlineData: {
    data: string;
    mimeType: string;
  };
} {
  return {
    inlineData: {
      data: image,
      mimeType,
    },
  };
}

export async function getTextResponse(
  location: string,
  image: string,
  mimeType: string
): Promise<string> {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const imageParts = [fileToGenerativePart(image, mimeType)];

  const prompt = `
    Item: Identify the object from the given image
    Location: ${location}
    Task:
        Provide creative methods each for reusing, recycling and reducing of the item shown in the image.
        Include step-by-step descriptive and detailed instructions for each method.
        Find and list details of the nearest recycling stations in ${location}
    Format: JSON response with specific fields:
        object: Name of the object in the image
        recycling_methods: Name and detailed steps for each recycling method
        reusing_methods: Name and steps for each reusing method

        try to keep the output below 4000 letters
  `;

  let result;
  let response;
  try {
    result = await model.generateContent([prompt, ...imageParts]);
    response = await result.response;
  } catch (err) {
    console.log(err);
    return "Error in generating response";
  }

  let text = response
    .text()
    .replace("```", "")
    .replace("```", "")
    .replace("JSON", "")
    .replace("json", "");

  try {
    text = JSON.parse(text);
  } catch (err) {
    console.log(err);
    return "Invalid JSON format";
  }

  return text;
}

export async function getNearestStations(location: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    give a list of 6 nearby recycling facilities within a radius of 1 mile around this location: ${location} in JSON
    Nearest Recycling Stations: Name, address, distance, contact, and map link
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  let text = response
    .text()
    .replace("```", "")
    .replace("```", "")
    .replace("JSON", "")
    .replace("json", "");

  try {
    text = JSON.parse(text);
  } catch (err) {
    console.log(err);
    return "Invalid JSON format";
  }

  return text;
}
