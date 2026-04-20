import React from 'react';
import { SearchX } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <SearchX size={64} className="empty-state-icon" />
      <h3>No donors found</h3>
      <p>Try adjusting your search filters to find available donors.</p>
    </div>
  );
};

export default EmptyState;
