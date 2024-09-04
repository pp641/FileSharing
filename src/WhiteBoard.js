import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faEraser, faUndo } from '@fortawesome/free-solid-svg-icons'; // Import undo icon for reset button
import './App.css'; // Ensure you have this CSS file or add styles directly in App.js

const WhiteBoard = () => {
  const [socket, setSocket] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('black');
  const [penThickness, setPenThickness] = useState(2);
  const [eraserThickness, setEraserThickness] = useState(10);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [isEraserActive, setIsEraserActive] = useState(false);

  const prodEnv = process.env.NODE_ENV === 'development' ? process.env.SOCKET_URL :"/"
  useEffect(() => {
    const socketInstance = io(prodEnv, {
      transports: ['websocket', 'polling'],
    });
    setSocket(socketInstance);

    socketInstance.on('draw', ({ x, y, prevX, prevY, color, thickness }) => {
      const ctx = canvasRef.current.getContext('2d');
      drawLine(ctx, prevX, prevY, x, y, color, thickness);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const startDrawing = (x, y) => {
    setIsDrawing(true);
    setCurrentPosition({ x, y });
  };

  const finishDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (x, y) => {
    if (!isDrawing) return;

    const ctx = canvasRef.current.getContext('2d');
    const color = isEraserActive ? 'white' : penColor; // Eraser color is fixed to white
    const thickness = isEraserActive ? eraserThickness : penThickness;

    drawLine(ctx, currentPosition.x, currentPosition.y, x, y, color, thickness);
    
    setCurrentPosition({ x, y });

    if (socket) {
      socket.emit('draw', {
        x,
        y,
        prevX: currentPosition.x,
        prevY: currentPosition.y,
        color,
        thickness,
      });
    }
  };

  const drawLine = (ctx, x1, y1, x2, y2, color, thickness) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
    ctx.closePath();
  };

  const handleMouseDown = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    startDrawing(offsetX, offsetY);
  };

  const handleMouseMove = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    draw(offsetX, offsetY);
  };

  const handleTouchStart = (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const toggleEraser = () => {
    setIsEraserActive(!isEraserActive);
  };

  const resetCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    // Emit clear event to other clients if needed
    if (socket) {
      socket.emit('clearCanvas');
    }
  };

  return (
    <div>
      <h1>Collaborative Whiteboard</h1>
      <div>
        <button onClick={toggleEraser} style={{ background: 'none', border: 'none' }}>
          <FontAwesomeIcon icon={isEraserActive ? faPen : faEraser} size="2x" />
        </button>
        <button onClick={resetCanvas} style={{ background: 'none', border: 'none', marginLeft: '10px' }}>
          <FontAwesomeIcon icon={faUndo} size="2x" />
        </button>
        <div>
          {isEraserActive ? (
            <>
              <label>Eraser Thickness: </label>
              <input
                type="number"
                value={eraserThickness}
                onChange={(e) => setEraserThickness(parseInt(e.target.value, 10))}
                min="5"
                max="50"
              />
            </>
          ) : (
            <>
              <label>Pen Color: </label>
              <input
                type="color"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
              />
              <label>Pen Thickness: </label>
              <input
                type="number"
                value={penThickness}
                onChange={(e) => setPenThickness(parseInt(e.target.value, 10))}
                min="1"
                max="10"
              />
            </>
          )}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={finishDrawing}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={finishDrawing}
        onTouchMove={handleTouchMove}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          border: '1px solid #000',
          backgroundColor: 'white',
          cursor: isEraserActive
            ? `url('/eraser-cursor.png'), auto`
            : `url('/pen-cursor.png'), auto`,
        }}
      />
    </div>
  );
};

export default WhiteBoard;
