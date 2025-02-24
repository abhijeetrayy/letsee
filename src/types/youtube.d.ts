export {};

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement | string,
        options: YT.PlayerOptions
      ) => YT.Player;
      PlayerState: {
        UNSTARTED: number; // Added
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }

  namespace YT {
    interface Player {
      loadVideoById(videoId: string, startSeconds?: number): void; // Added startSeconds
      cueVideoById(videoId: string, startSeconds?: number): void; // Added
      mute(): void;
      unMute(): void;
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void; // Added
      seekTo(seconds: number, allowSeekAhead: boolean): void; // Added
      getDuration(): number; // Added
      getCurrentTime(): number; // Added
      getPlayerState(): number; // Added
      getIframe(): HTMLIFrameElement; // Added
      destroy(): void;
    }

    interface PlayerOptions {
      height: string | number; // Allow number for height/width
      width: string | number;
      videoId: string;
      playerVars?: {
        autoplay?: 0 | 1;
        mute?: 0 | 1;
        controls?: 0 | 1;
        loop?: 0 | 1; // Added
        modestbranding?: 0 | 1; // Added
        rel?: 0 | 1; // Added
        showinfo?: 0 | 1; // Added
        fs?: 0 | 1; // Added (fullscreen control)
        enablejsapi?: 0 | 1; // Added
        origin?: string; // Added
      };
      events?: {
        onReady?: (event: PlayerEvent) => void;
        onStateChange?: (event: OnStateChangeEvent) => void;
        onError?: (event: OnErrorEvent) => void; // Added
        onPlaybackQualityChange?: (event: OnPlaybackQualityChangeEvent) => void; // Added
        onPlaybackRateChange?: (event: OnPlaybackRateChangeEvent) => void; // Added
      };
    }

    interface PlayerEvent {
      target: Player;
    }

    interface OnStateChangeEvent {
      [x: string]: any;
      data: number;
    }

    interface OnErrorEvent {
      data: number; // Error code
    }

    interface OnPlaybackQualityChangeEvent {
      data: string; // Quality level (e.g., "small", "medium", "hd720")
    }

    interface OnPlaybackRateChangeEvent {
      data: number; // Playback rate (e.g., 0.5, 1, 1.5, 2)
    }
  }
}
