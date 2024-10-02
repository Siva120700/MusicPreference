declare global {
  interface Window {
    YT: any; // or specify a more detailed type if desired
    onYouTubeIframeAPIReady: () => void;
  }
}

export {};
