import React, { useRef, useEffect, useState } from 'react';
import { socketManager } from '../lib/socket';
import { DrawingTools } from '../types/game';
import { useIsMobile } from '../hooks/use-is-mobile';
import { translateWord } from '../lib/i18n/index';
import { Palette, Eraser, RotateCcw, Download } from 'lucide-react';

interface DrawingCanvasProps {
  word?: string;
  readonly?: boolean;
  initialImage?: string;
  onDrawingComplete?: (imageData: string) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  word,
  readonly = false,
  initialImage,
  onDrawingComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const isMobile = useIsMobile();
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [tools, setTools] = useState<DrawingTools>({
    color: '#000000',
    brushSize: isMobile ? 8 : 5,
    tool: 'brush'
  });

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set the actual size in memory (scaled for high DPI)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Scale the canvas back down using CSS to match display size
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      // Scale the drawing context to match device pixel ratio
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Initialize white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, rect.width, rect.height);
      
      // Load initial image if provided
      if (initialImage) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
        };
        img.src = initialImage;
      }
      
      // Set drawing properties
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };
    
    setupCanvas();
    
    // Handle window resize to maintain proper canvas sizing
    const handleResize = () => {
      setupCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initialImage]);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e && e.touches.length > 0) {
      // Touch event - use the first touch point
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('changedTouches' in e && e.changedTouches.length > 0) {
      // Handle touch end events
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else if ('clientX' in e) {
      // Mouse or pointer event
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return { x: 0, y: 0 };
    }
    
    // Calculate scale factor to handle any CSS scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Return coordinates scaled to canvas dimensions
    return {
      x: (clientX - rect.left) * (rect.width / canvas.offsetWidth),
      y: (clientY - rect.top) * (rect.height / canvas.offsetHeight)
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (readonly) return;
    
    // Prevent default behavior for touch events to avoid scrolling/zooming
    if ('touches' in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const pos = getEventPos(e);
    
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    
    // Store the last position for smoother lines
    setLastPosition({ x: pos.x, y: pos.y });
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Save drawing
    const canvas = canvasRef.current;
    if (canvas && onDrawingComplete) {
      const imageData = canvas.toDataURL();
      onDrawingComplete(imageData);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (!isDrawing || readonly) return;
    
    // Prevent default for touch to avoid scrolling
    if ('touches' in e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getEventPos(e);

    ctx.globalCompositeOperation = tools.tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = tools.color;
    ctx.lineWidth = tools.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw smooth lines between points for better mobile experience
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    setLastPosition({ x: pos.x, y: pos.y });
  };

  const clearCanvas = () => {
    if (readonly) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Don't auto-submit when clearing canvas
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `drawing-${word || 'untitled'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {word && (
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-blue-800">Your word:</h3>
          <p className="text-2xl font-bold text-blue-900">{translateWord(word)}</p>
        </div>
      )}

      <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-4">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 rounded-lg cursor-crosshair drawing-canvas"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          onTouchCancel={stopDrawing}
          style={{
            width: isMobile ? '100%' : '800px',
            maxWidth: '100%',
            height: isMobile ? 'calc(50vh)' : '600px',
            maxHeight: isMobile ? '50vh' : '80vh',
            aspectRatio: '4/3',
            touchAction: 'none', // Prevent default touch behaviors
            userSelect: 'none', // Prevent text selection
            WebkitUserSelect: 'none', // Safari
            MozUserSelect: 'none', // Firefox
            msUserSelect: 'none' // Edge
          }}
        />

        {!readonly && (
          <div className={`mt-4 space-y-4 ${isMobile ? 'w-full' : ''}`}>
            {/* Color palette */}
            <div className={`flex items-center ${isMobile ? 'justify-center flex-wrap' : 'space-x-2'}`}>
              <Palette className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} text-gray-600 ${isMobile ? 'mb-2 w-full' : ''}`} />
              <div className={`flex ${isMobile ? 'flex-wrap justify-center gap-2' : 'space-x-1'}`}>
                {colors.map(color => (
                  <button
                    key={color}
                    className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} rounded-full border-2 ${
                      tools.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTools({ ...tools, color, tool: 'brush' })}
                  />
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className={`flex items-center justify-center ${isMobile ? 'flex-wrap gap-2' : 'space-x-4'}`}>
              <div className={`flex items-center ${isMobile ? 'w-full justify-center mb-2' : 'space-x-2'}`}>
                <label className={`${isMobile ? 'text-base' : 'text-sm'} font-medium`}>Size:</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={tools.brushSize}
                  onChange={(e) => setTools({ ...tools, brushSize: parseInt(e.target.value) })}
                  className={`${isMobile ? 'w-32 mx-2' : 'w-20'}`}
                />
                <span className={`${isMobile ? 'text-base w-8' : 'text-sm w-6'}`}>{tools.brushSize}</span>
              </div>

              <button
                className={`${isMobile ? 'px-4 py-3' : 'px-3 py-1'} rounded ${
                  tools.tool === 'eraser' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setTools({ ...tools, tool: tools.tool === 'eraser' ? 'brush' : 'eraser' })}
              >
                <Eraser className={`${isMobile ? 'w-6 h-6' : 'w-4 h-4'}`} />
              </button>

              <button
                className={`${isMobile ? 'px-4 py-3' : 'px-3 py-1'} bg-yellow-500 text-white rounded hover:bg-yellow-600`}
                onClick={clearCanvas}
              >
                <RotateCcw className={`${isMobile ? 'w-6 h-6' : 'w-4 h-4'}`} />
              </button>

              <button
                className={`${isMobile ? 'px-4 py-3' : 'px-3 py-1'} bg-green-500 text-white rounded hover:bg-green-600`}
                onClick={downloadCanvas}
              >
                <Download className={`${isMobile ? 'w-6 h-6' : 'w-4 h-4'}`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
