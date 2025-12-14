import { useRef, useEffect } from "react";

export default function Visualizer({ audioRef, currentSong }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  
  // Define the target dimension to fill the parent's inner space (400 - 2*24 = 352)
  const VISUALIZER_SIZE = 352; 

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 128;
      
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      analyser.getByteFrequencyData(dataArray);

      // Soft trail
      ctx.fillStyle = "rgba(17, 24, 39, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2; 
      const centerY = canvas.height / 2; 
      const ringCount = 5;
      const circleCount = 32;
      
      // Safety margin (90) remains to prevent vertical clipping on the 352px height
      const safetyMargin = 90; 
      const maxRadius = Math.min(centerX, centerY) - safetyMargin; 
      
      const ringSpacing = maxRadius / ringCount;

      // Very subtle center glow
      const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius / 2);
      centerGradient.addColorStop(0, "rgba(139, 92, 246, 0.08)");
      centerGradient.addColorStop(0.6, "rgba(99, 102, 241, 0.05)");
      centerGradient.addColorStop(1, "rgba(59, 130, 246, 0.02)");
      ctx.fillStyle = centerGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const halfCircleCount = circleCount / 2;
      const maxMappedFreqs = 20;

      for (let ring = 0; ring < ringCount; ring++) {
        
        let ringMagnitude = 0;
        let ringFreqStart = ring * 4;
        for (let j = 0; j < 4; j++) {
            ringMagnitude += dataArray[ringFreqStart + j] / 255;
        }
        ringMagnitude = Math.pow(ringMagnitude / 4, 1.4); 

        // Ring Movement
        const baseRingRadius = (ring + 1) * ringSpacing;
        const pulseOffset = ringMagnitude * 35; 
        const radius = baseRingRadius + pulseOffset;

        for (let i = 0; i < circleCount; i++) {
          const angle = (i / circleCount) * 2 * Math.PI;

          // Symmetrical frequency mapping
          let freqBin = i;
          if (freqBin >= halfCircleCount) {
            freqBin = circleCount - 1 - i;
          }

          const freqIndex = Math.floor((freqBin / halfCircleCount) * maxMappedFreqs);
          const finalFreqIndex = Math.min(freqIndex + 4, dataArray.length - 1);
          const magnitude = dataArray[finalFreqIndex] / 255;

          // Circle Size Reactivity
          const baseRadius = 3; 
          const reactiveRadius = magnitude * 7; 
          const circleRadius = baseRadius + reactiveRadius;

          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          // Soft blue-purple hues with gentle animation
          const baseHue = 220;
          const hueVariation = (i * 2.5) + (ring * 15) + (Date.now() * 0.008);
          const hue = (baseHue + (hueVariation % 80)) % 360;

          // Gentle, subtle shine
          ctx.shadowBlur = 10 + magnitude * 15; 
          ctx.shadowColor = `hsla(${hue}, 80%, 70%, 0.6)`; 

          ctx.beginPath();
          ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
          ctx.fillStyle = `hsl(${hue}, 70%, ${48 + magnitude * 18}%)`;
          ctx.fill();
        }
      }

      // Reset shadow for clean next frame
      ctx.shadowBlur = 0;
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [audioRef, currentSong]);

  return (
    // FIX 1: Set size to 352x352 to fill the inner space (400 - 2*24 padding)
    // FIX 2: Removed the redundant p-4 margin inside the Visualizer component
    <div className={`w-[${VISUALIZER_SIZE}px] h-[${VISUALIZER_SIZE}px] flex justify-center items-center bg-gray-800/70 rounded-3xl shadow-xl border border-gray-700/50 overflow-hidden`}>
      <canvas
        ref={canvasRef}
        width={VISUALIZER_SIZE}
        height={VISUALIZER_SIZE}
        className="rounded-3xl"
      />
    </div>
  );
}