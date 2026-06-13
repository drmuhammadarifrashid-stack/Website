import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/blocks/HeroSection';
import { ServiceCard } from '@/components/blocks/ServiceCard';
import { LocationCard } from '@/components/blocks/LocationCard';
import { TestimonialCard } from '@/components/blocks/TestimonialCard';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Dr. Muhammad Arif Rashid | Expert Pain Specialist Pakistan',
  description:
    'Consult Dr. Muhammad Arif Rashid – Consultant Anesthesiologist & Pain Physician specializing in chronic pain, interventional procedures, and perioperative pain care.',
};

const services = [
  {
    icon: '🩺',
    title: 'Chronic Pain Management',
    description: 'Comprehensive care for back pain, joint pain, nerve pain, cancer-related pain, and long-term pain conditions.',
    color: '#e8f7f9',
    accent: 'var(--color-teal)',
    href: '/services#chronic',
  },
  {
    icon: '💉',
    title: 'Interventional Pain Procedures',
    description: 'Precision nerve blocks, epidural steroid injections, and image-guided pain treatments for targeted relief.',
    color: '#eff6ff',
    accent: '#2563eb',
    href: '/services#interventional',
  },
  {
    icon: '🏥',
    title: 'Perioperative Optimization',
    description: 'Pre-surgical assessment, risk stratification, and personalized preparation plans to ensure safer surgical outcomes.',
    color: '#f0fdf4',
    accent: '#059669',
    href: '/services#perioperative',
  },
  {
    icon: '💊',
    title: 'Postoperative Pain Management',
    description: 'Expert post-surgical pain control, recovery support, and rehabilitation planning for faster healing.',
    color: '#fdf4ff',
    accent: '#7c3aed',
    href: '/services#postoperative',
  },
];

const reasons = [
  { icon: '🎯', title: 'Precision Medicine', desc: 'Ultrasound and fluoroscopy-guided procedures for pinpoint accuracy.' },
  { icon: '👨‍⚕️', title: '15+ Years Experience', desc: 'Thousands of successful cases in anesthesiology and pain medicine.' },
  { icon: '💡', title: 'Evidence-Based', desc: 'Following the latest international protocols for maximum safety and efficacy.' },
  { icon: '🤝', title: 'Compassionate Care', desc: 'We listen, understand, and tailor treatments to your specific needs.' },
];

const locations = [
  { name: 'Makosh Pain Clinic', address: 'Wapda Town, Lahore', hours: 'Mon-Fri: 5:00 PM - 9:00 PM', icon: '🏥' },
  { name: 'Farooq Hospital', address: 'DHA Phase 5, Lahore', hours: 'Tue & Thu: 3:00 PM - 6:00 PM', icon: '🏢' },
];

const testimonials = [
  { name: 'Ali Raza', condition: 'Chronic Back Pain', quote: 'Dr. Arif completely changed my life. After years of severe back pain, I am finally pain-free after his targeted nerve block.', rating: 5 },
  { name: 'Sara M.', condition: 'Knee Osteoarthritis', quote: 'I was dreading surgery, but Dr. Arif offered an interventional injection that gave me instant relief. Highly recommended!', rating: 5 },
  { name: 'Khurram T.', condition: 'Sciatica', quote: 'The most compassionate doctor I have met. He listened to my problems and designed a step-by-step treatment plan that worked.', rating: 5 },
];

const galleryPreview = [
  { src: '/images/doctor/dr_arif_intubation_portrait.jpeg', alt: 'Procedure Room' },
  { src: '/images/clinic/clinic_reception_wide.jpeg', alt: 'Clinic Reception' },
  { src: '/images/clinic/surgery_in_progress.jpeg', alt: 'Operating Theater' }
];

export default function HomePage() {
  return (
    <>
      {/* 1. HERO SECTION */}
      <HeroSection
        badgeText="🏥 Consultant Anesthesiologist & Pain Physician"
        titleTop="Reclaim Your Life"
        titleHighlight="From Chronic Pain"
        description="Dr. Muhammad Arif Rashid offers world-class interventional pain management and anesthesia expertise, combining precision medicine with compassionate care."
        imageUrl="/images/doctor/dr_arif_knee_injection_new.jpeg"
        stats={[
          { value: '15+ Years', label: 'Clinical Experience', icon: '🎖️' },
          { value: '5000+', label: 'Patients Treated' }
        ]}
        trustBadges={['FCPS Anesthesiology', 'Fellowship Pain Medicine', 'Certified Pain Physician']}
      />

      {/* 2. ABOUT PREVIEW */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px', position: 'relative', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
              <Image 
                src="/images/doctor/dr_arif_arms_crossed.jpeg" 
                alt="Dr. Muhammad Arif Rashid"
                width={600}
                height={800}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <div style={{ flex: '1 1 500px' }}>
              <Badge variant="teal" style={{ marginBottom: '1rem' }}>Meet Dr. Arif</Badge>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Dedicated to Relieving Pain, Restoring Lives</h2>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Dr. Muhammad Arif Rashid is a highly skilled Consultant Anesthesiologist and Pain Physician with over 15 years of clinical experience. He specializes in utilizing the latest evidence-based treatments and image-guided interventional procedures to treat complex chronic pain conditions.
              </p>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                His approach goes beyond simply masking symptoms; he focuses on diagnosing the root cause and designing personalized, multimodal treatment plans to improve functionality and quality of life.
              </p>
              <Button href="/about" variant="secondary">Read Full Profile →</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES PREVIEW */}
      <section className="section-padding" style={{ background: 'var(--color-off-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="navy" style={{ marginBottom: '1rem' }}>Our Specialties</Badge>
            <h2 className="section-title">Comprehensive Pain Care Services</h2>
            <p className="section-subtitle">
              Expert, evidence-based care tailored to your specific needs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {services.map((svc) => (
              <ServiceCard
                key={svc.title}
                icon={svc.icon}
                title={svc.title}
                description={svc.description}
                color={svc.color}
                accentColor={svc.accent}
                href={svc.href}
              />
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button href="/services" variant="secondary">View All Services</Button>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="teal" style={{ marginBottom: '1rem' }}>The Advantage</Badge>
            <h2 className="section-title">Why Choose Us?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {reasons.map((reason) => (
              <Card key={reason.title} style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{reason.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>{reason.title}</h3>
                <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{reason.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRACTICE LOCATIONS */}
      <section className="section-padding" style={{ background: 'var(--color-navy-dark)', color: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <Badge style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--color-teal-light)', marginBottom: '1rem' }}>Visit Us</Badge>
              <h2 className="section-title" style={{ color: 'white', textAlign: 'left' }}>Practice Locations</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                Dr. Arif consults at leading hospitals and dedicated pain clinics in Lahore, equipped with state-of-the-art facilities for interventional procedures.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {locations.map((loc) => (
                  <LocationCard 
                    key={loc.name}
                    name={loc.name}
                    address={loc.address}
                    hours={loc.hours}
                    icon={loc.icon}
                  />
                ))}
              </div>
              <div style={{ marginTop: '2rem' }}>
                <Button href="/locations" variant="teal">View Map & Details</Button>
              </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
               <Image 
                src="/images/clinic/clinic_reception_tight.jpeg" 
                alt="Clinic Reception"
                width={600}
                height={500}
                style={{ width: '100%', height: 'auto', borderRadius: '1rem', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. GALLERY PREVIEW */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="container">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <Badge variant="teal" style={{ marginBottom: '1rem' }}>Our Facilities</Badge>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 0 }}>Gallery Preview</h2>
            </div>
            <Button href="/gallery" variant="secondary">View Full Gallery →</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {galleryPreview.map((item, idx) => (
              <div key={idx} style={{ position: 'relative', height: '250px', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <Image 
                  src={item.src} 
                  alt={item.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="section-padding" style={{ background: 'var(--color-off-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="navy" style={{ marginBottom: '1rem' }}>Patient Success Stories</Badge>
            <h2 className="section-title">What Our Patients Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((test, idx) => (
              <TestimonialCard 
                key={idx}
                name={test.name}
                quote={test.quote}
                condition={test.condition}
                rating={test.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 50%, var(--color-teal) 100%)',
        padding: '5rem 0', position: 'relative', overflow: 'hidden',
      }}>
        <div className="hero-pattern" />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', marginBottom: '1.5rem' }}>
            Ready to Find Relief?
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', color: 'white', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
            Take the First Step Toward a Pain-Free Life
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Book your consultation with Dr. Arif today. In-person visits only. No online treatment provided.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="/appointment" variant="teal" size="lg">
              📅 Book Appointment Now
            </Button>
            <Button
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567'}`}
              variant="whatsapp" size="lg"
            >
              💬 WhatsApp Us
            </Button>
          </div>
        </div>
      </section>

      {/* 8. MEDICAL DISCLAIMER */}
      <section style={{ background: 'var(--color-gray-100)', padding: '2rem 0', borderTop: '1px solid var(--color-gray-200)' }}>
        <div className="container">
          <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textAlign: 'center', lineHeight: 1.6, maxWidth: 800, margin: '0 auto' }}>
            <strong>Medical Disclaimer:</strong> The information provided on this website is for educational and informational purposes only and does not constitute medical advice. It is not a substitute for a professional medical consultation, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Results of treatments and interventional procedures vary from patient to patient.
          </p>
        </div>
      </section>

    </>
  );
}
