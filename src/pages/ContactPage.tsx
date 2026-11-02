import PageHero from '@/components/common/PageHero';
import Reveal from '@/components/common/Reveal';
import ContactForm from '@/components/contact/ContactForm';
import { SALON } from '@/lib/salonInfo';

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We would love to hear from you"
        description="Reach out with a question, a request for a custom ritual, or simply to say hello. Our team responds personally."
        imageUrl="https://images.pexels.com/photos/7195799/pexels-photo-7195799.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1200&fit=crop"
      />

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-10 lg:py-28">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={150} className="space-y-12 lg:pt-6">
          <div>
            <p className="eyebrow">Studio</p>
            <address className="mt-5 space-y-1 text-2xl not-italic leading-snug text-primary-900 font-display">
              {SALON.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="eyebrow">Call</p>
              <a href={SALON.phoneHref} className="link-underline mt-4 inline-block text-lg text-primary-900">
                {SALON.phone}
              </a>
            </div>
            <div>
              <p className="eyebrow">Write</p>
              <a href={`mailto:${SALON.email}`} className="link-underline mt-4 inline-block break-all text-lg text-primary-900">
                {SALON.email}
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow">Hours</p>
            <p className="mt-4 text-lg text-primary-900">{SALON.hours}</p>
          </div>

          <div className="overflow-hidden rounded-2xl">
            <img
              src="https://images.pexels.com/photos/27165072/pexels-photo-27165072.jpeg?auto=compress&cs=tinysrgb&w=1000&h=700&fit=crop"
              alt="The calm front of the studio with greenery"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}
