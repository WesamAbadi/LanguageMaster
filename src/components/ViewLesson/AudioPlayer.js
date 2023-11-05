import React, { useState, useEffect } from "react";
import "../../styles/components/AudioPlayer.scss";

const AudioPlayer = () => {
  const [audio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [trackDuration, setTrackDuration] = useState("00:00");
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x speed by default

  const tracks = [
    {
      name: "Track 1",
      url: "https://audio.jukehost.co.uk/NCoCgbqQcSqyC9FlwWVbg1TIwpEe40eg",
      artwork:
        "https://superpalestinian.com/cdn/shop/products/image_09032836-9067-40fb-ae76-1c1de1cbc1ef.png",
    },
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    audio.src = tracks[currentTrackIndex].url;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    audio.addEventListener("durationchange", () => {
      setTrackDuration(formatTime(audio.duration));
    });

    audio.addEventListener("timeupdate", () => {
      updateCurrentTime();
    });

    audio.addEventListener("ended", () => {
      playNextTrack();
    });

    return () => {
      audio.removeEventListener("durationchange", () => {
        setTrackDuration(formatTime(audio.duration));
      });
      audio.removeEventListener("timeupdate", () => {
        updateCurrentTime();
      });
      audio.removeEventListener("ended", () => {
        playNextTrack();
      });
    };
  }, [currentTrackIndex, isPlaying]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const updateCurrentTime = () => {
    setCurrentTime(formatTime(audio.currentTime));
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const playPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    if (!audio.duration) return;
    const seekTime =
      (e.nativeEvent.offsetX / e.target.offsetWidth) * audio.duration;
    audio.currentTime = seekTime;
    setCurrentTime(formatTime(seekTime));
  };

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    audio.currentTime = 0;
  };

  const restartTrack = () => {
    audio.currentTime = 0;
    setCurrentTime("00:00");
  };

  const togglePlaybackSpeed = () => {
    const newSpeed = playbackSpeed === 1 ? 2 : 1;
    setPlaybackSpeed(newSpeed);
    audio.playbackRate = newSpeed;
  };

  return (
    <div className="music-player-container">
      <div className="music-player">
        <div className="player-content">
          <div className="player-controls">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
              <div className="seek-bar" onClick={handleSeek} />
            </div>
            <div className="control">
              <div className="button" onClick={restartTrack}>
                Restart
              </div>
            </div>
            <div className="control">
              <div className="button" onClick={playPause}>
                {isPlaying ? "Pause" : "Play"}
              </div>
            </div>
            <div className="control">
              <div className="button" onClick={togglePlaybackSpeed}>
                {playbackSpeed}x Speed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
