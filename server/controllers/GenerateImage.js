import * as dotenv from "dotenv";
import { createError } from "../error.js";
import fetch from "node-fetch";

dotenv.config();

/**
 * Controller: Generate Image using Hugging Face API
 * 
 * - Uses the free Hugging Face inference API for text-to-image generation
 * - Works with models like stabilityai/stable-diffusion-2
 * - Returns a base64 image to the client
 */
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    // ✅ Validate prompt
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return next(createError(400, "Invalid prompt provided."));
    }

    // ✅ Choose a model (you can change this)
    const model = "stabilityai/stable-diffusion-2";

    // ✅ Send request to Hugging Face API
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return next(
        createError(
          response.status,
          `Hugging Face API error: ${errorText || "Failed to generate image"}`
        )
      );
    }

    // ✅ Convert image buffer to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // ✅ Return the image as base64 to frontend
    res.status(200).json({
      photo: `data:image/png;base64,${base64Image}`,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    next(
      createError(
        error.status || 500,
        error.message || "An error occurred while generating the image."
      )
    );
  }
};
