import { useRef, useEffect } from "react";

export default function Visualizer({ audioRef, currentSong }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // --- Create AudioContext & Analyser if not already ---
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 32; // small FFT for smooth pulsing

      // Only create the source once
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    }

    // --- Animation loop ---
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      // Resume AudioContext if suspended (browsers require user interaction)
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      let radius = 30; // default idle radius
      let color = "rgba(100,150,255,0.3)";

      if (currentSong && !audio.paused) {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        radius = 30 + (average / 255) * 70;
        color = `hsl(${Math.round(radius * 2)}, 100%, 60%)`;
      }

      // Clear canvas and draw circle
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    };

    draw();

    return () => cancelAnimationFrame(animationRef.current);
  }, [audioRef, currentSong]);

  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-800/70 rounded-3xl p-4 shadow-xl border border-gray-700/50">
      <canvas ref={canvasRef} width={200} height={200} className="rounded-full shadow-lg" />
    </div>
  );
}
