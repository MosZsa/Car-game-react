import React, { useState, useEffect } from 'react';

const Car = ({ imageSrc, startX, startY, isPlayer, speed, windowHeight, moveCar, scale, gameRunning }) => {
  const [position, setPosition] = useState({ x: startX, y: startY });
  const [dead, setDead] = useState(false);

  useEffect(() => {
    if (isPlayer) {
      const handleKeyDown = (e) => {
        if (gameRunning) {
          moveCar(e.keyCode, position, setPosition);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [position, isPlayer, moveCar, gameRunning]);

  if (dead) return null; // Не рендерить машину, если "мертва"

  return (
    <img src={imageSrc} alt="Car" style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      width: `${60 * scale}%`,
      height: 'auto'
    }} />
  );
};

export default Car;
