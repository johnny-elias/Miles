'use client';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./RealMap'), { ssr: false });

export default function MapPlaceholder() {
  return (
    <div className="w-full h-80 rounded-xl overflow-hidden shadow-inner">
      <LeafletMap />
    </div>
  );
} 