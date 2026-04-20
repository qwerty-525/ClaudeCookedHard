"use client"
import { useEffect, useRef } from "react"

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: (() => void) | undefined
    _ytApiLoaded: boolean
    _ytApiReady: boolean
    _ytApiCallbacks: (() => void)[]
  }
}

export interface Clip {
  start: number // seconds
  end: number   // seconds
}

interface Props {
  videoId: string
  clips: Clip[]
  className?: string
}

function loadYTApi(onReady: () => void) {
  if (!window._ytApiCallbacks) window._ytApiCallbacks = []
  window._ytApiCallbacks.push(onReady)

  if (window._ytApiReady) {
    onReady()
    return
  }

  if (!window._ytApiLoaded) {
    window._ytApiLoaded = true
    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"
    document.head.appendChild(script)

    window.onYouTubeIframeAPIReady = () => {
      window._ytApiReady = true
      window._ytApiCallbacks.forEach((cb) => cb())
      window._ytApiCallbacks = []
    }
  }
}

export default function YouTubeClipLoop({ videoId, clips, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const clipIndexRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    loadYTApi(() => {
      if (!containerRef.current) return

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          start: clips[0].start,
        },
        events: {
          onReady: (e: any) => {
            e.target.playVideo()
            startPolling()
          },
          onStateChange: (e: any) => {
            // restart if video ends before our seek catches it
            if (e.data === window.YT.PlayerState.ENDED) {
              clipIndexRef.current = 0
              playerRef.current?.seekTo(clips[0].start, true)
              playerRef.current?.playVideo()
            }
          },
        },
      })
    })

    function startPolling() {
      intervalRef.current = setInterval(() => {
        if (!playerRef.current?.getCurrentTime) return
        const t = playerRef.current.getCurrentTime()
        const clip = clips[clipIndexRef.current]
        if (t >= clip.end) {
          clipIndexRef.current = (clipIndexRef.current + 1) % clips.length
          playerRef.current.seekTo(clips[clipIndexRef.current].start, true)
        }
      }, 150)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      playerRef.current?.destroy?.()
    }
  }, [videoId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`overflow-hidden ${className}`}>
      {/* YouTube iframe gets injected here by the API */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
