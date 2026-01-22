import { useRef, useEffect } from "react";

export default function Visualizer({ audioRef, currentSong }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  
  const SIZE = 352;

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

      
      ctx.fillStyle = "rgba(17, 24, 39, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2; 
      const centerY = canvas.height / 2; 
      
      
      const ringCount = 4;          
      const circleCount = 22;       
      const minRadius = 55;         
      const safetyMargin = 50;      
      
      const maxRadius = Math.min(centerX, centerY) - safetyMargin; 
      const availableSpace = maxRadius - minRadius;
      const ringSpacing = availableSpace / (ringCount - 1);

      const halfCircleCount = circleCount / 2;

      for (let ring = 0; ring < ringCount; ring++) {
        let ringMagnitude = 0;
        let ringFreqStart = ring * 4;
        for (let j = 0; j < 4; j++) {
            ringMagnitude += dataArray[ringFreqStart + j] / 255;
        }
        ringMagnitude = Math.pow(ringMagnitude / 4, 1.4); 

        const radius = minRadius + (ring * ringSpacing) + (ringMagnitude * 25);

        for (let i = 0; i < circleCount; i++) {
          const angle = (i / circleCount) * 2 * Math.PI;

          let freqBin = i;
          if (freqBin >= halfCircleCount) {
            freqBin = circleCount - 1 - i;
          }

          const freqIndex = Math.floor((freqBin / halfCircleCount) * 16);
          const finalFreqIndex = Math.min(freqIndex + (ring * 2), dataArray.length - 1);
          const magnitude = dataArray[finalFreqIndex] / 255;

          const circleRadius = 2.2 + (magnitude * 6);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          const baseHue = 230; 
          const hue = (baseHue + (i * 4) + (ring * 20) + (Date.now() * 0.01)) % 360;

          ctx.shadowBlur = 10 + magnitude * 12; 
          ctx.shadowColor = `hsla(${hue}, 80%, 65%, 0.5)`; 

          ctx.beginPath();
          ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
          ctx.fillStyle = `hsl(${hue}, 75%, ${50 + magnitude * 20}%)`;
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [audioRef, currentSong]);

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}

      className="rounded-xl border border-white/5 bg-gray-900/50"
    />
  );
}