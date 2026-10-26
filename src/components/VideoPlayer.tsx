import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties, KeyboardEvent } from 'react'
import { useAppDispatch } from '../app/hooks'
import { recordProgress } from '../features/historySlice'
import { showToast } from '../features/uiSlice'
import { useT } from '../i18n'
import { clamp, formatTime } from '../lib/format'
import {
  Forward10Icon,
  FullscreenExitIcon,
  FullscreenIcon,
  PauseIcon,
  PipIcon,
  PlayIcon,
  Replay10Icon,
  VolumeIcon,
  VolumeMuteIcon,
} from './Icons'

type WebkitVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void }

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

interface Props {
  src: string
  /** без mediaId (напр. телеканал) прогрес в історію не записується */
  mediaId?: string
  title: string
  poster?: string
  /** секунда, з якої продовжити перегляд */
  startAt?: number
}

export default function VideoPlayer({ src, mediaId, title, poster, startAt = 0 }: Props) {
  const t = useT()
  const dispatch = useAppDispatch()
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideTimer = useRef<number | undefined>(undefined)
  const resumed = useRef(false)
  const lastPos = useRef({ position: 0, duration: 0 })

  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [rate, setRate] = useState(1)
  const [rateMenu, setRateMenu] = useState(false)
  const [isFs, setIsFs] = useState(false)
  const [isPip, setIsPip] = useState(false)
  const [controls, setControls] = useState(true)
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(false)

  const pipSupported = typeof document !== 'undefined' && 'pictureInPictureEnabled' in document

  /* ——— історія переглядів ——— */
  const saveProgress = useCallback(() => {
    const { position, duration: d } = lastPos.current
    if (mediaId && position >= 1 && d > 0) dispatch(recordProgress({ id: mediaId, position, duration: d }))
  }, [dispatch, mediaId])

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(saveProgress, 5000)
    return () => window.clearInterval(id)
  }, [playing, saveProgress])

  useEffect(() => saveProgress, [saveProgress])

  /* ——— повноекранний режим та PiP: стежимо за станом браузера ——— */
  useEffect(() => {
    const onFs = () => setIsFs(document.fullscreenElement === wrapRef.current)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const enter = () => setIsPip(true)
    const leave = () => setIsPip(false)
    v.addEventListener('enterpictureinpicture', enter)
    v.addEventListener('leavepictureinpicture', leave)
    return () => {
      v.removeEventListener('enterpictureinpicture', enter)
      v.removeEventListener('leavepictureinpicture', leave)
      if (document.pictureInPictureElement === v) void document.exitPictureInPicture().catch(() => undefined)
    }
  }, [])

  /* ——— автоприховування панелі керування ——— */
  const showControls = useCallback(() => {
    setControls(true)
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControls(false)
    }, 2800)
  }, [])

  useEffect(() => () => window.clearTimeout(hideTimer.current), [])

  /* ——— дії ——— */
  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) void v.play().catch(() => undefined)
    else v.pause()
  }, [])

  const seekBy = useCallback((delta: number) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = clamp(v.currentTime + delta, 0, v.duration || 0)
  }, [])

  const toggleMute = useCallback(() => {
    const v = videoRef.current
    if (v) v.muted = !v.muted
  }, [])

  const changeVolume = useCallback((value: number) => {
    const v = videoRef.current
    if (!v) return
    v.volume = clamp(value, 0, 1)
    v.muted = v.volume === 0
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current
    const v = videoRef.current as WebkitVideo | null
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined)
    } else if (el?.requestFullscreen) {
      void el.requestFullscreen().catch(() => undefined)
    } else if (v?.webkitEnterFullscreen) {
      v.webkitEnterFullscreen() // iOS Safari: лише рідний повноекранний режим відео
    }
  }, [])

  const togglePip = useCallback(async () => {
    const v = videoRef.current
    if (!v) return
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture()
      else if (document.pictureInPictureEnabled) await v.requestPictureInPicture()
      else dispatch(showToast(t('player.pipUnsupported')))
    } catch {
      dispatch(showToast(t('player.pipUnsupported')))
    }
  }, [dispatch, t])

  const setPlaybackRate = (r: number) => {
    if (videoRef.current) videoRef.current.playbackRate = r
    setRateMenu(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const onField = target.tagName === 'INPUT' || target.tagName === 'SELECT'
    const onButton = target.tagName === 'BUTTON'
    showControls()
    switch (e.key) {
      case ' ':
        if (onButton) return
        e.preventDefault()
        togglePlay()
        break
      case 'k':
      case 'K':
        togglePlay()
        break
      case 'ArrowLeft':
        if (onField) return
        e.preventDefault()
        seekBy(-10)
        break
      case 'ArrowRight':
        if (onField) return
        e.preventDefault()
        seekBy(10)
        break
      case 'ArrowUp':
        if (onField) return
        e.preventDefault()
        changeVolume(volume + 0.1)
        break
      case 'ArrowDown':
        if (onField) return
        e.preventDefault()
        changeVolume(volume - 0.1)
        break
      case 'm':
      case 'M':
        toggleMute()
        break
      case 'f':
      case 'F':
        toggleFullscreen()
        break
      case 'i':
      case 'I':
        void togglePip()
        break
      case 'Escape':
        setRateMenu(false)
        break
    }
  }

  /* ——— події <video> ——— */
  const updateBuffered = () => {
    const v = videoRef.current
    if (!v || v.buffered.length === 0) return
    setBuffered(v.buffered.end(v.buffered.length - 1))
  }

  const onLoadedMetadata = () => {
    const v = videoRef.current
    if (!v) return
    setDuration(v.duration)
    lastPos.current.duration = v.duration
    if (!resumed.current && startAt > 0 && startAt < v.duration - 5) {
      v.currentTime = startAt
    }
    resumed.current = true
    void v.play().catch(() => undefined) // може бути заблоковано політикою автоплею — тоді користувач натисне Play
  }

  const onTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    setCurrent(v.currentTime)
    lastPos.current.position = v.currentTime
    updateBuffered()
  }

  const onVolumeChange = () => {
    const v = videoRef.current
    if (!v) return
    setVolume(v.volume)
    setMuted(v.muted || v.volume === 0)
  }

  const onSeekInput = (e: ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current
    if (v) v.currentTime = Number(e.target.value)
  }

  const played = duration ? (current / duration) * 100 : 0
  const buf = duration ? Math.max((buffered / duration) * 100, played) : 0
  const visible = controls || !playing || rateMenu

  return (
    <div
      ref={wrapRef}
      className={`player${isFs ? ' is-fs' : ''}${visible ? '' : ' hide-controls'}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseMove={showControls}
      onTouchStart={showControls}
      role="region"
      aria-label={title}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onProgress={updateBuffered}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false)
          setControls(true)
          saveProgress()
        }}
        onEnded={() => setPlaying(false)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onVolumeChange={onVolumeChange}
        onRateChange={() => setRate(videoRef.current?.playbackRate ?? 1)}
        onError={() => setError(true)}
      />

      {waiting && !error && <div className="spinner" aria-hidden="true" />}
      {error && (
        <div className="player-error" role="alert">
          {t('player.error')}
        </div>
      )}
      {!playing && !error && (
        <button type="button" className="big-play" onClick={togglePlay} aria-label={t('player.play')}>
          <PlayIcon size={34} />
        </button>
      )}

      <div className="controls">
        <input
          type="range"
          className="seek"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          onChange={onSeekInput}
          aria-label={t('player.seek')}
          aria-valuetext={`${formatTime(current)} / ${formatTime(duration)}`}
          style={{ ['--played' as string]: `${played}%`, ['--buffered' as string]: `${buf}%` } as CSSProperties}
        />
        <div className="controls-row">
          <button type="button" onClick={togglePlay} aria-label={playing ? t('player.pause') : t('player.play')}>
            {playing ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
          </button>
          <button type="button" className="hide-xs" onClick={() => seekBy(-10)} aria-label={t('player.back10')}>
            <Replay10Icon size={22} />
          </button>
          <button type="button" className="hide-xs" onClick={() => seekBy(10)} aria-label={t('player.forward10')}>
            <Forward10Icon size={22} />
          </button>

          <div className="volume">
            <button type="button" onClick={toggleMute} aria-label={muted ? t('player.unmute') : t('player.mute')}>
              {muted ? <VolumeMuteIcon size={22} /> : <VolumeIcon size={22} />}
            </button>
            <input
              type="range"
              className="seek vol"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label={t('player.volume')}
              style={{ ['--played' as string]: `${(muted ? 0 : volume) * 100}%`, ['--buffered' as string]: `${(muted ? 0 : volume) * 100}%` } as CSSProperties}
            />
          </div>

          <span className="time">
            {formatTime(current)} / {formatTime(duration)}
          </span>

          <span className="spacer" />

          <div className="rate">
            <button
              type="button"
              className="rate-btn"
              onClick={() => setRateMenu((v) => !v)}
              aria-label={t('player.speed')}
              aria-expanded={rateMenu}
            >
              {rate}×
            </button>
            {rateMenu && (
              <ul className="rate-menu" role="menu">
                {RATES.map((r) => (
                  <li key={r}>
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={r === rate}
                      className={r === rate ? 'on' : ''}
                      onClick={() => setPlaybackRate(r)}
                    >
                      {r}×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {pipSupported && (
            <button
              type="button"
              onClick={() => void togglePip()}
              className={isPip ? 'on' : ''}
              aria-pressed={isPip}
              aria-label={isPip ? t('player.exitPip') : t('player.pip')}
              title={isPip ? t('player.exitPip') : t('player.pip')}
            >
              <PipIcon size={22} />
            </button>
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFs ? t('player.exitFullscreen') : t('player.fullscreen')}
            title={isFs ? t('player.exitFullscreen') : t('player.fullscreen')}
          >
            {isFs ? <FullscreenExitIcon size={22} /> : <FullscreenIcon size={22} />}
          </button>
        </div>
      </div>
    </div>
  )
}
