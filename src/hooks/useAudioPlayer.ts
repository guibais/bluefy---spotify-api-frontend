import { useState, useRef, useEffect } from 'react'

type Track = {
  id: string
  name: string
  artists: Array<{ name: string }>
  preview_url?: string | null
  duration_ms: number
}

type AudioPlayerState = {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
}

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7
  })

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || 0
      }))
    }

    const handleEnded = () => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0
      }))
    }

    const handleError = () => {
      setState(prev => ({
        ...prev,
        isPlaying: false
      }))
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadedmetadata', updateTime)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadedmetadata', updateTime)
    }
  }, [state.currentTrack])

  const playTrack = async (track: Track) => {
    if (!track.preview_url) {
      console.warn('Track has no preview URL')
      return
    }

    try {
      if (audioRef.current) {
        audioRef.current.pause()
      }

      const audio = new Audio(track.preview_url)
      audio.volume = state.volume
      audioRef.current = audio

      setState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
        duration: 30 // Preview tracks are 30 seconds
      }))

      await audio.play()
    } catch (error) {
      console.error('Error playing track:', error)
      setState(prev => ({
        ...prev,
        isPlaying: false
      }))
    }
  }

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setState(prev => ({
        ...prev,
        isPlaying: false
      }))
    }
  }

  const resumeTrack = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
        setState(prev => ({
          ...prev,
          isPlaying: true
        }))
      } catch (error) {
        console.error('Error resuming track:', error)
      }
    }
  }

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
        currentTrack: null
      }))
    }
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setState(prev => ({
        ...prev,
        currentTime: time
      }))
    }
  }

  const setVolume = (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }
    setState(prev => ({
      ...prev,
      volume: clampedVolume
    }))
  }

  const togglePlayPause = () => {
    if (state.isPlaying) {
      pauseTrack()
    } else if (state.currentTrack) {
      resumeTrack()
    }
  }

  return {
    ...state,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    seekTo,
    setVolume,
    togglePlayPause,
    hasPreview: (track: Track) => !!track.preview_url
  }
}
