import React, { useState, useEffect, useRef } from 'react';
import Road from './Road';
import Car from './Car';
import OtherCars from './OtherCars';

const Game = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [speed, setSpeed] = useState(8);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(true);
  const [otherCars, setOtherCars] = useState([]);
  const [playing, setPlaying] = useState(false);
  const playerCar = useRef({ x: windowWidth / 2, y: windowHeight - 120 });
  const audioRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setGameRunning(prev => !prev);
      } else if (e.key === 'm' || e.key === 'M' || e.key === 'ь' || e.key === 'Ь') {
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameRunning) {
      if (playing) {
        audioRef.current.play();
      }
    } else {
      audioRef.current.pause();
    }
  }, [gameRunning, playing]);

  const moveCar = (keyCode, position, setPosition) => {
    if (!gameRunning) return;
    let newX = position.x;
    let newY = position.y;
    switch (keyCode) {
      case 37: // left arrow
        newX = Math.max(0, newX - speed); // не выходить за левую границу
        break;
      case 39: // right arrow
        newX = Math.min(windowWidth - 50, newX + speed); // не выходить за правую границу, 50 - предполагаемая ширина машины
        break;
      case 38: // up arrow
        newY = Math.max(0, newY - speed); // не выходить за верхнюю границу
        break;
      case 40: // down arrow
        newY = Math.min(windowHeight - 100, newY + speed); // не выходить за нижнюю границу, 100 - предполагаемая высота машины
        break;
      default:
        return; // ничего не делать если другая клавиша
    }
    setPosition({ x: newX, y: newY });
    playerCar.current = { x: newX, y: newY };
  };

  // Функция для проверки столкновений
  const checkCollision = (playerPos, car) => {
    const carWidth = 150;
    const carHeight = 250;
    return (
      playerPos.x < car.x + carWidth &&
      playerPos.x + carWidth > car.x &&
      playerPos.y < car.y + carHeight &&
      playerPos.y + carHeight > car.y
    );
  };

  // Проверка столкновений каждые 16 мс (примерно 60 раз в секунду)
  useEffect(() => {
    const checkCollisions = () => {
      if (gameRunning && otherCars.some(car => checkCollision(playerCar.current, car))) {
        setGameRunning(false);
        setPlaying(false);
      }
    };

    const intervalId = setInterval(checkCollisions, 5);
    return () => clearInterval(intervalId);
  }, [otherCars, gameRunning]);

  // Увеличение очков, когда машина покидает поле зрения
  useEffect(() => {
    const updateScore = setInterval(() => {
      if (gameRunning) {
        setOtherCars(currentCars => currentCars.map(car => {
          if (car.y > windowHeight + 98) {
            setScore(score => score + 1);
            return null;
          }
          return car;
        }).filter(car => car !== null));
      }
    }, 1000 / 60);

    return () => clearInterval(updateScore);
  }, [gameRunning, windowHeight]);

  const togglePlay = () => {
    if (!gameRunning) return; // Отключаем воспроизведение музыки после завершения игры
    setPlaying(prevPlaying => {
      if (!prevPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      return !prevPlaying;
    });
  };

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div onClick={togglePlay}>
      <audio ref={audioRef} src="/Music/background_music.mp3" loop />
      <div className="score" style={scoreStyle}>Счет: {score}</div>
      <div className="instructions" style={instructionsStyle}>Нажмите на Esc для паузы игры.</div>
      {!playing && gameRunning && (
        <div className="play-instructions" style={playInstructionsStyle}>
          Нажмите на экран или на кнопку "m", чтобы начать воспроизведение музыки.
        </div>
      )}
      {!gameRunning && (
        <button className="restart-button" onClick={handleRestart} style={restartButtonStyle}>
          Restart
        </button>
      )}
      <Road imageSrc="/images/road.jpg" initialY={0} speed={gameRunning ? speed : 0} windowHeight={windowHeight} gameRunning={gameRunning} />
      <Road imageSrc="/images/road.jpg" initialY={-windowHeight} speed={gameRunning ? speed : 0} windowHeight={windowHeight} gameRunning={gameRunning} />
      <Car imageSrc="/images/car.png" startX={windowWidth / 2} startY={windowHeight - 120} isPlayer={true} speed={speed} windowHeight={windowHeight} moveCar={moveCar} scale={0.2} gameRunning={gameRunning} />
      <OtherCars speed={speed} windowWidth={windowWidth} windowHeight={windowHeight} setOtherCars={setOtherCars} gameRunning={gameRunning} />
    </div>
  );
};

const scoreStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  fontSize: '20px',
  color: 'white',
  zIndex: 1000
};

const instructionsStyle = {
  position: 'absolute',
  top: '40px',
  left: '10px',
  fontSize: '16px',
  color: 'white',
  zIndex: 1000
};

const playInstructionsStyle = {
  position: 'absolute',
  top: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '16px',
  color: 'white',
  textAlign: 'center',
  zIndex: 1000
};

const restartButtonStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '10px 20px',
  fontSize: '20px',
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  zIndex: 1000
};

export default Game;
