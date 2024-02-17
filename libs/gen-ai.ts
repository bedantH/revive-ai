import { GoogleGenerativeAI } from "@google/generative-ai";
import { text } from "body-parser";

const genAI = new GoogleGenerativeAI("AIzaSyDCxmNirtIyKTIeqRQCc7vTyGG7Z_ZO8Io");
let location = "Panvel, Maharashtra";

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
        recycling_methods: Name and detailed steps for each recycling method and also add necessary and related links in resources array. (steps should only be array of strings) (2 methods)
        reusing_methods: Name and steps for each reusing method and also add resources array which can contains some tutorial videos links on how to do it. (2 methods)
        nearest_recycling_stations: Name, address, distance, contact, and map link for each station.

        try to keep the output below 4000 letters
  `;

  const result = await model.generateContent([prompt, ...imageParts]);
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
