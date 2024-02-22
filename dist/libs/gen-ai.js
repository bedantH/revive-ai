"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearestStations = exports.getTextResponse = exports.fileToGenerativePart = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
function fileToGenerativePart(image, mimeType) {
    return {
        inlineData: {
            data: image,
            mimeType,
        },
    };
}
exports.fileToGenerativePart = fileToGenerativePart;
function getTextResponse(location, image, mimeType) {
    return __awaiter(this, void 0, void 0, function* () {
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
            result = yield model.generateContent([prompt, ...imageParts]);
            response = yield result.response;
        }
        catch (err) {
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
        }
        catch (err) {
            console.log(err);
            return "Invalid JSON format";
        }
        return text;
    });
}
exports.getTextResponse = getTextResponse;
function getNearestStations(location) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
    give a list of 6 nearby recycling facilities within a radius of 1 mile around this location: ${location} in JSON
    Nearest Recycling Stations: Name, address, distance, contact, and map link
  `;
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        let text = response
            .text()
            .replace("```", "")
            .replace("```", "")
            .replace("JSON", "")
            .replace("json", "");
        try {
            text = JSON.parse(text);
        }
        catch (err) {
            console.log(err);
            return "Invalid JSON format";
        }
        return text;
    });
}
exports.getNearestStations = getNearestStations;
