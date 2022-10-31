import React, { useCallback, useMemo, useState } from 'react';
import {
    FaChevronLeft,
    FaChevronRight,
    FaPlay,
} from 'react-icons/fa';

import {
    Container,
    ContentMovies,
    Movie,
    MovieCard,
    MovieCardControll,
    ButtonLetf,
    ButtonRight,
} from './styles';

interface SectionVideosProps {
    videos: VideosProps[];
    name: string;
}

interface VideosProps {
    id: number,
    type: string,
    name: string,
    category: string,
    imageData: any,
    imageName: string,
    views: number
}

const SectionVideos: React.FC<SectionVideosProps> = ({ name, videos }) => {
    const [marginContent, setMarginContent] = useState(0);

    const MAX_WIDTH_CONTENT = useMemo(() => videos.length * 220, [videos]);

    const handleScrollMovies = useCallback(
        direction => {
            setMarginContent(stateMargin => {
                const newValue = stateMargin + (direction === 'left' ? -400 : 400);

                const isError =
                    MAX_WIDTH_CONTENT + newValue < window.innerWidth || newValue === 400;

                return isError ? stateMargin : newValue;
            });
        },
        [MAX_WIDTH_CONTENT],
    );

    return (
        <Container>
            <h1 style={{color: '#E50914'}}>{name}</h1>

            <ButtonLetf type="button" onClick={() => handleScrollMovies('right')}>
                <FaChevronLeft />
            </ButtonLetf>

            <ContentMovies
                style={{ marginLeft: marginContent, width: MAX_WIDTH_CONTENT }}
            >
                {videos.map(video => (
                    <Movie key={video.id}>
                        <a href={`http://localhost:3000/video/${video.id}`}>
                            <img
                                src={`data:image/png;base64,${video.imageData}`}
                                alt={`${video.name}`}
                            />
                        </a>
                        <MovieCard>
                            <strong>{video.name || video.category}</strong>
                            <p>{video.name}</p>
                            <MovieCardControll>
                                <button type="button" onClick={() => {window.location.href=`http://localhost:3000/video/${video.id}`}}>
                                    <FaPlay /> Assistir
                                </button>
                            </MovieCardControll>
                        </MovieCard>
                    </Movie>
                ))}
            </ContentMovies>

            <ButtonRight type="button" onClick={() => handleScrollMovies('left')}>
                <FaChevronRight />
            </ButtonRight>
        </Container>
    );
};

export default SectionVideos;
