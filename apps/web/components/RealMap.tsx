"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// leaflet-defaulticon-compatibility is a good package to handle Webpack/icon issues
// For now, we manually fix the icon path.
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function RealMap() {
  const position: [number, number] = [51.505, -0.09]; // Default position

  // URL for a clean, minimalist map theme from CartoDB (Positron)
  const tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';


  return (
    <MapContainer center={position} zoom={3} scrollWheelZoom={false} style={{ height: '400px', width: '100%', borderRadius: '12px' }}>
      <TileLayer
        attribution={attribution}
        url={tileUrl}
      />
      <Marker position={position}>
        <Popup>
          Miles: Award Travel Search
        </Popup>
      </Marker>
    </MapContainer>
  );
}