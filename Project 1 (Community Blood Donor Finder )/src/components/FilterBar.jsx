import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const FilterBar = ({ 
  filterGroup, setFilterGroup, 
  searchCity, setSearchCity,
  sortBy, setSortBy 
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <Filter className="filter-icon" size={20} />
        <select 
          className="form-control"
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
        >
          <option value="All">All Blood Groups</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      <div className="filter-group">
        <Search className="filter-icon" size={20} />
        <input 
          type="text"
          className="form-control"
          placeholder="Search by city..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <ArrowUpDown className="filter-icon" size={20} />
        <select 
          className="form-control"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Default Sort</option>
          <option value="availability">Sort by Availability</option>
          <option value="name">Sort by Name (A-Z)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
