import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons based on Request Status
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const defaultIcon = createCustomIcon('blue');
const requestedIcon = createCustomIcon('green'); // Changed color for requested

// Component to recenter map when donors change, if needed. 
// We'll just keep the map static at India's center for now.
const CenterMap = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    // map.setView(center, zoom); // Optional: dynamically recenter
  }, [center, zoom, map]);
  return null;
};

const DonorMap = ({ donors }) => {
  const defaultCenter = [22.9734, 78.6569];
  const defaultZoom = 4;

  return (
    <div className="donor-map-container">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%', borderRadius: 'var(--border-radius)', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {donors.map(donor => {
          if (!donor.lat || !donor.lng) return null;
          
          return (
            <Marker 
              key={donor.id} 
              position={[donor.lat, donor.lng]}
              icon={donor.requestSent ? requestedIcon : defaultIcon}
            >
              <Popup>
                <div style={{ padding: '0.5rem', fontFamily: 'var(--font-family)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>{donor.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      background: 'var(--primary-color)', 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      fontWeight: 'bold' 
                    }}>
                      {donor.bloodGroup}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{donor.city}</span>
                  </div>
                  <div style={{ 
                    marginBottom: '0.5rem',
                    color: donor.availability ? 'var(--success-color)' : 'var(--warning-color)',
                    fontWeight: '500'
                  }}>
                    {donor.availability ? 'Available' : 'Unavailable'}
                  </div>
                  <div style={{ 
                    fontWeight: '600',
                    color: donor.requestSent ? 'var(--success-color)' : 'var(--primary-color)' 
                  }}>
                    {donor.requestSent ? '✅ Request Sent' : 'Ready to Help'}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default DonorMap;
