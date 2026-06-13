import Link from 'next/link';
import type { Metadata } from 'next';
import { DoctorProfileCard } from '@/components/blocks/DoctorProfileCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'About Dr. Muhammad Arif Rashid | Consultant Anesthesiologist',
  description: 'Learn about Dr. Muhammad Arif Rashid – Consultant Anesthesiologist, Pain Physician and Perioperative Specialist with over 15 years of clinical experience in Pakistan.',
};

const qualifications = [
  { degree: 'Fellowship – Pain Medicine', institution: 'International Pain Institute', year: '2011' },
  { degree: 'FCPS – Anaesthesiology', institution: 'College of Physicians & Surgeons Pakistan', year: '2009' },
  { degree: 'DA (Diploma Anaesthesia)', institution: 'College of Physicians & Surgeons Pakistan', year: '2006' },
  { degree: 'MBBS', institution: 'King Edward Medical University', year: '2003' },
];

const expertise = [
  { icon: '🎯', title: 'Interventional Pain Procedures', desc: 'Advanced fluoroscopy-guided nerve blocks, epidural injections, and radiofrequency ablation.' },
  { icon: '🧠', title: 'Multimodal Analgesia', desc: 'Tailored combination therapies including pharmacological and psychological approaches.' },
  { icon: '🔬', title: 'Image-Guided Treatments', desc: 'Ultrasound-guided precision procedures for accurate drug delivery.' },
  { icon: '🏥', title: 'Perioperative Pain Management', desc: 'Pre- and post-surgical pain protocols to minimize discomfort and accelerate recovery.' },
];

const specializations = [
  'Spinal Interventions (Epidurals, Facet Blocks)',
  'Radiofrequency Ablation (RFA)',
  'Ultrasound-Guided Joint Injections',
  'Cancer Pain Management',
  'Complex Regional Pain Syndrome (CRPS) Treatment',
  'Regenerative Medicine & Prolotherapy',
];

const memberships = [
  'Pakistan Society of Anaesthesiologists (PSA)',
  'Pakistan Pain Society (PPS)',
  'World Institute of Pain (WIP)',
  'International Association for the Study of Pain (IASP)',
  'American Society of Regional Anesthesia (ASRA)',
];

export default function AboutPage() {
  return (
    <>
      {/* HEADER SECTION */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 100%)', paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ background: 'rgba(26,122,138,0.3)', color: 'var(--color-teal-light)', marginBottom: '1rem' }}>
            About the Doctor
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Dr. Muhammad Arif Rashid
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            Consultant Anesthesiologist | Pain Physician | Perioperative Pain Specialist
          </p>
        </div>
      </section>

      {/* BIOGRAPHY & IMAGE SECTION */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="container">
          <DoctorProfileCard
            imageUrl="/images/doctor/dr_arif_arms_crossed.jpeg"
            imageAlt="Dr. Muhammad Arif Rashid"
            name="Dedicated to Relieving Pain, Restoring Lives"
            title="Consultant Anesthesiologist & Pain Physician"
            qualifications={['FCPS', 'Anesthesiology']}
            bioParagraphs={[
              'Dr. Muhammad Arif Rashid is a highly accomplished Consultant Anesthesiologist and Pain Physician practicing in Lahore, Pakistan. With more than 15 years of specialized clinical experience, he has established himself as one of the leading pain management specialists in the region.',
              'After graduating from King Edward Medical University with distinction, Dr. Arif completed his FCPS in Anaesthesiology and subsequently pursued an international fellowship in Pain Medicine. His training equipped him with advanced skills in interventional pain procedures, including fluoroscopy-guided nerve blocks, epidural steroid injections, radiofrequency ablation, and spinal cord stimulation.',
              'Throughout his career, Dr. Arif has treated over 5,000 patients suffering from debilitating chronic pain conditions. His deep understanding of neuroanatomy and pain pathways allows him to perform complex procedures with pinpoint accuracy.'
            ]}
            badges={[
              { label: 'Fellowship in Pain Medicine', icon: '🎓' },
              { label: 'Image-Guided Interventional Techniques', icon: '🔬' },
              { label: 'Multimodal Analgesia Expert', icon: '💡' },
            ]}
            linkHref="/appointment"
            linkText="📅 Book a Consultation"
          />
        </div>
      </section>

      {/* PHILOSOPHY & EXPERIENCE SECTION */}
      <section className="section-padding" style={{ background: 'var(--color-navy)', color: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
            <div style={{ flex: '1 1 400px' }}>
              <Badge style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--color-teal-light)', marginBottom: '1rem' }}>Professional Philosophy</Badge>
              <h2 className="section-title" style={{ color: 'white', textAlign: 'left' }}>Patient-Centered Care</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                "Effective pain care goes beyond prescribing medications — it requires understanding each patient's unique condition, lifestyle, and goals. My mission is to design personalized treatment pathways that address the root cause of pain, rather than merely masking the symptoms."
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                Dr. Arif strongly believes in a compassionate approach, ensuring that every patient feels heard and supported throughout their journey to recovery. His focus is on improving functional capacity and restoring a high quality of life.
              </p>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <Badge style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--color-teal-light)', marginBottom: '1rem' }}>Experience</Badge>
              <h2 className="section-title" style={{ color: 'white', textAlign: 'left' }}>15+ Years of Excellence</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '1.5rem' }}>🏥</div>
                  <div>
                    <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>Senior Consultant Anesthesiologist</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Leading hospital pain management departments, overseeing complex surgical anesthesia and post-operative pain control.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '1.5rem' }}>💉</div>
                  <div>
                    <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>Director of Interventional Pain</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Establishing advanced protocols for fluoroscopy and ultrasound-guided interventions in private practice clinics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE & SPECIALIZATIONS SECTION */}
      <section className="section-padding" style={{ background: 'var(--color-off-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="teal" style={{ marginBottom: '1rem' }}>Clinical Focus</Badge>
            <h2 className="section-title">Medical Expertise & Specializations</h2>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
            <div style={{ flex: '2 1 500px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {expertise.map((item) => (
                  <Card key={item.title} style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>{item.title}</h3>
                    <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <Card style={{ padding: '2rem', background: 'white', height: '100%' }}>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1.5rem' }}>Specific Specializations</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {specializations.map((spec, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span style={{ color: 'var(--color-teal)', marginTop: '2px' }}>✓</span>
                      <span style={{ color: 'var(--color-gray-700)', fontSize: '0.95rem', lineHeight: 1.5 }}>{spec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* QUALIFICATIONS & MEMBERSHIPS SECTION */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
            {/* Qualifications */}
            <div style={{ flex: '1 1 400px' }}>
              <Badge variant="navy" style={{ marginBottom: '1rem' }}>Education</Badge>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Academic Qualifications</h2>
              <div>
                {qualifications.map((q, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.25rem', background: i % 2 === 0 ? 'var(--color-off-white)' : 'white', borderRadius: 12, marginBottom: '0.75rem', border: '1px solid var(--color-gray-100)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}>
                      {q.year}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '1rem' }}>{q.degree}</div>
                      <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginTop: 4 }}>{q.institution}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Memberships */}
            <div style={{ flex: '1 1 400px' }}>
              <Badge variant="teal" style={{ marginBottom: '1rem' }}>Affiliations</Badge>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Professional Memberships</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {memberships.map((m) => (
                  <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--color-off-white)', borderRadius: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'var(--color-teal)' }}>⚕️</span>
                    </div>
                    <span style={{ color: 'var(--color-gray-700)', fontSize: '0.95rem', fontWeight: 500 }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER SECTION */}
      <section style={{ background: '#fff7ed', padding: '2.5rem 0', borderTop: '1px solid #fed7aa', borderBottom: '1px solid #fed7aa' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', maxWidth: 900, margin: '0 auto' }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠️</span>
            <div>
              <strong style={{ color: '#92400e', fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem' }}>Important Notice</strong>
              <p style={{ color: '#78350f', fontSize: '0.95rem', lineHeight: 1.7, marginTop: '0.5rem' }}>
                Dr. Muhammad Arif Rashid does not provide online medical consultations or treatment through this website. All consultations must be conducted in person at his clinic or hospital. This website is intended solely for providing information about Dr. Arif&apos;s services and facilitating appointment scheduling. For medical emergencies, please call 1122 immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
