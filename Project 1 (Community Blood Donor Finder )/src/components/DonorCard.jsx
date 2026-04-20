import React from 'react';
import { MapPin, User, CheckCircle, Activity } from 'lucide-react';

const DonorCard = ({ donor, onRequestHelp }) => {
  const { name, city, bloodGroup, availability, requestSent } = donor;

  return (
    <div className={`donor-card ${!availability ? 'unavailable' : 'available'}`}>
      <div className="card-header">
        <div>
          <h3 className="donor-name">{name}</h3>
          <div className="donor-city">
            <MapPin size={14} />
            <span>{city}</span>
          </div>
        </div>
        <div className="blood-group-badge">
          {bloodGroup}
        </div>
      </div>

      <div className={`availability-badge ${availability ? 'available' : 'unavailable'}`}>
        <div className="status-dot"></div>
        {availability ? 'Available to Donate' : 'Currently Unavailable'}
      </div>

      <button 
        className={`btn ${requestSent ? 'btn-disabled' : 'btn-primary'}`}
        onClick={() => onRequestHelp(donor.id)}
        disabled={requestSent || !availability}
      >
        {requestSent ? (
          <>
            <CheckCircle size={18} />
            Request Sent
          </>
        ) : (
          <>
            <Activity size={18} />
            Request Help
          </>
        )}
      </button>
    </div>
  );
};

export default DonorCard;
