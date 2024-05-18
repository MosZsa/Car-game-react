import React, { useEffect, useState } from 'react';

const OtherCars = ({ speed, windowWidth, windowHeight, setOtherCars, gameRunning }) => {
  const [cars, setCarsInternal] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameRunning) {
        const newCar = {
          x: Math.random() * (windowWidth - 50), // Расположение машины в случайной точке по ширине дороги
          y: -100, // Начинает свое движение выше видимой области экрана
          id: Date.now() // Уникальный идентификатор для ключа списка
        };
        setCarsInternal(currentCars => [...currentCars, newCar]);
      }
    }, 3000); // Добавляет новую машину каждые 3 секунды

    return () => clearInterval(interval);
  }, [windowWidth, gameRunning]);

  // Двигать машины вниз
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameRunning) {
        setCarsInternal(currentCars => {
          const updatedCars = currentCars.map(car => ({
            ...car,
            y: car.y + speed
          })).filter(car => car.y < windowHeight + 100); // Удаляем машины, которые вышли за пределы экрана
          setOtherCars(updatedCars); // Обновляем состояние otherCars в родительском компоненте
          return updatedCars;
        });
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [speed, windowHeight, setOtherCars, gameRunning]);

  return (
    <>
      {cars.map(car => (
        <img key={car.id} src="/images/car_reverse.png" alt="Car" style={{
          position: 'absolute',
          left: car.x,
          top: car.y,
          width: '250px', // предполагаемая ширина машины
          height: '300px' // предполагаемая высота машины
        }} />
      ))}
    </>
  );
};

export default OtherCars;
