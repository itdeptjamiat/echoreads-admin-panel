import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      className="w-full px-4 py-2 border rounded"
      {...props}
    />
  );
};

export default Input; 