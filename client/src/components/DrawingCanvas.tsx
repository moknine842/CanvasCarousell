import React, { useRef, useEffect, useState } from 'react';
import { socketManager } from '../lib/socket';
import { DrawingTools } from '../types/game';
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
  const [tools, setTools] = useState<DrawingTools>({
    color: '#000000',
    brushSize: 5,
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

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Initialize white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load initial image if provided
    if (initialImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialImage;
    }

    // Set drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [initialImage]);

  const startDrawing = (e: React.MouseEvent) => {
    if (readonly) return;
    setIsDrawing(true);
    draw(e);
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

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || readonly) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = tools.tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = tools.color;
    ctx.lineWidth = tools.brushSize;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (readonly) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (onDrawingComplete) {
      onDrawingComplete(canvas.toDataURL());
    }
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
          <p className="text-2xl font-bold text-blue-900">{word}</p>
        </div>
      )}

      <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-4">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 rounded-lg cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        {!readonly && (
          <div className="mt-4 space-y-4">
            {/* Color palette */}
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-gray-600" />
              <div className="flex space-x-1">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      tools.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTools({ ...tools, color, tool: 'brush' })}
                  />
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Size:</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={tools.brushSize}
                  onChange={(e) => setTools({ ...tools, brushSize: parseInt(e.target.value) })}
                  className="w-20"
                />
                <span className="text-sm w-6">{tools.brushSize}</span>
              </div>

              <button
                className={`px-3 py-1 rounded ${
                  tools.tool === 'eraser' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setTools({ ...tools, tool: tools.tool === 'eraser' ? 'brush' : 'eraser' })}
              >
                <Eraser className="w-4 h-4" />
              </button>

              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={clearCanvas}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={downloadCanvas}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
