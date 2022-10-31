import React, { useState, useEffect } from 'react';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import {
  Container,
  MovieBackground,
  Content,
  MovieInfo,
  MovieButtons,
  MovieButtonPlay,
  MovieButtonMoreAbout,
} from './styles';

interface VideosProps {
  id: number,
  type: string,
  name: string,
  category: string,
  imageData: any,
  imageName: string,
  views: number
}

const FeaturedMovie: React.FC<{ video: VideosProps }> = ({ video }) => {
  return (
    <Container>
      {video.id && (
        <MovieBackground image={video.imageData}>
          <div>
            <Content>
              <h1>{video.name}</h1>
              <MovieInfo>
                <span>{video.views} views</span>
              </MovieInfo>
              <span>
                <strong>Categoria:</strong> {video.category}
              </span>
              <MovieButtons>
                <MovieButtonPlay href={`http://localhost:3000/video/${video.id}`}>
                    <FaPlay /> Assistir
                </MovieButtonPlay>
              </MovieButtons>
            </Content>
          </div>
        </MovieBackground>
      )}
    </Container>
  );
};

export default FeaturedMovie;
