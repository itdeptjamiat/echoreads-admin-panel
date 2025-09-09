import React from 'react';

type FileInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const FileInput: React.FC<FileInputProps> = (props) => {
  return (
    <input type="file" className="block w-full text-sm text-gray-500" {...props} />
  );
};

export default FileInput; 