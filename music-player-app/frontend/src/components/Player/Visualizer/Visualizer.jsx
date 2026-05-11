import {useRef, useEffect} from "react";

export default function Visualizer({audioRef, currentSong}) {
    const canvasRef = useRef(null)
    const audioContextRef = useRef(null)
    const analyserRef = useRef(null)
    const sourceRef = useRef(null)
    const animationRef = useRef(null)

    // Размер на Canvas елемента (в пиксели)
    const SIZE = 352 

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // 1. ИНИЦИАЛИЗАЦИЯ НА AUDIO API
        if (!audioContextRef.current) {
            // Създаваме аудио контекст (мозъка на аудио обработката)
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            // Създаваме анализатор, който "слуша" честотите
            analyserRef.current = audioContextRef.current.createAnalyser();
            // fftSize определя резолюцията (колко честотни ленти ще получим)
            analyserRef.current.fftSize = 128; 

            if (!sourceRef.current) {
                // Свързваме аудио елемента (<audio>) с анализатора
                sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
                sourceRef.current.connect(analyserRef.current);
                // Свързваме анализатора с изхода (колоните), за да чуваме звука
                analyserRef.current.connect(audioContextRef.current.destination);
            }
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const analyser = analyserRef.current;
        // frequencyBinCount е половината на fftSize (в случая 64 ленти)
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const draw = () => {
            // Стартираме цикъла на анимацията (60 пъти в секунда)
            animationRef.current = requestAnimationFrame(draw)

            // Важно: Браузърите изискват "събуждане" на аудио контекста след действие на потребителя
            if (audioContextRef.current.state === "suspended") {
                audioContextRef.current.resume();
            }

            // Пълним масива с актуалните данни за силата на честотите
            analyser.getByteFrequencyData(dataArray);

            // 2. ПОЧИСТВАНЕ НА ПЛАТНОТО
            // Използваме лека прозрачност (0.4), за да оставим "опашка" от предишните кадри
            ctx.fillStyle = "rgba(17, 24, 39, 0.4)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // 3. НАСТРОЙКИ НА ВИЗУАЛИЗАЦИЯТА
            const ringCount = 4;      // Брой концентрични пръстени
            const circleCount = 22;   // Брой точки във всеки пръстен
            const minRadius = 55;     // Радиус на най-вътрешния пръстен
            const safetyMargin = 50;  // Разстояние от края на канваса

            // Изчисляваме колко място имаме за пулсиране
            const maxRadius = Math.min(centerX, centerY) - safetyMargin;
            const availableSpace = maxRadius - minRadius;
            const ringSpacing = availableSpace / (ringCount - 1);

            // 4. РИСУВАНЕ НА ПРЪСТЕНИТЕ
            for (let ring = 0; ring < ringCount; ring++) {
                
                // Изчисляваме общата сила на звука за този пръстен (бас, среди и т.н.)
                let ringMagnitude = 0;
                let ringFreqStart = ring * 4;
                for (let j = 0; j < 4; j++) {
                    ringMagnitude += dataArray[ringFreqStart + j] / 255;
                }
                // Math.pow прави движенията по-динамични (експоненциално усилване)
                ringMagnitude = Math.pow(ringMagnitude / 4, 1.4);

                // Базовият радиус се увеличава спрямо силата на музиката
                const radius = minRadius + (ring * ringSpacing) + (ringMagnitude * 25);

                for (let i = 0; i < circleCount; i++) {
                    // Изчисляваме ъгъла на всяка точка в кръга
                    const angle = (i / circleCount) * 2 * Math.PI;

                    // Огледална симетрия: лявата и дясната страна на кръга реагират еднакво
                    let freqBin = i >= circleCount / 2 ? circleCount - 1 - i : i;

                    // Намираме конкретната честота за тази точка
                    const freqIndex = Math.floor((freqBin / (circleCount / 2)) * 16);
                    const finalFreqIndex = Math.min(freqIndex + (ring * 2), dataArray.length - 1);
                    const magnitude = dataArray[finalFreqIndex] / 255; // Стойност между 0 и 1

                    // Размер на самата точка (увеличава се със силата на честотата)
                    const circleRadius = 2.2 + (magnitude * 6);
                    
                    // Полярни координати към Декартови координати (X и Y)
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);

                    // 5. ЦВЕТОВЕ И СВЕТЛИННИ ЕФЕКТИ
                    const baseHue = 230; // Лилав цвят като основа
                    // Цветовете се въртят леко спрямо времето (Date.now())
                    const hue = (baseHue + (i * 4) + (ring * 20) + (Date.now() * 0.01)) % 360;

                    // Добавяме "сияние" (bloom ефект)
                    ctx.shadowBlur = 10 + magnitude * 12;
                    ctx.shadowColor = `hsla(${hue}, 80%, 65%, 0.5)`;

                    // Рисуваме кръгчето
                    ctx.beginPath();
                    ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
                    ctx.fillStyle = `hsl(${hue}, 75%, ${50 + magnitude * 20}%)`;
                    ctx.fill();
                }
            }
            // Нулираме сянката за следващия кадър (оптимизация)
            ctx.shadowBlur = 0;
        };

        draw();

        // Почистване при демонтиране на компонента
        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [audioRef, currentSong]); // Рестартира се при нова песен

    return (
        <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            // Tailwind класове за стилизиране
            className="w-full h-full object-cover rounded-[2rem] scale-[0.97] bg-transparent"
        />
    );
}