import * as React from 'react';

interface HomeProps {
  message: string;
}

export const Home: React.FC<HomeProps> = ({ message }) => {
  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
};
