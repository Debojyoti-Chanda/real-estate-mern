import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Error</h1>
      <p className="text-lg mb-2">Oops! Something went wrong.</p>
      <p className="text-lg mb-2">Please try again later or contact support if the problem persists.</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default ErrorPage;
