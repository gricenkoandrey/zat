import React, { useEffect, useRef, useCallback } from 'react';

const CHORUS_START_TIME = 43; // 0:43 (start of the chorus)
const YOUTUBE_VIDEO_ID = 'lZp96uELegI'; // Official Chase Atlantic - "Into It" track

export const BackgroundMusic: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const startedRef = useRef<boolean>(false);

  // Send control command to YouTube Iframe
  const sendYtCommand = useCallback((func: string, args: (string | number | boolean)[] = []) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    } catch {
      // ignore
    }
  }, []);

  // Smoothly start playback once without glitching or re-seeking
  const startPlaybackOnce = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    sendYtCommand('unMute');
    sendYtCommand('setVolume', [90]);
    sendYtCommand('playVideo');
  }, [sendYtCommand]);

  useEffect(() => {
    // Handle loop when track finishes
    const handleMessage = (e: MessageEvent) => {
      try {
        if (typeof e.data === 'string') {
          const data = JSON.parse(e.data);
          // 0: ENDED -> Loop back to chorus
          if (data.event === 'onStateChange' && data.info === 0) {
            sendYtCommand('seekTo', [CHORUS_START_TIME, true]);
            sendYtCommand('playVideo');
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('message', handleMessage);

    // Initial attempt to start playback on page load
    const timer = setTimeout(() => {
      sendYtCommand('unMute');
      sendYtCommand('playVideo');
    }, 600);

    // One-time unlock handler on user click or tap (never on mousemove!)
    const handleFirstInteraction = () => {
      startPlaybackOnce();
      cleanupListeners();
    };

    const gestureEvents = ['pointerdown', 'touchstart', 'mousedown', 'click', 'keydown'];

    const cleanupListeners = () => {
      gestureEvents.forEach((ev) => {
        window.removeEventListener(ev, handleFirstInteraction);
      });
    };

    gestureEvents.forEach((ev) => {
      window.addEventListener(ev, handleFirstInteraction, { passive: true });
    });

    return () => {
      clearTimeout(timer);
      cleanupListeners();
      window.removeEventListener('message', handleMessage);
    };
  }, [startPlaybackOnce, sendYtCommand]);

  return (
    <>
      {/* 
        Official Chase Atlantic - Into It [Official Audio] (lZp96uELegI)
        Invisible in incognito mode (no indicator, no stop buttons, no squeaks or glitches).
      */}
      <iframe
        ref={iframeRef}
        id="yt-bg-incognito-player"
        title="Chase Atlantic - Into It"
        src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&start=${CHORUS_START_TIME}&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&mute=0&playsinline=1&enablejsapi=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        className="fixed -z-50 pointer-events-none select-none"
        style={{
          width: '320px',
          height: '240px',
          left: '0px',
          bottom: '0px',
          opacity: 0.002,
        }}
      />
    </>
  );
};
