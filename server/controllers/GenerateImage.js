import * as dotenv from "dotenv";
import { createError } from "../error.js";
import OpenAI from "openai";

dotenv.config();

// Setup OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Controller to generate Image
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    // Validate prompt
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return next(createError(400, "Invalid prompt provided."));
    }

    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    // Check if response is valid
    if (!response || !response.data || !response.data.data) {
      return next(createError(500, "No image data returned from OpenAI."));
    }

    const generatedImage = response.data.data[0].b64_json;
    res.status(200).json({ photo: generatedImage });
  } catch (error) {
    next(
      createError(
        error.status || 500,
        error?.response?.data?.error?.message || error.message || "An error occurred while generating the image."
      )
    );
  }
};