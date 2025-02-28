import { useState } from 'react';
import PropTypes from 'prop-types';

const TouchControls = ({ onControl }) => {
  const [gestureStart, setGestureStart] = useState(null);
  const PRESS_THRESHOLD = 300; // ms to differentiate between short and long press
  const MOVEMENT_THRESHOLD = 10; // minimal pixels to recognize as movement

  const handleGestureStart = (event) => {
    const point = event.touches ? event.touches[0] : event;
    setGestureStart({
      x: point.clientX,
      y: point.clientY,
      time: new Date().getTime()
    });
  };

  const handleGestureEnd = (event) => {
    if (!gestureStart) return;

    const point = event.changedTouches ? event.changedTouches[0] : event;
    const deltaX = point.clientX - gestureStart.x;
    const deltaY = point.clientY - gestureStart.y;
    const duration = new Date().getTime() - gestureStart.time;

    // Check if there was significant movement
    if (Math.abs(deltaX) > MOVEMENT_THRESHOLD || Math.abs(deltaY) > MOVEMENT_THRESHOLD) {
      // Handle swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        onControl(deltaX > 0 ? 'ArrowRight' : 'ArrowLeft');
      } else {
        // Vertical swipe (only handle downward swipe)
        if (deltaY > 0) {
          onControl('ArrowDown');
        }
      }
    } else {
      // No movement - handle as a press
      onControl(duration >= PRESS_THRESHOLD ? ' ' : 'ArrowUp');
    }

    setGestureStart(null);
  };

  return (
    <div 
      className="absolute inset-0 bg-transparent"
      onTouchStart={handleGestureStart}
      onTouchEnd={handleGestureEnd}
      onMouseDown={handleGestureStart}
      onMouseUp={handleGestureEnd}
    />
  );
};

TouchControls.propTypes = {
  onControl: PropTypes.func.isRequired
};

export default TouchControls;