import { GalleryComponent } from '@/components/blocks/GalleryComponent';

const categories = ['All', 'Doctor', 'Clinic', 'Hospital'];

const galleryItems = [
  { src: '/images/doctor/dr_arif_knee_injection_new.jpeg', alt: 'Dr. Muhammad Arif Rashid – Interventional Pain Procedure', category: 'Doctor', caption: 'Knee Injection Procedure' },
  { src: '/images/clinic/clinic_reception_wide.jpeg', alt: 'Modern Pain Clinic Lobby', category: 'Clinic', caption: 'Pain Clinic Reception' },
  { src: '/images/clinic/clinic_reception_tight.jpeg', alt: 'Clinic Consultation Area', category: 'Clinic', caption: 'Consultation Area' },
  { src: '/images/clinic/clinic_hallway_signs.jpeg', alt: 'Clinic Hallway and Directions', category: 'Clinic', caption: 'Clinic Hallway' },
  { src: '/images/doctor/dr_arif_arms_crossed.jpeg', alt: 'Dr. Arif Portrait', category: 'Doctor', caption: 'Dr. Muhammad Arif Rashid' },
  { src: '/images/doctor/dr_arif_intubation_portrait.jpeg', alt: 'Dr. Arif during procedure', category: 'Doctor', caption: 'Procedure Room' },
  { src: '/images/clinic/surgery_in_progress.jpeg', alt: 'Surgery in progress', category: 'Hospital', caption: 'Operating Theater' },
];

export default function GalleryPage() {
  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 100%)', paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ background: 'rgba(26,122,138,0.3)', color: 'var(--color-teal-light)', marginBottom: '1rem' }}>
            📸 Photo Gallery
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Our Clinic & Hospital Gallery
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 520, margin: '0 auto' }}>
            A glimpse into Dr. Arif&apos;s world-class practice environments and facilities.
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--color-off-white)' }}>
        <div className="container">
          <GalleryComponent items={galleryItems} categories={categories} />
        </div>
      </section>
    </>
  );
}
