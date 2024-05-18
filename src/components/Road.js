// src/components/Road.js
import React, { useState, useEffect } from 'react';

const Road = ({ imageSrc, initialY, speed, windowHeight }) => {
  const [y, setY] = useState(initialY);

  useEffect(() => {
    const interval = setInterval(() => {
      let newY = y + speed;
      if (newY >= 0) { 
        newY -= 2 * windowHeight; 
      }
      setY(newY);
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [y, speed, windowHeight, initialY]);

  return (
    <img src={imageSrc} alt="Road" style={{ position: 'absolute', width: '100%', top: y, left: 0 }} />
  );
};

export default Road;
