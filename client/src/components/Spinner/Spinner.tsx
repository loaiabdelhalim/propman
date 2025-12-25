import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: number;
}

const Spinner = ({ size = 32 }: SpinnerProps) => (
  <div className="spinner" style={{ width: size, height: size }} aria-hidden="true"></div>
);

export default Spinner;
