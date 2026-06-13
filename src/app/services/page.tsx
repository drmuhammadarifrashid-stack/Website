import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pain Management Services | Dr. Muhammad Arif Rashid',
  description: 'Explore the full range of pain management services offered by Dr. Muhammad Arif Rashid including chronic pain, interventional procedures, and perioperative care.',
};

const serviceCategories = [
  {
    id: 'chronic',
    icon: '🩺',
    title: 'Chronic Pain Management',
    subtitle: 'Comprehensive care for long-term pain conditions',
    description: 'Chronic pain affects millions of people and can severely impact quality of life. Dr. Arif takes a comprehensive, multimodal approach to managing persistent pain conditions, combining pharmacological therapies, interventional procedures, and lifestyle modifications to treat the root cause.',
    benefits: [
      'Improved daily functionality and mobility',
      'Reduced reliance on oral pain medications',
      'Better sleep quality and mood stabilization',
      'Personalized treatment plans avoiding "one-size-fits-all" approaches'
    ],
    conditions: [
      { name: 'Back & Spine Pain', desc: 'Lumbar and cervical disc disease, degenerative spine conditions' },
      { name: 'Joint Pain', desc: 'Osteoarthritis, rheumatic conditions affecting hips, knees, shoulders' },
      { name: 'Nerve Pain (Neuropathy)', desc: 'Diabetic neuropathy, peripheral neuropathy, post-herpetic neuralgia' },
      { name: 'Cancer-Related Pain', desc: 'Comprehensive palliative pain control for oncology patients' },
      { name: 'Psychosomatic Pain', desc: 'Pain with psychological components requiring integrated mind-body treatment' },
      { name: 'Fibromyalgia', desc: 'Widespread musculoskeletal pain with fatigue and sleep disturbances' },
    ],
    color: 'var(--color-teal)',
    bg: 'var(--color-teal-lighter)',
  },
  {
    id: 'interventional',
    icon: '💉',
    title: 'Interventional Pain Procedures',
    subtitle: 'Precision procedures for targeted pain relief',
    description: 'Interventional pain management uses minimally invasive techniques to directly target pain generators. Dr. Arif performs a wide range of fluoroscopy- and ultrasound-guided procedures with high precision and safety standards, delivering medication exactly where it is needed.',
    benefits: [
      'Highly targeted, pinpoint pain relief',
      'Minimally invasive with fast recovery times',
      'Often delays or prevents the need for major surgery',
      'Outpatient procedures with minimal to no downtime'
    ],
    conditions: [
      { name: 'Nerve Blocks', desc: 'Stellate ganglion, celiac plexus, superior hypogastric plexus' },
      { name: 'Epidural Injections', desc: 'Cervical, thoracic, and lumbar injections for radicular pain' },
      { name: 'Facet Joint Injections', desc: 'Intra-articular blocks for facet-mediated spine pain' },
      { name: 'Radiofrequency Ablation', desc: 'Thermal neurotomy for long-lasting joint and nerve pain relief' },
      { name: 'Spinal Cord Stimulation', desc: 'Neuromodulation for complex chronic pain conditions' },
      { name: 'Trigger Point Injections', desc: 'Myofascial pain treatment targeting active trigger points' },
    ],
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    id: 'perioperative',
    icon: '🏥',
    title: 'Perioperative Optimization',
    subtitle: 'Preparing patients for safer, smoother surgical outcomes',
    description: 'Proper pre-surgical pain management and anesthetic planning is critical for patient safety and recovery. Dr. Arif provides comprehensive perioperative services to reduce surgical risk, optimize chronic health conditions, and ensure the best possible surgical outcomes.',
    benefits: [
      'Significantly reduced surgical complications',
      'Lower risk of severe intraoperative events',
      'Optimized chronic conditions before surgery',
      'Shorter hospital stays and faster discharge'
    ],
    conditions: [
      { name: 'Pre-Surgical Assessment', desc: 'Detailed evaluation of pain levels and anesthetic risk factors' },
      { name: 'Risk Stratification', desc: 'Optimization of high-risk cardiac and pulmonary patients' },
      { name: 'Pre-operative Optimization', desc: 'Reducing baseline pain before surgery for better outcomes' },
      { name: 'Regional Anesthesia', desc: 'Designing nerve block protocols for opioid-sparing analgesia' },
      { name: 'Patient Education', desc: 'Counseling on what to expect, breathing, and recovery prep' },
      { name: 'Medication Management', desc: 'Safe transition of chronic medications in the perioperative period' },
    ],
    color: '#059669',
    bg: '#f0fdf4',
  },
  {
    id: 'postoperative',
    icon: '💊',
    title: 'Postoperative Pain Management',
    subtitle: 'Expert pain control for faster, more comfortable recovery',
    description: 'Effective postoperative pain management reduces complications, shortens hospital stays, and accelerates rehabilitation. Dr. Arif designs individualized post-surgical analgesic strategies that prioritize safety, comfort, and a rapid return to normal activities.',
    benefits: [
      'Accelerated rehabilitation and physical therapy',
      'Prevention of acute pain transitioning to chronic pain',
      'Reduced risk of opioid dependence and side effects',
      'Improved overall patient comfort and satisfaction'
    ],
    conditions: [
      { name: 'Acute Pain Control', desc: 'Multimodal analgesic protocols immediately after surgery' },
      { name: 'Patient-Controlled Analgesia', desc: 'PCA pump management for empowered pain control' },
      { name: 'Regional Nerve Catheters', desc: 'Continuous nerve blocks for extended postoperative relief' },
      { name: 'Opioid-Sparing Strategies', desc: 'Reducing opioid requirements through non-opioid adjuvants' },
      { name: 'Rehabilitation Planning', desc: 'Pain plans designed around physiotherapy milestones' },
      { name: 'Chronic Pain Prevention', desc: 'Early management to prevent acute pain from becoming chronic' },
    ],
    color: '#7c3aed',
    bg: '#fdf4ff',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* HEADER */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 100%)', paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ background: 'rgba(26,122,138,0.3)', color: 'var(--color-teal-light)', marginBottom: '1rem' }}>
            Clinical Services
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Comprehensive Pain Management Services
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: 620, margin: '0 auto 2rem' }}>
            Tailored, evidence-based treatment for every type of pain — from chronic conditions to surgical care.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {serviceCategories.map((s) => (
              <Button key={s.id} href={`#${s.id}`} size="sm" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
                {s.icon} {s.title.split(' ')[0]}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES LISTING */}
      {serviceCategories.map((svc, idx) => (
        <section key={svc.id} id={svc.id} className="section-padding" style={{ background: idx % 2 === 0 ? 'white' : 'var(--color-off-white)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'flex-start' }} className="service-detail-grid">
              
              {/* LEFT COL: Description & Benefits */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '3rem', background: svc.bg, width: 80, height: 80, borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    {svc.icon}
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1.2 }}>{svc.title}</h2>
                    <p style={{ color: svc.color, fontWeight: 600, fontSize: '0.95rem', marginTop: '0.25rem' }}>{svc.subtitle}</p>
                  </div>
                </div>

                <p style={{ color: 'var(--color-gray-600)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  {svc.description}
                </p>

                <Card style={{ padding: '2rem', background: 'white', borderLeft: `4px solid ${svc.color}` }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1rem' }}>
                    Key Benefits
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {svc.benefits.map((benefit, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <span style={{ color: svc.color, marginTop: '2px' }}>✓</span>
                        <span style={{ color: 'var(--color-gray-700)', fontSize: '0.95rem', lineHeight: 1.5 }}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <div style={{ marginTop: '2rem' }}>
                  <Button href="/appointment" variant="primary" style={{ background: svc.color }}>
                    Book an Appointment
                  </Button>
                </div>
              </div>

              {/* RIGHT COL: Conditions Treated */}
              <div>
                <Badge variant="navy" style={{ marginBottom: '1.5rem', background: svc.color, color: 'white' }}>
                  Conditions Treated
                </Badge>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  {svc.conditions.map((cond) => (
                    <Card key={cond.name} style={{ padding: '1.5rem', background: 'white', transition: 'transform 0.2s', cursor: 'default' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: svc.color, flexShrink: 0 }} />
                        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--color-navy)' }}>{cond.name}</h4>
                      </div>
                      <p style={{ color: 'var(--color-gray-500)', fontSize: '0.85rem', lineHeight: 1.6 }}>{cond.desc}</p>
                    </Card>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      ))}

      {/* GLOBAL CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 100%)', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Outfit, sans-serif', color: 'white', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Unsure which service you need?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 2rem' }}>
            Dr. Arif provides thorough consultations to correctly diagnose your pain and recommend the most effective treatment pathway.
          </p>
          <Button href="/contact" variant="teal" size="lg">Contact Us for Guidance</Button>
        </div>
      </section>

      <style>{`
        .service-detail-grid > div:last-child .card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </>
  );
}
