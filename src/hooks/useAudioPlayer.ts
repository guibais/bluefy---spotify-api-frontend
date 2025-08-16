export const useAudioPlayer = () => {
  return {
    currentPlaylistId: null as string | null,
    isPlaying: false,
    playPlaylist: (_playlistId: string) => {},
    stop: () => {},
    togglePlayPause: () => {},
  }
}
