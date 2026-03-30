import React from 'react';
import { useEffect, useRef } from 'react';

const VideoBackground = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Optimize performance by reducing unused frames
        const handlePlay = () => {
            if (videoRef.current) {
                videoRef.current.playbackRate = 0.5; // Adjust playback speed if necessary
            }
        };

        const video = videoRef.current;
        if (video) {
            video.addEventListener('play', handlePlay);
            return () => { video.removeEventListener('play', handlePlay); };
        }
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            <video ref={videoRef} autoPlay muted loop style={{ position: 'absolute', top: '50%', left: '50%', minWidth: '100%', minHeight: '100%', width: 'auto', height: 'auto', transform: 'translate(-50%, -50%)', zIndex: -1 }}>
                <source src="path_to_your_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div style={{ position: 'relative', zIndex: 1, color: 'white', textAlign: 'center' }}>
                <h1>Welcome to My Page</h1>
                <p>Your content goes here!</p>
            </div>
        </div>
    );
};

export default VideoBackground;
