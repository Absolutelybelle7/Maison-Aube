import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface GalleryPhoto {
  src: string;
  alt: string;
}

interface LightboxProps {
  photos: GalleryPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export default function Lightbox({ photos, index, onIndexChange, onClose }: LightboxProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const photo = photos[index];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onIndexChange((index + 1) % photos.length);
      if (event.key === 'ArrowLeft') onIndexChange((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [index, photos.length, onClose, onIndexChange]);

  const step = (delta: number) => {
    setIsLeaving(true);
    window.setTimeout(() => {
      onIndexChange((index + delta + photos.length) % photos.length);
      setIsLeaving(false);
    }, 180);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/95 p-6 animate-fade-in"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full text-secondary-50 transition hover:bg-primary-700"
        aria-label="Close photo viewer"
      >
        <X className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          step(-1);
        }}
        className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-secondary-50 transition hover:bg-primary-700 sm:left-8"
        aria-label="Previous photo"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>
      <figure className="max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
        <img
          src={photo.src}
          alt={photo.alt}
          className={`max-h-[80vh] w-auto rounded-2xl object-contain transition duration-200 ${
            isLeaving ? 'scale-[0.98] opacity-0' : 'scale-100 opacity-100'
          }`}
        />
        <figcaption className="mt-5 text-center text-sm text-secondary-300">
          {photo.alt} <span className="ml-2 text-secondary-500">{index + 1} / {photos.length}</span>
        </figcaption>
      </figure>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          step(1);
        }}
        className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-secondary-50 transition hover:bg-primary-700 sm:right-8"
        aria-label="Next photo"
      >
        <ChevronRight className="h-7 w-7" />
      </button>
    </div>
  );
}
