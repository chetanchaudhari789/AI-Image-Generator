// src/components/cards/ImageCard.jsx
import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: 100%;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.black + "20"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Meta = styled.div`
  position: absolute;
  padding: 8px 10px;
  background: rgba(0,0,0,0.4);
  color: white;
  font-size: 12px;
  border-radius: 6px;
  top: 8px;
  left: 8px;
`;

const Wrapper = styled.div`
  position: relative;
`;

const ImageCard = ({ item }) => {
  // Item might contain different fields depending on backend: { photo } or { image } or { prompt, author }
  const photo = item?.photo || item?.image || item?.base64Image || null;
  const author = item?.author || item?.name || "Unknown";
  const prompt = item?.prompt || "";

  const src = photo ? (photo.startsWith("data:") ? photo : `data:image/png;base64,${photo}`) : null;

  if (!src) {
    return (
      <CardContainer>
        <div style={{ textAlign: "center", padding: 12 }}>
          <div style={{ fontWeight: 600 }}>No image</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>{prompt || "No prompt"}</div>
        </div>
      </CardContainer>
    );
  }

  return (
    <Wrapper>
      <CardContainer>
        <Img src={src} alt={prompt || "Generated"} />
      </CardContainer>
      <Meta>{author}</Meta>
    </Wrapper>
  );
};

export default ImageCard;
