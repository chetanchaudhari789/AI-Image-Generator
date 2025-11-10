import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { GenerateImageFromPrompt, CreatePost } from "../../api";

const Form = styled.form`
  flex: 1;
  background: ${({ theme }) => theme.card};
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 20px ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background_alt};
  color: black
  outline: none;
  font-size: 15px;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 4px ${({ theme }) => theme.primary + "80"};
  }
`;

const Textarea = styled.textarea`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background_alt};
  color: black;
  outline: none;
  font-size: 15px;
  resize: none;
  height: 100px;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 4px ${({ theme }) => theme.primary + "80"};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const StyledButton = styled(Button)`
  flex: 1;
  padding: 12px 0 !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  transition: all 0.3s ease !important;

  &.generate {
    background: ${({ theme }) => theme.primary} !important;
    color: #fff !important;
  }

  &.share {
    background: ${({ theme }) => theme.secondary} !important;
    color: #fff !important;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const GenerateImage = ({
  createPostLoading,
  setcreatePostLoading,
  generateImageLoading,
  setGenerateImageLoading,
  post,
  setPost,
}) => {
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!post.prompt) return alert("Please enter a prompt");
    setGenerateImageLoading(true);
    try {
      const res = await GenerateImageFromPrompt({ prompt: post.prompt });
      setPost({ ...post, photo: `data:image/jpeg;base64,${res.photo}` });
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.error || "Image generation failed.");
    } finally {
      setGenerateImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post.name || !post.prompt || !post.photo)
      return alert("Please fill all fields and generate an image first!");

    setcreatePostLoading(true);
    try {
      await CreatePost(post);
      alert("Post created successfully!");
      setPost({ name: "", prompt: "", photo: "" });
    } catch (error) {
      alert(error?.response?.data?.message || "Post creation failed");
    } finally {
      setcreatePostLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Create a New Post</Title>

      <InputWrapper>
        <Label>Your Name</Label>
        <Input
          type="text"
          placeholder="e.g., Chetan Chaudhari"
          value={post.name}
          onChange={(e) => setPost({ ...post, name: e.target.value })}
        />
      </InputWrapper>

      <InputWrapper>
        <Label>Prompt</Label>
        <Textarea
          placeholder="Describe your image prompt here..."
          value={post.prompt}
          onChange={(e) => setPost({ ...post, prompt: e.target.value })}
        />
      </InputWrapper>

      <ButtonRow>
        <StyledButton
          className="generate"
          onClick={handleGenerate}
          disabled={generateImageLoading}
        >
          {generateImageLoading ? "Generating..." : "Generate Image"}
        </StyledButton>

        <StyledButton
          className="share"
          type="submit"
          disabled={createPostLoading}
        >
          {createPostLoading ? "Sharing..." : "Share Post"}
        </StyledButton>
      </ButtonRow>
    </Form>
  );
};

export default GenerateImage;
