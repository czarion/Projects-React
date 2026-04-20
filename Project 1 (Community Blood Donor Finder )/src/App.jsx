import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import DonorList from './components/DonorList';
import LoadingSpinner from './components/LoadingSpinner';
import DonorMap from './components/DonorMap';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const INDIAN_CITIES = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 }
];

const INDIAN_NAMES = [
  "Aarav Sharma", "Vivaan Patel", "Aditya Singh", "Vihaan Kumar", "Arjun Rao",
  "Sai Krishnan", "Rohan Gupta", "Priya Desai", "Ananya Reddy", "Kavya Iyer"
];

function App() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterGroup, setFilterGroup] = useState('All');
  const [searchCity, setSearchCity] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Failed to fetch donors data');
        }
        const data = await response.json();
        
        // Transform the data to include Indian names, cities, bloodGroup, availability, and requestSent
        const transformedData = data.map((user, index) => {
          const indianName = INDIAN_NAMES[index % INDIAN_NAMES.length];
          const indianCity = INDIAN_CITIES[index % INDIAN_CITIES.length];

          return {
            id: user.id,
            name: indianName,
            city: indianCity.name,
            lat: indianCity.lat,
            lng: indianCity.lng,
            bloodGroup: BLOOD_GROUPS[index % BLOOD_GROUPS.length],
            availability: Math.random() > 0.5,
            requestSent: false
          };
        });

        setDonors(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const handleRequestHelp = (id) => {
    setDonors(prevDonors => 
      prevDonors.map(donor => 
        donor.id === id ? { ...donor, requestSent: true } : donor
      )
    );
  };

  // Filter and sort the donors
  let filteredDonors = donors.filter(donor => {
    const matchGroup = filterGroup === 'All' || donor.bloodGroup === filterGroup;
    const matchCity = donor.city.toLowerCase().includes(searchCity.toLowerCase());
    return matchGroup && matchCity;
  });

  if (sortBy === 'availability') {
    filteredDonors.sort((a, b) => (a.availability === b.availability) ? 0 : a.availability ? -1 : 1);
  } else if (sortBy === 'name') {
    filteredDonors.sort((a, b) => a.name.localeCompare(b.name));
  }

  const availableCount = filteredDonors.filter(d => d.availability).length;

  return (
    <div className="app-container">
      <Header availableCount={availableCount} />
      
      <main className="main-content">
        <FilterBar 
          filterGroup={filterGroup} setFilterGroup={setFilterGroup}
          searchCity={searchCity} setSearchCity={setSearchCity}
          sortBy={sortBy} setSortBy={setSortBy}
        />

        {error && (
          <div className="empty-state" style={{ color: 'var(--primary-color)' }}>
            <h3>Error loading data</h3>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : !error ? (
          <div className="content-with-map">
            <DonorMap donors={filteredDonors} />
            <DonorList 
              donors={filteredDonors} 
              onRequestHelp={handleRequestHelp} 
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;
