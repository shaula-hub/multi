// import { useState, useEffect, useCallback, useRef } from "react";
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import TouchControls from './TouchControls';
import CLASSIC_SHAPES from './figure-shapes-0';
import QUINTIS_SHAPES from './figure-shapes-1';
import GEXIS_SHAPES from './figure-shapes-2';
import MULTI_SHAPES from './figure-shapes-3';
import backgroundImage from '/src/background.jpg';
import generateRandomColor from './calc.jsx';

const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 25;
const CELL_SIZE = 20;
const CONTAINER_WIDTH = 320;
const CONTAINER_HEIGHT = 680;

const MultiTetris = () => {
  const [gameType, setGameType] = useState(0);
  const [isMobile, setIsMobile] = useState(false);  
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);  
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  // const [selectedGameType, setSelectedGameType] = useState(gameType);
  // const [isSettingsSaveActive, setIsSettingsSaveActive] = useState(false);
  // const continueButtonRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [TETROMINO_SHAPES, setTetrominoShapes] = useState(CLASSIC_SHAPES);
  const [lastColor, setLastColor] = useState(null);  
  // const startButtonRef = useRef(null);
  const [guideLines, setGuideLines] = useState({
    left: -1,
    right: -1,
    height: 0,
  });

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  });
  const [containerScale, setContainerScale] = useState(1);  

  const detectMobileDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isMobileWidth = window.innerWidth <= 768;
    return isMobileDevice || isMobileWidth;
  };  

  // Create empty board
  function createEmptyBoard() {
    return Array(BOARD_HEIGHT)
      .fill()
      .map(() => Array(BOARD_WIDTH).fill(null));
  }

  const generateRandomPiece = useCallback(() => {
    const pieces = Object.keys(TETROMINO_SHAPES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const newColor = generateRandomColor(lastColor);
    setLastColor(newColor);
    return {
      shape: TETROMINO_SHAPES[randomPiece],
      color: newColor,
    };
  }, [TETROMINO_SHAPES, lastColor]);

  // Check collision
  const hasCollision = useCallback(
    (piece, pos) => {
      if (!piece) return false;

      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = pos.x + x;
            const newY = pos.y + y;

            // Check both board bounds and existing pieces
            if (
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && board[newY][newX]) ||
              (newY < 0 && board[0][newX])
            ) {
              // Added this check
              return true;
            }
          }
        }
      }
      return false;
    },
    [board]
  );

  // Simple Dialog Component
  const GameOverDialog = ({
    score,
    // onRestart,
    show,
    setShowGameOverDialog,
    setGameStarted,
    setIsMenuVisible,  // Add this prop
    setIsPaused        // Add this prop
  }) => {
    if (!show) return null;
  
    const handleRestart = () => {
      setShowGameOverDialog(false);
      setGameStarted(false);
      // Instead of calling onRestart, show the menu
      setIsMenuVisible(true);
      setIsPaused(true);
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg text-center max-w-xs w-full">
          <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
          <div className="text-xl mb-6">
            You Won
            <div className="text-4xl font-bold">{score}</div>
          </div>
          <button
            onClick={handleRestart}
            className="w-full px-4 py-2 bg-emerald-400 text-white rounded-full hover:bg-emerald-500"
            autoFocus
          >
            Menu
          </button>
        </div>
      </div>
    );
  };

  // Check for game over
  const checkGameOver = useCallback(
    (piece, pos) => {
      if (!piece) return false;
      return hasCollision(piece, pos);
    },
    [hasCollision]
  );

  // Merge piece with board
  const mergePieceWithBoard = useCallback(() => {
    if (!currentPiece) return board;

    const newBoard = board.map((row) => [...row]);

    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = position.y + y;
          if (boardY < 0) {
            setGameOver(true);
            setShowGameOverDialog(true);
            return board;
          }
          newBoard[boardY][position.x + x] = currentPiece.color;
        }
      }
    }

    return newBoard;
  }, [board, currentPiece, position]);

  // Clear completed rows
  const clearRows = useCallback((boardToCheck) => {
    const newBoard = boardToCheck.filter((row) => row.some((cell) => !cell));
    const clearedRows = BOARD_HEIGHT - newBoard.length;
    const newRows = Array(clearedRows)
      .fill()
      .map(() => Array(BOARD_WIDTH).fill(null));
    setScore((prevScore) => prevScore + clearedRows * 100);
    return [...newRows, ...newBoard];
  }, []);

  const calculateGuidelines = useCallback(
    (piece, pos) => {
      let minX = BOARD_WIDTH;
      let maxX = -1;
      let bottomY = BOARD_HEIGHT;

      if (piece && piece.shape) {
        piece.shape.forEach((row) => {
          row.forEach((cell, colIndex) => {
            if (cell) {
              const absoluteX = pos.x + colIndex;
              minX = Math.min(minX, absoluteX);
              maxX = Math.max(maxX, absoluteX);
            }
          });
        });
      }

      for (let x = minX; x <= maxX; x++) {
        let y = pos.y + piece.shape.length;
        while (y < BOARD_HEIGHT && !board[y][x]) {
          y++;
        }
        bottomY = Math.min(bottomY, y);
      }

      return {
        left: minX,
        right: maxX,
        stopY: bottomY,
      };
    },
    [board]
  );

  const movePiece = useCallback(
    (dx, dy) => {
      //// if (!currentPiece || gameOver || isPaused || isMenuVisible) return false;      
      const newPos = { x: position.x + dx, y: position.y + dy };
      if (!hasCollision(currentPiece, newPos)) {
        const guidelines = calculateGuidelines(currentPiece, newPos);
        setPosition(newPos);
        setGuideLines(guidelines);
        return true;
      }

      if (dy > 0) {
        const newBoard = mergePieceWithBoard();
        if (!gameOver) {
          setBoard(clearRows(newBoard));
          setGuideLines({ left: -1, right: -1, height: 0 });
          setCurrentPiece(null);

          setTimeout(() => {
            const newPos = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
            const newPiece = nextPiece;
            setCurrentPiece(newPiece);
            setPosition(newPos);
            setNextPiece(generateRandomPiece());

            if (!checkGameOver(newPiece, newPos)) {
              const guidelines = calculateGuidelines(newPiece, newPos);
              setGuideLines(guidelines);
            } else {
              setGameOver(true);
              setShowGameOverDialog(true);
            }
          }, 125);
        }
      }
      return false;
    },
    [
      position,
      currentPiece,
      nextPiece,
      gameOver,
      hasCollision,
      mergePieceWithBoard,
      clearRows,
      generateRandomPiece,
      checkGameOver,
      calculateGuidelines,
      // isMenuVisible,
      // isPaused,      
    ]
  );

  const accelerateDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused || isMenuVisible) return;    
    // if (!currentPiece || gameOver || isPaused) return;    
    // if (!currentPiece || gameOver) return;

    let dropY = position.y;
    while (!hasCollision(currentPiece, { x: position.x, y: dropY + 1 })) {
      dropY++;
    }

    setPosition({ x: position.x, y: dropY });
  }, [currentPiece, gameOver, isPaused, position.x, position.y, hasCollision, isMenuVisible]);    
  // }, [currentPiece, gameOver, position.x, position.y, hasCollision]);

  // Rotate piece
  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver) return null;

    const currentRows = currentPiece.shape.length;
    const currentCols = currentPiece.shape[0].length;
    const rotatedRows = currentCols;
    const rotatedCols = currentRows;
    const rotatedShape = Array(rotatedRows)
      .fill()
      .map(() => Array(rotatedCols).fill(0));

    for (let row = 0; row < currentRows; row++) {
      for (let col = 0; col < currentCols; col++) {
        rotatedShape[col][currentRows - 1 - row] = currentPiece.shape[row][col];
      }
    }

    return {
      shape: rotatedShape,
      color: currentPiece.color,
    };
  // }, [currentPiece, gameOver, isPaused]);    
   }, [currentPiece, gameOver]);

  /////// Initialize game
  const startGame = useCallback(() => {
    setIsMenuVisible(false); 
    setIsPaused(false);       
    setGameStarted(false);
    setShowGameOverDialog(false);
    const startPosition = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
    const newBoard = createEmptyBoard();
    const firstPiece = generateRandomPiece();
    const secondPiece = generateRandomPiece();

    if (checkGameOver(firstPiece, startPosition)) {
      setBoard(newBoard);
      setGameOver(true);
      setShowGameOverDialog(true);
      return;
    }

    // console.log('Image path:', './public/background.jpg');

    setBoard(newBoard);
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setPosition(startPosition);
    setGameOver(false);
    setShowGameOverDialog(false);
    setScore(0);
    setGameStarted(true);

    const guidelines = calculateGuidelines(firstPiece, startPosition);
    setGuideLines(guidelines);
  }, [generateRandomPiece, checkGameOver, calculateGuidelines]);

  useEffect(() => {
    // Change the document title to "MultiTetris"
    document.title = "MultiTetris";
  }, []);

  useEffect(() => {
    // Detect mobile device once on component mount
    setIsMobile(detectMobileDevice());
    
    // Always show Settings window on game start
    setIsMenuVisible(false); // Ensure menu is not visible
    setIsSettingsVisible(true); // Always show settings
    setIsPaused(true);
  }, []);

  {/* TouchControls - start */}
  useEffect(() => {
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Prevent zoom
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(viewportMeta);
    
    return () => {
      document.body.style.overflow = 'auto';
      document.head.removeChild(viewportMeta);
    };
  }, []);  

  useEffect(() => {
    switch(gameType) {
      case 0:
        setTetrominoShapes(CLASSIC_SHAPES);
        break;
      case 1:
        setTetrominoShapes(QUINTIS_SHAPES);
        break;
      case 2:
        setTetrominoShapes(GEXIS_SHAPES);
        break;
      case 3:
          setTetrominoShapes(MULTI_SHAPES);
          break;
      default:
        setTetrominoShapes(CLASSIC_SHAPES);
    }
  }, [gameType]);

  const handleTouchControl = (keyCode) => {
    if (!gameStarted || gameOver || isPaused || isMenuVisible) return;    
      
    let currentY = position.y;
    const rotated = rotatePiece();
  
    switch (keyCode) {
      case "ArrowLeft":
        movePiece(-1, 0);
        break;
      case "ArrowRight":
        movePiece(1, 0);
        break;
      case "ArrowUp":
        if (rotated && !hasCollision(rotated, position)) {
          const guidelines = calculateGuidelines(rotated, position);
          setCurrentPiece(rotated);
          setGuideLines(guidelines);
        }
        break;
      case " ": // Space
        accelerateDrop();
        if (position.y !== currentY) {
          movePiece(0, 1);
        }
        break;
      case "ArrowDown":
        movePiece(0, 1);
        break;
    }
  };
  {/* TouchControls - end */}
  
  // Handle key presses
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver) {
        if (event.key === "Enter") {
          startGame();
        }
        return;
      }

      if (event.key === "F1") {
        event.preventDefault();
        if (isSettingsVisible) {
          setIsSettingsVisible(false);
          setIsPaused(false);  // Resume game when leaving settings
          return;
        }
        setIsPaused(true);  // Pause game when entering settings
        setIsSettingsVisible(true);
      }

      if (event.key === "Escape") {
        event.preventDefault();        
        setIsMenuVisible(true);     
        setIsPaused(true);             
        return;
      }

      let currentY = position.y;
      const rotated = rotatePiece();

      switch (event.key) {
        case "ArrowLeft":
          movePiece(-1, 0);
          break;
        case "ArrowRight":
          movePiece(1, 0);
          break;
        case "ArrowUp":
          if (rotated && !hasCollision(rotated, position)) {
            const guidelines = calculateGuidelines(rotated, position);
            setCurrentPiece(rotated);
            setGuideLines(guidelines);
          }
          break;
        case " " /* Space */:
          event.preventDefault();
          accelerateDrop();
          if (position.y !== currentY) {
            // Only lock if we actually moved
            movePiece(0, 1);
          }
          break;
        case "ArrowDown":
          movePiece(0, 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    gameStarted,
    gameOver,
    movePiece,
    accelerateDrop,
    rotatePiece,
    startGame,
    hasCollision,
    calculateGuidelines,
    isSettingsVisible,
    isPaused,    
    position,
  ]);
  {/* Keypress - end */}


  // Add useEffect to handle window resize and calculate scale
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      setWindowSize({
        width: newWidth,
        height: newHeight
      });
      
      // Calculate scale based on available height (with some padding)
      // We're using 95% of the viewport height to leave some margin
      const availableHeight = newHeight * 0.95;
      
      // Only scale down, never scale up
      const newScale = availableHeight < CONTAINER_HEIGHT 
        ? availableHeight / CONTAINER_HEIGHT 
        : 1;
      
      setContainerScale(newScale);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused || isMenuVisible) return;

    const gameLoop = setInterval(() => {
      movePiece(0, 1);
    }, 1500); // Game speed - the greater number the slower initial movement

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, isPaused, movePiece, isMenuVisible]);  

  // Render preview board
  const renderPreview = useCallback(() => {
    if (!nextPiece) return [];

    // Create a board just big enough for the piece
    const width = nextPiece.shape[0].length;
    const height = nextPiece.shape.length;
    const previewBoard = Array(height)
      .fill()
      .map(() => Array(width).fill(null));

    // Fill the board with just the piece
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (nextPiece.shape[y][x]) {
          previewBoard[y][x] = nextPiece.color;
        }
      }
    }

    return previewBoard;
  }, [nextPiece]);

  useEffect(() => {
    setIsMenuVisible(true);  // Show menu on initial load
    setIsPaused(true);    
  }, []);  

  // Render game board
  const renderBoard = useCallback(() => {
    const displayBoard = board.map((row) => [...row]);

    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard;
  }, [board, currentPiece, position]);

  GameOverDialog.propTypes = {
    score: PropTypes.number.isRequired,
    onRestart: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    setShowGameOverDialog: PropTypes.func.isRequired,
    setGameStarted: PropTypes.func.isRequired,
    setIsMenuVisible: PropTypes.func.isRequired,
    setIsPaused: PropTypes.func.isRequired,
  };

  return (
<div 
  className="flex justify-center items-center min-h-screen"
  style={{
    // backgroundColor: "red", // Or your background image
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundImage:  `url(${backgroundImage})` 
  }}
>
  {/* Game container - white background with consistent borders */}
  <div className="flex flex-col items-center" style={{ 
  width: `${CONTAINER_WIDTH}px`, 
  height: `${CONTAINER_HEIGHT}px`,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: `translate(-50%, -50%) scale(${containerScale})`, // Only one transform property
  transformOrigin: 'center center',
  overflow: 'hidden',
  border: '2px solid #333',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: 'white',
  padding: '0',
  margin: 'auto'
}}>
      {/* Hiding text cursor */}
      <style>{`
        .no-focus {
          outline: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
      
      {/* Main column with 3 sections */}
      <div className="flex flex-col relative">
        {/* Section 1: Header */}
        <div className="border-2 border-gray-400 p-1 mb-1 flex justify-center items-center no-focus">
          <h1
            className="text-4xl font-bold no-focus"
            style={{
              color: "#002366",
              WebkitTextFillColor: "#002366",
            }}
          >
            MultiTetris
          </h1>
        </div>

        {/* Section 2: Auxiliary with Score and Next */}
        <div 
          className="border-2 border-gray-400 p-4 mb-1 flex justify-between items-center no-focus" 
          style={{ height: "80px" }}
        >
          {/* Next piece preview - with flexible width */}
          <div className="flex items-center justify-center" style={{ height: "96px", overflow: "hidden", maxWidth: "160px" }}>
            <div
              className="grid gap-px"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${nextPiece?.shape[0].length || 1}, 20px)`,
                gap: "1px",
                backgroundColor: "white",
              }}
            >
              {renderPreview().map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`preview-${y}-${x}`}
                    className="w-5 h-5"
                    style={{
                      backgroundColor: cell || "white",
                      border: cell ? "1px solid rgba(0,0,0,0.2)" : "none",
                    }}
                  />
                ))
              )}
            </div>
          </div>
          
          {/* Score with fixed width for stability */}
          <div
            className="text-4xl font-bold no-focus mx-4"
            style={{ color: "#002366", minWidth: "80px", textAlign: "center" }}
          >
            {score}
          </div>
          
          {/* Settings Icon */}
          <div 
            className="flex items-center relative" 
            style={{ zIndex: 20 }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsPaused(true);
                setIsSettingsVisible(true);
              }}
              className="text-2xl focus:outline-none w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-200 rounded-full transition-colors relative z-20"
              aria-label="Settings"
              style={{ 
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#002366" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-6 h-6 pointer-events-none"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>
        </div>  

        {/* Section 3: Game Field */}
        <div className="border-2 border-gray-400 p-1 no-focus relative">
          <div 
            className="grid grid-cols-15 bg-gray-200 no-focus"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`, // Updated to use BOARD_WIDTH
              gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
              gap: "1px",
              backgroundColor: "#aaa",
              border: "1px solid #aaa",
              padding: "1px"
            }}
          >
        
          {renderBoard().map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className="w-5 h-5 no-focus"
                style={{ backgroundColor: cell || "white" }}
              />
            ))
          )}
          
          {/* Game pieces - rendered on top */}
          <div className="grid grid-cols-15 gap-px bg-transparent no-focus relative z-10">
            {renderBoard().map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="w-5 h-5 no-focus"
                  style={{ 
                    backgroundColor: cell || "transparent",
                    width: `${CELL_SIZE}px`,
                    height: `${CELL_SIZE}px`
                  }}
                />
              ))
            )}
          </div>

          {/* Draw guide lines */}
          {currentPiece && currentPiece.shape && 
            guideLines.left >= 0 &&
            guideLines.stopY <= BOARD_HEIGHT &&
            !isMenuVisible && 
            !isSettingsVisible && (
              <>
                {/* Left guide line */}
                <div
                  className="absolute border-l-2 border-dashed"
                  style={{
                    position: "absolute",
                    left: `${((guideLines.left + 0.4) * (CELL_SIZE+0.3))}px`, // Account for gap
                    // left: `${(guideLines.left * (CELL_SIZE + 1.15))}px`, // Account for gap
                    top: `${(position.y + currentPiece.shape.length) * CELL_SIZE + 10}px`,
                    height: `${Math.max(0, guideLines.stopY - (position.y + currentPiece.shape.length)) * CELL_SIZE}px`,
                    borderColor: "#00ffff",
                    zIndex: 10,
                  }}
                />
                {/* Right guide line */}
                <div
                  className="absolute border-l-2 border-dashed"
                  style={{
                    position: "absolute",
                    left: `${((guideLines.right + 1.5) * (CELL_SIZE+0.3))}px`, // Account for gap              
                    // left: `${((guideLines.right + 1) * (CELL_SIZE + 1.15))}px`, // Account for gap              
                    top: `${(position.y + currentPiece.shape.length) * CELL_SIZE + 10}px`,
                    height: `${Math.max(0, guideLines.stopY - (position.y + currentPiece.shape.length)) * CELL_SIZE}px`,
                    borderColor: "#00ffff",
                    zIndex: 10,
                  }}
                />
              </>
          )}
        </div>
      </div>

        {gameStarted && !gameOver && (
          <TouchControls onControl={handleTouchControl} />
        )}
      </div>

      {/* Menu overlay - centered over game field */}
      {isMenuVisible && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg border-4 border-gray-400 p-4 w-48 shadow-lg">
            <div className="flex flex-col gap-3">
              <button
                autoFocus
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => {
                  setIsMenuVisible(false);
                  startGame();
                }}
              >
                Play New Game
              </button>
              
              <button
                className={`w-full py-2 px-4 ${
                  gameStarted 
                    ? "bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
                    : "bg-gray-400 text-white rounded cursor-not-allowed opacity-50"
                }`}
                onClick={() => {
                  if (gameStarted) {
                    setIsMenuVisible(false);
                    setIsPaused(false);
                  }
                }}
                disabled={!gameStarted}
              >
                Continue
              </button>
              
              <button
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => {
                  setIsMenuVisible(false);
                  setIsSettingsVisible(true);
                  setIsPaused(true);
                }}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings window - centered on game field */}
      {isSettingsVisible && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg border-2 border-gray-400 p-4 w-64 flex flex-col gap-4">
            {/* Settings section */}
            <div className="border-2 border-gray-400 p-2">
              <p className="text-xl mb-2 text-center font-bold">Settings</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gameType"
                    value={0}
                    checked={gameType === 0}  // Use gameType directly instead of selectedGameType
                    onChange={() => {
                      setGameType(0);  // Apply the change immediately
                    }}
                    className="mr-2"
                  />
                  Classic (4-cells)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gameType"
                    value={1}
                    checked={gameType === 1}
                    onChange={() => {
                      setGameType(1);
                    }}
                    className="mr-2"
                  />
                  Quintis (5-cells)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gameType"
                    value={2}
                    checked={gameType === 2}
                    onChange={() => {
                      setGameType(2);
                    }}
                    className="mr-2"
                  />
                  Gexis (6-cells)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gameType"
                    value={3}
                    checked={gameType === 3}
                    onChange={() => {
                      setGameType(3);
                    }}
                    className="mr-2"
                  />
                  MultiTetris (4-6)
                </label>
              </div>
            </div>

            {/* Controls info with device-specific instructions */}
            <div className="border-2 border-gray-400 p-2">
              <p className="text-xl mb-2 text-center font-bold cursor-not-allowed">Controls</p>
              {isMobile ? (
                // Mobile-specific controls
                <ul>
                  <p className="font-bold">Movement <span className="font-medium">←</span> <span className="font-medium">→</span></p>
                  <p>Swipe <span className="font-medium">←</span> <span className="font-medium">→</span></p>
                  <p className="font-bold mt-2">Accelerate drop</p>
                  <p>Swipe <span className="font-medium">↓</span></p>
                  <p className="font-bold mt-2">Rotate</p>
                  <p>Short Touch</p>
                  <p className="font-bold mt-2">Instant drop</p>
                  <p>Long press</p>
                </ul>
              ) : (
                // Desktop controls
                <ul>
                  <li>← : Left</li>
                  <li>→ : Right</li>
                  <li>↑ : Rotate</li>
                  <li>↓ : Accelerate drop</li>
                  <li>Space : Instant drop</li>
                  <li>ESC : Stop and play again</li>
                </ul>
                )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <button
                className={`px-4 py-2 ${
                  gameStarted 
                  ? "bg-gray-500 text-white rounded hover:bg-gray-600" 
                  : "bg-gray-400 text-white rounded cursor-not-allowed opacity-50"
                }`}
                onClick={() => {
                  if (gameStarted) {
                    setIsSettingsVisible(false);
                    setIsPaused(false);
                    if (gameStarted) {
                      const resumeTimer = setTimeout(() => {
                        movePiece(0, 1);
                      }, 1500);
                      return () => clearTimeout(resumeTimer);
                    }
                  }
                }}
                disabled={!gameStarted}
              >
                Continue
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  setIsSettingsVisible(false);
                  setIsPaused(false);
                  startGame();
                }}
                autoFocus={!gameStarted} // Auto-focus the New Game button when no game is in progress
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      <GameOverDialog
        score={score}
        onRestart={startGame}
        show={showGameOverDialog}
        setShowGameOverDialog={setShowGameOverDialog}
        setGameStarted={setGameStarted}
        setIsMenuVisible={setIsMenuVisible} 
        setIsPaused={setIsPaused} 
      />

    </div>
  );
};

export default MultiTetris;