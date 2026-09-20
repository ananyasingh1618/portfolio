import { useEffect, useRef } from 'react'

interface Props {
  name: string
  src: string
  poster: string
  caption: string
  onClose: () => void
}

/**
 * Modal player built on <dialog>. The <video> only exists while the dialog is
 * open, so no video bytes are requested until someone asks to watch. There is
 * no autoplay: the viewer presses play and gets the native controls.
 */
export function VideoLightbox({ name, src, poster, caption, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const video = videoRef.current
    if (!d.open) d.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      video?.pause()
      document.body.style.overflow = ''
    }
  }, [])

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events -- backdrop click is a mouse convenience; Escape and the Close button are the keyboard paths
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={`${name} demo video`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close()
      }}
    >
      <div className="lightbox__frame">
        <button type="button" className="lightbox__close" onClick={() => ref.current?.close()}>
          <span className="visually-hidden">Close video</span>
          <span aria-hidden="true">Close ✕</span>
        </button>
        {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- the recordings carry on-screen captions; no separate caption track exists to reference */}
        <video ref={videoRef} className="lightbox__video" controls playsInline preload="metadata" poster={poster}>
          <source src={src} type="video/mp4" />
          Your browser cannot play this video. <a href={src}>Download the MP4</a>.
        </video>
        <p className="lightbox__caption">{caption}</p>
      </div>
    </dialog>
  )
}
