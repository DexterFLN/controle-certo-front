import React from 'react';
import './Spinner.css'; // Vamos adicionar o CSS aqui

const Spinner = () => {
  return (
    <svg className="spinner" width="50px" height="50px" viewBox="0 0 50 50">
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      />
    </svg>
  );
};

export default Spinner;
