import * as dotenv from "dotenv";
import { createError } from "../error.js";
import fetch from "node-fetch";

dotenv.config();

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return next(createError(400, "Invalid prompt provided."));
    }

    const model = "stabilityai/stable-diffusion-xl-base-1.0";

    // ✅ NEW CORRECT ENDPOINT
    const response = await fetch(
      `https://router.huggingface.co/hf-inference/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: { wait_for_model: true }, // ensures model loads fully
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error:", errorText);
      return next(
        createError(
          response.status,
          `Hugging Face API error: ${errorText}`
        )
      );
    }

    // ✅ Handle the image output properly
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    res.status(200).json({
      success: true,
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
