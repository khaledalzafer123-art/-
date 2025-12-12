import React, { useRef, useEffect, useState } from 'react';
import { Eraser, Pencil, RefreshCw } from 'lucide-react';

interface DrawingCanvasProps {
  letter: string; // The letter to trace
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ letter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        // Adjust for high DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const context = canvas.getContext('2d');
        if (context) {
            context.scale(dpr, dpr);
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.lineWidth = 15;
            context.strokeStyle = '#4f46e5'; // Indigo-600
            setCtx(context);
        }
    }
  }, []);

  // Draw the trace guide whenever letter changes or clear happens
  useEffect(() => {
      clearCanvas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter, ctx]);

  const drawGuide = () => {
      if(!ctx || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.save();
      ctx.clearRect(0, 0, width, height);
      
      // Draw Grid Lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.5); // Baseline
      ctx.lineTo(width, height * 0.5);
      ctx.stroke();

      // Draw Letter Guide
      // Calculate font size dynamically to fit the text in the box
      let fontSize = height * 0.6; // Start with a large size (good for single letters)
      ctx.font = `bold ${fontSize}px Tajawal`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#cbd5e1'; // Light grey text

      // Measure text width
      const metrics = ctx.measureText(letter);
      const maxW = width * 0.85; // Leave 15% padding
      
      // If text is wider than the box (e.g. full words), scale it down
      if (metrics.width > maxW) {
          fontSize = fontSize * (maxW / metrics.width);
          ctx.font = `bold ${fontSize}px Tajawal`;
      }

      ctx.fillText(letter, width / 2, height / 2);
      ctx.restore();
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    ctx?.lineTo(x, y);
    ctx?.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctx?.closePath();
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
      drawGuide();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative border-4 border-dashed border-indigo-300 rounded-3xl bg-white shadow-lg overflow-hidden touch-none w-full max-w-md aspect-square">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="flex gap-4">
        <button 
            onClick={clearCanvas}
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full font-bold shadow-md transition-transform hover:scale-105"
        >
            <Eraser /> مسح
        </button>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-3 rounded-full flex items-center gap-2 font-bold">
            <Pencil className="w-5 h-5" />
            تتبع الحرف
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;