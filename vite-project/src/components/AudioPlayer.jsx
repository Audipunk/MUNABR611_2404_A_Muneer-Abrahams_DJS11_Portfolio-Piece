import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Flex, Text, Slider } from '@radix-ui/themes';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';

function AudioPlayer({ currentEpisode, onComplete, updatePlaybackPosition }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(currentEpisode?.currentTime || 0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Update playback position
  const updateTime = useCallback(() => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    updatePlaybackPosition(currentEpisode.id, audioRef.current.currentTime);
  }, [currentEpisode, updatePlaybackPosition]);

  const setAudioDuration = useCallback(() => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  }, []);

  const handleAudioEnd = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    onComplete?.(currentEpisode);
  }, [currentEpisode, onComplete]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', handleAudioEnd);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, [updateTime, setAudioDuration, handleAudioEnd]);

  useEffect(() => {
    if (currentEpisode && audioRef.current) {
      const audio = audioRef.current;
      audio.src = currentEpisode.file;
      audio.currentTime = currentEpisode.currentTime || 0;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentEpisode]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value) => {
    if (!audioRef.current) return;
    const newTime = value[0];
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    updatePlaybackPosition(currentEpisode.id, newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentEpisode) return null;

  return (
    <Flex direction="column" gap="2" className="audio-player bold-border">
      <audio ref={audioRef} />
      <Text size="2" weight="bold" style={{ color: 'black' }}>
        {currentEpisode.title} - {currentEpisode.showTitle}
      </Text>
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
        Season {currentEpisode.seasonNumber}, Episode {currentEpisode.episodeNumber}
      </Text>
    </Flex>
  );
}

export default AudioPlayer;
