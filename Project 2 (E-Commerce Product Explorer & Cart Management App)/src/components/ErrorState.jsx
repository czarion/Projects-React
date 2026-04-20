import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500">
      <AlertCircle className="w-16 h-16 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h2>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};
