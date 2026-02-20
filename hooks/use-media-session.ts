import { useEffect, useCallback } from "react";

interface MediaMetadataInit {
    title: string;
    artist: string;
    album?: string;
    artwork?: { src: string; sizes: string; type: string }[];
}

interface MediaHandlers {
    onPlay?: () => void;
    onPause?: () => void;
    onSeekBackward?: () => void;
    onSeekForward?: () => void;
    onPreviousTrack?: () => void;
    onNextTrack?: () => void;
}

export function useMediaSession(metadata: MediaMetadataInit | null, handlers: MediaHandlers) {
    const isSupported = typeof navigator !== "undefined" && "mediaSession" in navigator;

    useEffect(() => {
        if (!isSupported || !metadata) return;

        navigator.mediaSession.metadata = new MediaMetadata(metadata);

        const actionHandlers: [MediaSessionAction, (() => void) | undefined][] = [
            ["play", handlers.onPlay],
            ["pause", handlers.onPause],
            ["seekbackward", handlers.onSeekBackward],
            ["seekforward", handlers.onSeekForward],
            ["previoustrack", handlers.onPreviousTrack],
            ["nexttrack", handlers.onNextTrack],
        ];

        actionHandlers.forEach(([action, handler]) => {
            if (handler) {
                navigator.mediaSession.setActionHandler(action, handler);
            } else {
                navigator.mediaSession.setActionHandler(action, null);
            }
        });

        return () => {
            actionHandlers.forEach(([action]) => {
                navigator.mediaSession.setActionHandler(action, null);
            });
        };
    }, [isSupported, metadata, handlers]);

    const updatePlaybackState = useCallback((state: "none" | "paused" | "playing") => {
        if (isSupported) {
            navigator.mediaSession.playbackState = state;
        }
    }, [isSupported]);

    return { isSupported, updatePlaybackState };
}
