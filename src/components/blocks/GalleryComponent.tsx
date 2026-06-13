'use client';

import Image from 'next/image';
import { useState } from 'react';

type GalleryItem = {
  src: string;
  alt: string;
  category: string;
  caption: string;
};

type GalleryComponentProps = {
  items: GalleryItem[];
  categories: string[];
};

export function GalleryComponent({ items, categories }: GalleryComponentProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const filtered = activeFilter === 'All' ? items : items.filter(i => i.category === activeFilter);

  return (
    <>
      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveFilter('All')}
          style={{
            padding: '0.625rem 1.5rem', borderRadius: 'var(--radius-full)',
            border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            background: activeFilter === 'All' ? 'var(--color-navy)' : 'white',
            color: activeFilter === 'All' ? 'white' : 'var(--color-gray-600)',
            boxShadow: activeFilter === 'All' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            transform: activeFilter === 'All' ? 'translateY(-2px)' : 'none',
          }}
        >
          All Photos
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            style={{
              padding: '0.625rem 1.5rem', borderRadius: 'var(--radius-full)',
              border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              background: activeFilter === cat ? 'var(--color-navy)' : 'white',
              color: activeFilter === cat ? 'white' : 'var(--color-gray-600)',
              boxShadow: activeFilter === cat ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              transform: activeFilter === cat ? 'translateY(-2px)' : 'none',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <style>{`
        .masonry-grid {
          column-count: 3;
          column-gap: 1.25rem;
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.25rem;
          position: relative;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .masonry-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .masonry-item img {
          width: 100% !important;
          height: auto !important;
          position: relative !important;
          display: block;
        }
        @media (max-width: 1024px) {
          .masonry-grid { column-count: 2; }
        }
        @media (max-width: 640px) {
          .masonry-grid { column-count: 1; }
        }
      `}</style>

      {/* Grid */}
      <div className="masonry-grid">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="masonry-item gallery-item"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelected(item)}
          >
            <Image 
              src={item.src} 
              alt={item.alt} 
              width={600} 
              height={800} 
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="gallery-overlay">
              <div>
                <div style={{ color: 'white', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem' }}>{item.caption}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: 2 }}>{item.category}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', cursor: 'pointer',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: 800, width: '100%', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
          >
            <div style={{ position: 'relative', height: 520 }}>
              <Image src={selected.src} alt={selected.alt} fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ background: 'white', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--color-navy)' }}>{selected.caption}</div>
                <div style={{ color: 'var(--color-gray-400)', fontSize: '0.8rem' }}>{selected.category}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--color-gray-100)', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600, color: 'var(--color-gray-700)' }}>
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
