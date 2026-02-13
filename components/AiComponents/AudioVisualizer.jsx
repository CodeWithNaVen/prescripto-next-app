// components/AiComponents/AudioVisualizer.jsx
import React, { useEffect, useRef } from 'react';

const AudioVisualizer = ({ isActive, isSpeaking }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      const { width, height } = canvas;
      const centerY = height / 2;
      ctx.clearRect(0, 0, width, height);

      if (!isActive) {
         ctx.beginPath();
         ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
         ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
         ctx.lineWidth = 2; ctx.stroke();
         return;
      }

      ctx.beginPath();
      const baseAmplitude = isSpeaking ? 40 : 10; 
      const speed = isSpeaking ? 0.2 : 0.05;
      time += speed;

      for (let i = 0; i < width; i++) {
        let y = centerY;
        y += Math.sin(i * 0.02 + time) * baseAmplitude * Math.sin(i * 0.01 + time * 0.5);
        y += Math.sin(i * 0.05 - time * 0.8) * (baseAmplitude / 2);
        const taper = Math.min(i, width - i) / (width * 0.2);
        const yOffset = (y - centerY) * Math.min(1, taper);
        if (i === 0) ctx.moveTo(i, centerY + yOffset);
        else ctx.lineTo(i, centerY + yOffset);
      }

      ctx.lineWidth = 3;
      ctx.strokeStyle = isSpeaking ? '#0ea5e9' : '#14b8a6';
      ctx.lineCap = 'round';
      ctx.stroke();

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isActive, isSpeaking]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} height={120} 
      className="w-full h-32 rounded-xl bg-slate-50/50 backdrop-blur-sm"
    />
  );
};

export default AudioVisualizer;