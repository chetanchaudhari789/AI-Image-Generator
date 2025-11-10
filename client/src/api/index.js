// src/api/index.js
import axios from "axios";

// Base URL of your backend server
const API = axios.create({
  baseURL: "https://ai-image-generator-1hdc.onrender.com/api", // include /api
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to normalize responses that may have different shapes
const getDataArray = (response) => {
  // common shapes: response.data (object), response.data.data (object), response.data.data => array
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response.data) {
    // if response.data.data is array, return it
    if (Array.isArray(response.data.data)) return response.data.data;
    // if response.data is array itself:
    if (Array.isArray(response.data)) return response.data;
    // sometimes backend returns { data: { data: [...] } }
    if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
  }
  // if response is shape { data: [...] }
  if (Array.isArray(response.data)) return response.data;
  // fallback: if response itself is an array return it
  if (Array.isArray(response)) return response;
  return [];
};

// POSTS
export const GetPosts = async () => {
  try {
    const response = await API.get("/post");
    // normalize to array
    const posts = getDataArray(response);
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error.response?.data || error.message);
    throw error;
  }
};

export const CreatePost = async (data) => {
  try {
    const response = await API.post("/post", data);
    // return created post or full response
    return response.data || response;
  } catch (error) {
    console.error("Error creating post:", error.response?.data || error.message);
    throw error;
  }
};

// GENERATE IMAGE
export const GenerateImageFromPrompt = async (data) => {
  try {
    const response = await API.post("/generateImage", data);
    // response.data.photo contains base64 image or response.photo
    const photo =
      response?.data?.photo || response?.photo || response?.data?.image || null;
    return { raw: response?.data ?? response, photo };
  } catch (error) {
    console.error("Error generating image:", error.response?.data || error.message);
    throw error;
  }
};
