import React, { useState, useEffect, useRef } from 'react';

const MobileGame = () => {
  const [gameState, setGameState] = useState({
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 800,
    windowHeight: typeof window !== 'undefined' ? window.innerHeight : 600,
    originalGameWidth: 800, // Original game dimensions
    originalGameHeight: 600,
    scale: 1,
    orientation: 'landscape'
  });

  const gameContainerRef = useRef(null);

  // Handle resize and orientation changes
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const orientation = windowWidth > windowHeight ? 'landscape' : 'portrait';
      
      // Calculate scale while maintaining aspect ratio
      let scale;
      if (orientation === 'landscape') {
        scale = Math.min(
          windowWidth / gameState.originalGameWidth,
          windowHeight / gameState.originalGameHeight
        );
      } else {
        // For portrait, we might want to use a different scaling strategy
        scale = Math.min(
          windowWidth / gameState.originalGameHeight,
          windowHeight / gameState.originalGameWidth
        );
      }

      // Ensure scale is never too small
      scale = Math.max(scale, 0.3);

      setGameState(prev => ({
        ...prev,
        windowWidth,
        windowHeight,
        scale,
        orientation
      }));
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Example game grid
  const renderGameGrid = (): JSX.Element[] => {
    const cells: JSX.Element[] = [];
    const gridSize = 4;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        cells.push(
          <div
            key={`${i}-${j}`}
            className="bg-blue-200 border border-blue-400 rounded w-20 h-20"
          />
        );
      }
    }
    return cells;
  };

  // Calculate the container size after scaling
  const scaledWidth = gameState.originalGameWidth * gameState.scale;
  const scaledHeight = gameState.originalGameHeight * gameState.scale;

  const gameStyle = {
    transform: `scale(${gameState.scale})`,
    transformOrigin: 'top left',
    width: gameState.originalGameWidth,
    height: gameState.originalGameHeight,
  };

  // Calculate container styles for centering
  const containerStyle = {
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
    margin: '0 auto', // Center horizontally
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  // Style for the outer wrapper to handle overflow and scrolling if needed
  const wrapperStyle = {
    width: '100%',
    height: '100vh',
    overflow: gameState.scale < 0.7 ? 'auto' : 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f0f0',
  };

  return (
    <div style={wrapperStyle}>
      {/* Container with proper dimensions to hold the scaled game */}
      <div style={containerStyle}>
        {/* Game container */}
        <div
          ref={gameContainerRef}
          className="bg-white rounded-lg shadow-lg p-4"
          style={gameStyle}
        >
          {/* Game content */}
          <div className="flex flex-col gap-4">
            {/* Game header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Mobile Game</h2>
              <div className="text-sm text-gray-600">
                Scale: {gameState.scale.toFixed(2)}
              </div>
            </div>

            {/* Game area */}
            <div className="flex flex-wrap gap-2 w-80 h-80">
              {renderGameGrid()}
            </div>

            {/* Game controls */}
            <div className="flex gap-4 justify-center mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Left
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Right
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orientation warning */}
      {gameState.orientation === 'portrait' && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center text-white p-4 text-center">
          <div>
            <p className="text-lg mb-2">Please rotate your device</p>
            <p className="text-sm">This game is best played in landscape mode</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileGame;