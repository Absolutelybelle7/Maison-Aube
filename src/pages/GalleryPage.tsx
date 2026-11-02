import { useCallback, useState } from 'react';
import PageHero from '@/components/common/PageHero';
import Reveal from '@/components/common/Reveal';
import Lightbox, { type GalleryPhoto } from '@/components/gallery/Lightbox';

const PHOTOS: GalleryPhoto[] = [
  { src: 'https://images.pexels.com/photos/33412989/pexels-photo-33412989.png?auto=compress&cs=tinysrgb&w=1200', alt: 'Minimal salon interior in warm neutrals' },
  { src: 'https://images.pexels.com/photos/6629605/pexels-photo-6629605.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Therapeutic massage in a calm studio' },
  { src: 'https://images.pexels.com/photos/3993453/pexels-photo-3993453.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Precision haircut in progress' },
  { src: 'https://images.pexels.com/photos/37229298/pexels-photo-37229298.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Soothing facial treatment' },
  { src: 'https://images.pexels.com/photos/7195799/pexels-photo-7195799.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Backwash chair beneath warm lamps' },
  { src: 'https://images.pexels.com/photos/7321715/pexels-photo-7321715.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Gel polish applied with care' },
  { src: 'https://images.pexels.com/photos/27165072/pexels-photo-27165072.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Studio interior with lush greenery' },
  { src: 'https://images.pexels.com/photos/9268043/pexels-photo-9268043.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Candlelit foot massage' },
  { src: 'https://images.pexels.com/photos/8467965/pexels-photo-8467965.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Scissors trimming with focus' },
  { src: 'https://images.pexels.com/photos/37229309/pexels-photo-37229309.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Spa facial with cucumber slices' },
  { src: 'https://images.pexels.com/photos/7195811/pexels-photo-7195811.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Bright salon beside a window' },
  { src: 'https://images.pexels.com/photos/5484948/pexels-photo-5484948.png?auto=compress&cs=tinysrgb&w=1200', alt: 'Manicure detail with nail art' },
  { src: 'https://images.pexels.com/photos/13068380/pexels-photo-13068380.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Modern nail studio station' },
  { src: 'https://images.pexels.com/photos/6186740/pexels-photo-6186740.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Lit candle and plush towels' },
];

const ASPECTS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/3]'];

export default function GalleryPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeViewer = useCallback(() => setOpenIndex(null), []);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A quiet look inside"
        description="Light, texture and calm. A glimpse of the studio and the rituals that happen behind its doors."
        imageUrl="https://images.pexels.com/photos/7195811/pexels-photo-7195811.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1200&fit=crop"
      />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {PHOTOS.map((photo, index) => (
            <Reveal key={photo.src} delay={(index % 3) * 100} className="mb-6 break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-secondary-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-50"
                aria-label={`View photo: ${photo.alt}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className={`${ASPECTS[index % ASPECTS.length]} w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105`}
                />
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-primary-900/80 to-transparent p-5 text-sm text-secondary-50 transition-transform duration-500 group-hover:translate-y-0">
                  {photo.alt}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {openIndex !== null && (
        <Lightbox
          photos={PHOTOS}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={closeViewer}
        />
      )}
    </>
  );
}
