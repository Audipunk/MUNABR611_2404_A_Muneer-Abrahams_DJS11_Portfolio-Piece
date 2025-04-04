/* eslint-disable react/prop-types */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Flex, Text, Slider } from '@radix-ui/themes';
import { PlayIcon, PauseIcon, Cross1Icon } from '@radix-ui/react-icons';

function AudioPlayer({ currentEpisode, onComplete, updatePlaybackPosition, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(currentEpisode?.currentTime || 0);
  const [duration, setDuration] = useState(0);
  const [isVisible, setIsVisible] = useState(true); // Track visibility state
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', setAudioDuration);
      audioRef.current.addEventListener('ended', handleAudioEnd);
      return () => {
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('loadedmetadata', setAudioDuration);
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      };
    }
  }, []);

  useEffect(() => {
    if (currentEpisode) {
      audioRef.current.src = currentEpisode.file;
      audioRef.current.currentTime = currentEpisode.currentTime || 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentEpisode]);

  const togglePlay = () => {
    if (currentEpisode) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateTime = () => {
    setCurrentTime(audioRef.current.currentTime);
    updatePlaybackPosition(currentEpisode.id, audioRef.current.currentTime);
  };

  const setAudioDuration = () => {
    setDuration(audioRef.current.duration);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onComplete) {
      onComplete(currentEpisode);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (value) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    updatePlaybackPosition(currentEpisode.id, newTime);
  };

  const handleClose = () => {
    setIsVisible(false); // Hide the component
    if (onClose) {
      onClose(); // Call parent function if provided
    }
  };

  if (!currentEpisode || !isVisible) return null;

  return (
    <Flex direction="column" gap="2" className="audio-player bold-border">
      <audio ref={audioRef} />
      
      <Flex justify="between" align="center">
        <Text size="2" weight="bold" style={{ color: 'black' }}>
          {currentEpisode.title} - {currentEpisode.showTitle}
        </Text>
        <Button onClick={handleClose} variant="ghost" size="1">
          <Cross1Icon />
        </Button>
      </Flex>
      
      <Flex align="center" gap="2">
        <Button onClick={togglePlay} variant="ghost" size="1">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <Slider 
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={handleSeek}
          className="progress-bar"
        />
        <Text size="1" style={{ color: 'black' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </Flex>


      <Text size="2" style={{ color: 'black' }}>
        <span style={{ color: 'gray' }}>Current Position:</span> {formatTime(currentTime)} / {formatTime(duration)}
       
        Season {currentEpisode.seasonNumber}, Episode {currentEpisode.episodeNumber}
      </Text>
    </Flex>
  );
}

export default AudioPlayer;
