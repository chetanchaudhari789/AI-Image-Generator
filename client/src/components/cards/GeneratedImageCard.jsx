// src/components/cards/GeneratedImageCard.jsx
import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  padding: 16px;
  border: 2px dashed ${({ theme }) => theme.yellow + "90"};
  color: ${({ theme }) => theme.arrow + "80"};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 320px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.black + "50"};
  border-radius: 18px;
  object-fit: cover;
`;

const GeneratedImageCard = ({ src, loading }) => {
  // src might be base64 without data: prefix
  const imgSrc = src ? (src.startsWith("data:") ? src : `data:image/png;base64,${src}`) : null;

  return (
    <Container>
      {loading ? (
        <>
          <CircularProgress sx={{ color: "inherit", width: "24px", height: "24px" }} />
          Generating Your Image . . .
        </>
      ) : imgSrc ? (
        <Image src={imgSrc} alt="Generated result" />
      ) : (
        <>Write a prompt to generate image</>
      )}
    </Container>
  );
};

export default GeneratedImageCard;
