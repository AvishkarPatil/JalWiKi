"use client"

import { useState, useEffect, useRef } from 'react'
import { PlayIcon, PauseIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid'

interface AudioPlayerProps {
  audioUrl: string
  title: string
}

export default function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    const audio = new Audio(audioUrl)
    audioRef.current = audio
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })
    
    // Set initial volume
    audio.volume = volume
    
    // Clean up
    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('loadedmetadata', () => {})
      audio.removeEventListener('timeupdate', () => {})
      audio.removeEventListener('ended', () => {})
    }
  }, [audioUrl])
  
  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    
    setIsPlaying(!isPlaying)
  }
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 mb-4">
      <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
        <SpeakerWaveIcon className="h-4 w-4 inline-block mr-1" />
        {title}
      </div>
      
      <div className="audio-player-container">
        <div 
          className="audio-player-progress" 
          ref={progressBarRef}
          style={{ width: `${progressPercentage}%` }}
        ></div>
        
        <div className="audio-player-controls">
          <button 
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
          </button>
          
          <div className="text-xs text-blue-800 dark:text-blue-200 mx-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          
          <div className="flex items-center">
            <SpeakerWaveIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer dark:bg-blue-700"
            />
          </div>
        </div>
      </div>
    </div>
  )
}