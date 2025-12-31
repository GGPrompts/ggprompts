"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { cn } from "@ggprompts/ui";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  aspectRatio?: "video" | "square" | "portrait";
}

export function VideoPlayer({
  src,
  poster,
  className,
  autoPlay = true,
  loop = true,
  aspectRatio = "video",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(isNaN(progress) ? 0 : progress);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  // Autoplay on mount (muted to comply with browser policies)
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay blocked:", err);
        setIsPlaying(false);
      });
    }
  }, [autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[9/16]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg glass group",
        aspectClasses[aspectRatio],
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {/* Gradient overlay for controls visibility */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Center play button (shows when paused or on hover) */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: showControls || !isPlaying ? 1 : 0.8,
          opacity: showControls || !isPlaying ? 1 : 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-20 h-20 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center border border-primary/40 pointer-events-auto cursor-pointer transition-colors hover:bg-primary/40">
          {isPlaying ? (
            <Pause className="w-8 h-8 text-primary" />
          ) : (
            <Play className="w-8 h-8 text-primary ml-1" />
          )}
        </div>
      </motion.button>

      {/* Bottom controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress bar */}
        <div
          className="h-1 bg-white/20 rounded-full mb-3 cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
        >
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </motion.button>

            {/* Mute/Unmute */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className={cn(
                "p-2 rounded-lg backdrop-blur-sm transition-colors",
                isMuted
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-primary/30 hover:bg-primary/40"
              )}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-primary" />
              )}
            </motion.button>
          </div>

          {/* Fullscreen */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

    </div>
  );
}
