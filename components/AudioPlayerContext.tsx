"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

type AudioContextType = {
  play: (audio: HTMLAudioElement, trackId?: string) => void;
  stop: () => void;
  currentTrackId: string | null;
};

const AudioPlayerContext = createContext<AudioContextType | null>(null);

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  function play(audio: HTMLAudioElement, trackId?: string) {
    // Stop any previously playing audio
    if (currentAudio.current && currentAudio.current !== audio) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
    }

    currentAudio.current = audio;
    audio.play();

    if (trackId) {
      setCurrentTrackId(trackId);
    }
  }

  function stop() {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
      currentAudio.current = null;
    }

    setCurrentTrackId(null);
  }

  return (
    <AudioPlayerContext.Provider
      value={{ play, stop, currentTrackId }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);

  if (!context) {
    throw new Error(
      "useAudioPlayer must be used inside AudioPlayerProvider"
    );
  }

  return context;
}
