import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowRight, 
  History, 
  ChevronRight, 
  X, 
  Sparkles, 
  Moon, 
  HelpCircle,
  HelpCircle as InfoIcon
} from "lucide-react";
import { questions, Question } from "./questions";

// LocalStorage Keys
const KEYS = {
  SHUFFLED_QUESTIONS: "friends_shuffled_questions_v1",
  CURRENT_INDEX: "friends_current_index_v1",
  IS_MUTED: "friends_is_muted_v1"
};

export default function App() {
  // Game state
  const [shuffledList, setShuffledList] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Animation/Interaction state
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isDiscarding, setIsDiscarding] = useState<boolean>(false);
  const [isTrashBouncing, setIsTrashBouncing] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Sound Synthesizer via Web Audio API
  const playSound = (type: "flip" | "click" | "trash") => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === "flip") {
        const duration = 0.5;
        // Low pitch triangle sweep (card paper whoosh)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);

        // Add physical paper whisper background noise
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + duration);
        filter.Q.setValueAtTime(3.0, ctx.currentTime);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.015, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        noiseNode.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseNode.start();
        noiseNode.stop(ctx.currentTime + duration);

      } else if (type === "click") {
        // High, warm tactile tick
        const duration = 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(750, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);

      } else if (type === "trash") {
        // Wooden bounce rattling (two small pulses)
        [0.0, 0.07].forEach((delay, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(150 - (index * 25), ctx.currentTime + delay);
          osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + delay + 0.15);

          gain.gain.setValueAtTime(index === 0 ? 0.06 : 0.03, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.15);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.15);
        });
      }
    } catch (e) {
      console.warn("Web Audio API not supported or suspended:", e);
    }
  };

  // Fisher-Yates shuffle
  const generateShuffledList = () => {
    const list = [...questions];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  // Sound toggling
  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    localStorage.setItem(KEYS.IS_MUTED, JSON.stringify(nextState));
    if (!nextState) {
      setTimeout(() => playSound("click"), 50);
    }
  };

  // Initialize and load saved state
  useEffect(() => {
    const savedShuffled = localStorage.getItem(KEYS.SHUFFLED_QUESTIONS);
    const savedIndex = localStorage.getItem(KEYS.CURRENT_INDEX);
    const savedMuted = localStorage.getItem(KEYS.IS_MUTED);

    if (savedMuted !== null) {
      setIsMuted(JSON.parse(savedMuted));
    }

    if (savedShuffled && savedIndex !== null) {
      try {
        setShuffledList(JSON.parse(savedShuffled));
        setCurrentIndex(Number(savedIndex));
      } catch (err) {
        // Fallback if corrupted
        const fresh = generateShuffledList();
        setShuffledList(fresh);
        setCurrentIndex(0);
        localStorage.setItem(KEYS.SHUFFLED_QUESTIONS, JSON.stringify(fresh));
        localStorage.setItem(KEYS.CURRENT_INDEX, "0");
      }
    } else {
      const fresh = generateShuffledList();
      setShuffledList(fresh);
      setCurrentIndex(0);
      localStorage.setItem(KEYS.SHUFFLED_QUESTIONS, JSON.stringify(fresh));
      localStorage.setItem(KEYS.CURRENT_INDEX, "0");
    }
  }, []);

  // Update current index and sync with localStorage
  const saveGameState = (index: number, list: Question[]) => {
    setCurrentIndex(index);
    localStorage.setItem(KEYS.CURRENT_INDEX, String(index));
    localStorage.setItem(KEYS.SHUFFLED_QUESTIONS, JSON.stringify(list));
  };

  const handlePlayAgain = () => {
    playSound("click");
    const fresh = generateShuffledList();
    setShuffledList(fresh);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsDiscarding(false);
    setIsTrashBouncing(false);
    setTypedText("");
    localStorage.setItem(KEYS.SHUFFLED_QUESTIONS, JSON.stringify(fresh));
    localStorage.setItem(KEYS.CURRENT_INDEX, "0");
  };

  // Get current active question
  const currentQuestion = shuffledList[currentIndex] || null;

  // Question Text Typing Effect
  useEffect(() => {
    if (!currentQuestion || !isFlipped || isDiscarding) {
      setTypedText("");
      return;
    }

    let isSubscribed = true;
    const fullText = currentQuestion.text;
    let index = 0;
    setTypedText("");

    const interval = setInterval(() => {
      if (!isSubscribed) return;
      if (index < fullText.length) {
        // Add 1 or 2 characters at once for smooth reading flow but preserving human typewriter charm
        const charsToAdd = fullText.slice(index, index + 1);
        setTypedText(prev => prev + charsToAdd);
        index += 1;
      } else {
        clearInterval(interval);
      }
    }, 20); // Fast but premium feel

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [currentIndex, isFlipped, isDiscarding]);

  // Click during typing to instantly show whole Vietnamese question
  const skipTyping = () => {
    if (!currentQuestion) return;
    if (typedText.length < currentQuestion.text.length) {
      setTypedText(currentQuestion.text);
      playSound("click");
    }
  };

  // Handlers for interaction
  const handleFlip = () => {
    if (isDiscarding || isFlipped) return;
    playSound("flip");
    setIsFlipped(true);
  };

  const handleNextCard = () => {
    if (!isFlipped || isDiscarding) return;
    playSound("click");
    setIsDiscarding(true);

    // Timeline synced discard
    // Card flies to trash bin, shrinks and vanishes
    // Trash bin wiggles exactly at 450ms, playing sound
    setTimeout(() => {
      setIsTrashBouncing(true);
      playSound("trash");
    }, 450);

    // Proceed to next question at 700ms
    setTimeout(() => {
      const nextIdx = currentIndex + 1;
      saveGameState(nextIdx, shuffledList);
      setIsFlipped(false);
      setIsDiscarding(false);
      setIsTrashBouncing(false);
      setTypedText("");
    }, 700);
  };

  // Calculate stats
  const totalQuestionsCount = 100;
  const exploredCount = Math.min(currentIndex, totalQuestionsCount);
  const remainingCount = Math.max(0, totalQuestionsCount - exploredCount);
  const isLastQuestionReached = currentIndex === 99; // 100th card has index 99
  const isGameOver = currentIndex >= totalQuestionsCount;

  // Filter completed questions list for the History Drawer (latest completed on top)
  const completedQuestions = shuffledList.slice(0, exploredCount).reverse();

  return (
    <div 
      id="friends-root-app" 
      className={`min-h-screen w-full bg-white text-gray-900 font-sans relative flex flex-col justify-between select-none transition-colors duration-1000 ${
        isLastQuestionReached && isFlipped && !isGameOver ? "bg-stone-50" : "bg-white"
      }`}
    >
      {/* Background Dimming for Card 100 overlay */}
      {isLastQuestionReached && isFlipped && !isGameOver && (
        <div id="dim-overlay" className="absolute inset-0 bg-black/[0.04] pointer-events-none transition-opacity duration-1000" />
      )}

      {/* Decorative Moon Grid lines for cozy twilight coffee house aesthetic */}
      <div id="aesthetic-grid" className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="0" x2="10%" y2="100%" stroke="currentColor" strokeWidth="1" />
          <line x1="90%" y1="0" x2="90%" y2="100%" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="15%" x2="100%" y2="15%" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="85%" x2="100%" y2="85%" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* ----------------- HEADER ----------------- */}
      <header id="app-header" className="w-full max-w-7xl mx-auto px-8 pt-8 pb-4 flex justify-between items-start z-10 relative">
        <div className="flex flex-col space-y-2">
          {/* Audio toggle & Help controls */}
          <div className="flex items-center space-x-3">
            <button
              id="btn-sound-toggle"
              onClick={toggleMute}
              className="p-2 rounded-full border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-gray-500 cursor-pointer flex items-center justify-center"
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-gray-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
              )}
            </button>
            
            <button
              id="btn-info-toggle"
              onClick={() => { playSound("click"); setShowInfo(!showInfo); }}
              className="p-2 rounded-full border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-gray-500 cursor-pointer flex items-center justify-center"
              title="Hướng dẫn chơi"
            >
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Logo Text centered */}
        <div id="logo-block" className="absolute left-1/2 -translate-x-1/2 text-center flex flex-col items-center">
          <h1 id="brand-title" className="font-display font-bold text-3xl tracking-[0.15em] text-gray-900 pb-1 flex items-center justify-center space-x-2">
            <span>FRIENDS</span>
            <span className="text-2xl text-yellow-400 drop-shadow-sm filter animate-pulse">🌙</span>
          </h1>
          <p id="sub-taglines" className="font-display text-[10px] text-gray-400 tracking-[0.25em] uppercase text-center space-y-0.5 max-sm:hidden">
            <span className="block opacity-90">100 questions. 100 thoughts.</span>
            <span className="block opacity-50 text-[9px] font-sans italic tracking-wider">Countless memories.</span>
          </p>
        </div>

        {/* PROGRESS BLOCK (Top Right) */}
        <div id="progress-indicator" className="text-right flex flex-col justify-end items-end w-64 max-sm:w-36">
          <div className="flex items-center space-x-2 text-xs font-display tracking-widest text-gray-500 uppercase pb-1.5">
            <span className="font-bold text-blue-600 font-sans transition-all">{exploredCount}</span>
            <span className="opacity-40">/</span>
            <span>100 Questions Explored</span>
          </div>
          {/* Small sleek progress bar */}
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden relative">
            <motion.div 
              id="progress-bar-fill"
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(exploredCount / totalQuestionsCount) * 100}%` }}
              transition={{ ease: "easeInOut", duration: 0.8 }}
            />
          </div>
        </div>
      </header>

      {/* ----------------- MAIN AREA ----------------- */}
      <main id="game-playground" className="flex-1 w-full flex flex-col items-center justify-center px-4 relative max-h-[70vh] my-auto">
        
        {/* Playback Instruction Popover if checked */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              id="info-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 z-40 flex items-center justify-center p-6"
            >
              <div id="info-modal-content" className="max-w-md w-full border border-gray-100 p-8 rounded-[24px] bg-white shadow-xl relative">
                <button 
                  id="btn-close-info"
                  onClick={() => { playSound("click"); setShowInfo(false); }}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold font-display">
                    🌙
                  </div>
                  <h3 className="font-display font-semibold text-lg text-gray-900">Cách chơi FRIENDS</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Trò chơi lật bài deeptalk được thiết kế để <strong className="font-semibold text-gray-700">3 người bạn</strong> ngồi cạnh nhau cùng chia sẻ chân thật.
                  </p>
                  <div className="w-full space-y-3 pt-2 text-left text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">1</div>
                      <span>Ngồi quây quần, đặt máy ở giữa làm tâm điểm bàn nước.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">2</div>
                      <span>Lần lượt từng người nhấn chạm để <strong className="font-semibold">Lật bài</strong> phát câu hỏi.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">3</div>
                      <span>Dành thời gian chia sẻ câu trả lời thật tâm. Sau đó bấm <strong className="font-semibold text-blue-600">Next Card</strong> để chuyển lượt.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">✨</div>
                      <span>Một số lá bài mang thuộc tính tương tác nhóm sẽ đính nhãn màu vàng đặc biệt để kêu gọi đối thoại.</span>
                    </div>
                  </div>
                  <button
                    id="btn-info-got-it"
                    onClick={() => { playSound("click"); setShowInfo(false); }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-display text-sm font-medium tracking-wide transition-all shadow-md hover:shadow-lg mt-6 cursor-pointer"
                  >
                    Bắt đầu thôi
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isGameOver ? (
            /* ----------------- END SCREEN ----------------- */
            <motion.div
              key="endscreen"
              id="ending-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-8 p-12 relative z-10"
            >
              <div className="relative">
                <motion.div 
                  className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-4xl shadow-inner relative z-10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  🌙
                </motion.div>
                <div className="absolute inset-0 bg-blue-100 rounded-full filter blur-xl opacity-40 scale-125 z-0" />
              </div>

              <div className="space-y-4">
                <h2 className="font-display font-bold text-4xl text-gray-900 tracking-wide">
                  The Night Is Over 🌙
                </h2>
                <div className="h-0.5 w-16 bg-blue-100 mx-auto rounded-full" />
                <p className="font-serif italic text-2xl text-gray-500 max-w-lg leading-relaxed pt-2">
                  "100 questions. 100 thoughts. Countless memories."
                </p>
                <p className="text-gray-400 font-sans tracking-widest uppercase text-xs pt-4">
                  Thank you, friends.
                </p>
              </div>

              <button
                id="btn-replay"
                onClick={handlePlayAgain}
                className="mt-6 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-display text-sm font-semibold tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center space-x-3 cursor-pointer group"
              >
                <RotateCcw className="w-4 h-4 text-blue-100 group-hover:rotate-180 transition-transform duration-700" />
                <span>Play Again</span>
              </button>
            </motion.div>
          ) : (
            /* ----------------- GAME SCREEN ----------------- */
            <div key="gamescreen" className="flex flex-col items-center justify-center relative w-full h-full max-sm:px-0">
              
              {/* Alert 10 Questions Left Indicator */}
              {remainingCount <= 10 && remainingCount > 0 && (
                <motion.div
                  id="ten-cards-left-notice"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="absolute -top-14 flex flex-col items-center text-center space-y-1 pointer-events-none z-20"
                >
                  <div className="flex items-center space-x-2 px-4 py-1.5 bg-yellow-50/90 border border-yellow-200/50 backdrop-blur-sm rounded-full shadow-sm text-yellow-600">
                    <span className="text-xs">🌙</span>
                    <span className="font-display font-medium text-[11px] tracking-wider uppercase">
                      The night is getting deeper...
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 italic">
                    Only {remainingCount} {remainingCount === 1 ? "card" : "cards"} left.
                  </span>
                </motion.div>
              )}

              {/* CARD ELEMENT STAGE WITH 3D PERSPECTIVE */}
              <div 
                id="tarot-card-stage"
                className="perspective-1000 flex items-center justify-center py-2 relative"
                style={{ perspective: "1500px" }}
              >
                {/* 3D Container animate discard or flip */}
                <motion.div
                  id="tarot-card-body-wrapper"
                  className="relative cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                  // Slower animation if on the last 100th final card
                  animate={{
                    rotateY: isFlipped ? 180 : 0,
                    // Discard fly path: slide right, drop down, rotate 25 degrees, shrink to 0
                    x: isDiscarding ? 500 : 0,
                    y: isDiscarding ? 400 : 0,
                    scale: isDiscarding ? 0 : 1,
                    rotate: isDiscarding ? 30 : 0,
                    opacity: isDiscarding ? 0 : 1,
                  }}
                  whileHover={!isFlipped && !isDiscarding ? { 
                    y: -12,
                    scale: 1.025,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : {}}
                  transition={{ 
                    rotateY: { 
                      duration: isLastQuestionReached ? 1.5 : 0.8, 
                      ease: "easeInOut" 
                    },
                    // Discard ease path is quick slide-away curve
                    default: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
                  }}
                  onClick={!isFlipped ? handleFlip : undefined}
                >
                  
                  {/* FRONT SIDE of Tarot Cover (displaying as unopened card) */}
                  <div 
                    id="card-face-cover"
                    className="w-[390px] h-[570px] max-sm:w-[330px] max-sm:h-[480px] rounded-[30px] overflow-hidden relative border-4 border-slate-900/10 flex flex-col justify-between p-8 card-ambient-shadow select-none bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 bg-cover text-white"
                    style={{ 
                      backfaceVisibility: "hidden", 
                      WebkitBackfaceVisibility: "hidden" 
                    }}
                  >
                    {/* Golden celestial border trim */}
                    <div className="absolute inset-3 border border-white/20 rounded-[22px] pointer-events-none flex flex-col justify-between p-4 mix-blend-overlay">
                      <span className="text-[9px] tracking-[0.2em] font-display uppercase font-light text-center w-full block">🌙 CELESTIAL FRIENDS 🌙</span>
                      <div className="flex justify-between w-full text-[9px] font-display font-light opacity-60">
                        <span>EST. 2026</span>
                        <span>TAROT DEEP</span>
                      </div>
                    </div>

                    {/* Celestial abstract starry background */}
                    <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        {/* Shimmering astronomical map circles */}
                        <circle cx="50%" cy="50%" r="130" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" fill="none" strokeDasharray="4 2" />
                        <circle cx="50%" cy="50%" r="100" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" fill="none" />
                        <circle cx="50%" cy="50%" r="70" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
                        <circle cx="50%" cy="50%" r="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="1 3" fill="none" />
                        
                        {/* Constellation line rays */}
                        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                        <line x1="15%" y1="15%" x2="85%" y2="85%" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                        <line x1="15%" y1="85%" x2="85%" y2="15%" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                        {/* Scattered star nodes */}
                        <circle cx="20%" cy="30%" r="1.5" fill="white" className="animate-pulse" />
                        <circle cx="80%" cy="25%" r="1" fill="white" className="opacity-70" />
                        <circle cx="75%" cy="70%" r="1.5" fill="white" className="animate-pulse" />
                        <circle cx="25%" cy="80%" r="2" fill="white" className="opacity-90" />
                        <circle cx="48%" cy="18%" r="1.5" fill="white" />
                        <circle cx="52%" cy="82%" r="1" fill="white" />
                      </svg>
                    </div>

                    {/* Star group 1 */}
                    <div className="flex justify-between items-center text-xs tracking-widest text-[#FACC15]/80 font-display z-10 pt-4">
                      <span>N° {String(currentIndex + 1).padStart(3, "0")}</span>
                      <span>✦ ✦ ✦</span>
                    </div>

                    {/* Central Iconography Core */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 z-10 py-10">
                      {/* Geometric Crescent Moon container */}
                      <div className="relative w-36 h-36 max-sm:w-28 max-sm:h-28 rounded-full border border-white/10 flex items-center justify-center bg-blue-950/20 backdrop-blur-xs">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0"
                        >
                          <svg className="w-full h-full p-2" viewBox="0 0 100 100">
                            <circle cx="50" cy="10" r="1.5" fill="white" />
                            <circle cx="90" cy="50" r="1.5" fill="white" />
                            <circle cx="50" cy="90" r="1.5" fill="white" />
                            <circle cx="10" cy="50" r="1.5" fill="white" />
                          </svg>
                        </motion.div>
                        <Moon className="w-14 h-14 max-sm:w-10 max-sm:h-10 text-yellow-300 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] transform -rotate-[15deg]" />
                      </div>

                      <div className="space-y-1">
                        <h2 className="font-display font-medium text-2xl tracking-[0.25em] text-white">
                          FRIENDS
                        </h2>
                        <div className="text-[10px] tracking-[0.4em] uppercase font-light text-blue-200">
                          DEEP TALK GAME
                        </div>
                      </div>
                    </div>

                    {/* Bottom pulse tap instruction */}
                    <div className="text-center z-10 pb-4">
                      <motion.div 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-xs uppercase tracking-[0.3em] font-display text-yellow-300/90 font-medium"
                      >
                        Tap to Open
                      </motion.div>
                    </div>
                  </div>

                  {/* BACK SIDE of Tarot Cover (the Question face appearing after 180 flip) */}
                  <div 
                    id="card-face-question"
                    className="w-[390px] h-[570px] max-sm:w-[330px] max-sm:h-[480px] rounded-[30px] overflow-hidden absolute inset-0 border border-gray-150/80 bg-white flex flex-col justify-between p-8 shadow-2xl select-none"
                    style={{ 
                      transform: "rotateY(180deg)", 
                      backfaceVisibility: "hidden", 
                      WebkitBackfaceVisibility: "hidden" 
                    }}
                    onClick={skipTyping}
                  >
                    {/* Soft light gray inner card border frame */}
                    <div className="absolute inset-4 border border-gray-100 rounded-[22px] pointer-events-none" />

                    {/* Top Section Layout */}
                    <div className="w-full pt-4 px-2 flex flex-col items-center z-10 text-center">
                      <span className="font-display text-[10px] tracking-[0.25em] text-gray-400 uppercase font-medium">
                        Question {currentIndex + 1} / {totalQuestionsCount}
                      </span>
                      <div className="w-8 h-[1px] bg-red-100/30 my-2" />
                    </div>

                    {/* Central Question Display Zone with extensive breath space */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center px-4 relative z-10 my-4">
                      <AnimatePresence mode="wait">
                        {currentQuestion && (
                          <div className="flex flex-col items-center w-full space-y-5">
                            {/* Special Look at friends Yellow Badge */}
                            {currentQuestion.type === "friends" && (
                              <motion.div 
                                id="friends-badge"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-400 text-gray-900 rounded-full shadow-md text-[10px] font-display font-medium uppercase tracking-widest select-none z-10 animate-bounce"
                              >
                                <Sparkles className="w-3 h-3 animate-spin text-gray-900" style={{ animationDuration: "6s" }} />
                                <span>Look at your friends and answer</span>
                              </motion.div>
                            )}

                            {/* Final Card 100 Title Warning */}
                            {isLastQuestionReached && (
                              <motion.div 
                                id="final-card-badge"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-stone-900 text-stone-100 rounded-full text-[10px] font-display font-medium uppercase tracking-widest select-none"
                              >
                                <span>THE FINAL CARD</span>
                              </motion.div>
                            )}

                            {/* Question Body */}
                            <div className="relative w-full py-2">
                              {/* Glowing backdrop quotation mark */}
                              <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[90px] font-serif font-black text-gray-50 opacity-[0.4] select-none pointer-events-none">
                                “
                              </span>
                              
                              <p className="font-serif text-2xl max-sm:text-xl text-gray-800 leading-relaxed tracking-wide font-medium relative z-10 px-1 pt-4 text-center">
                                {typedText}
                                {typedText.length < currentQuestion.text.length && (
                                  <span className="typing-cursor ml-0.5 inline-block w-1.5 h-5 bg-gray-400" />
                                )}
                              </p>
                            </div>

                            {/* Extra custom prompt text for 100th final card */}
                            {isLastQuestionReached && typedText.length >= currentQuestion.text.length && (
                              <motion.p 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="text-sm font-serif italic text-rose-500 font-medium pt-2 animate-pulse"
                              >
                                Say something you have never said before.
                              </motion.p>
                            )}
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom Muted prompt footer */}
                    <div className="w-full pb-4 text-center z-10 font-sans">
                      <span className="text-[10px] italic tracking-wider text-gray-400 uppercase font-light">
                        Take your time and answer honestly.
                      </span>
                    </div>

                  </div>

                </motion.div>
              </div>

              {/* ACTION MENU: NEXT CARD CONTROL */}
              <div id="btn-actions-block" className="h-20 flex justify-center items-center mt-6 w-full relative z-20">
                <AnimatePresence>
                  {isFlipped && !isDiscarding && (
                    <motion.button
                      id="btn-next-card"
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 220, damping: 20 }}
                      onClick={handleNextCard}
                      className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-display text-sm font-semibold tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center space-x-3 cursor-pointer group"
                    >
                      <span>Next Card</span>
                      <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
                </AnimatePresence>
                
                {/* Visual tap reminder if card not flipped yet */}
                <AnimatePresence>
                  {!isFlipped && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-center text-gray-400 tracking-widest uppercase font-display"
                    >
                      Chạm vào lá bài để mở lời sâu kín 🌙
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

            </div>
          )}
        </AnimatePresence>

      </main>

      {/* ----------------- CORE FOOTER & TRASH BIN ----------------- */}
      <footer id="app-footer" className="w-full max-w-7xl mx-auto px-8 pb-8 pt-4 flex justify-between items-end relative z-10">
        
        {/* Playback instruction helper tags */}
        <div id="quick-author" className="text-xs text-gray-300 font-display uppercase tracking-widest">
          <span>FRIENDS 🌙 CELESTIAL EDITION</span>
        </div>

        {/* BRIGHT AND TACTILE MEMORIES BIN (Bottom Right) */}
        <div className="relative">
          <motion.div
            id="memories-rattle-can"
            onClick={() => { playSound("click"); setIsSidebarOpen(true); }}
            className="flex items-center space-x-3 bg-white border border-gray-150 hover:border-blue-200 p-3.5 rounded-[22px] shadow-sm hover:shadow-md cursor-pointer transition-all hover:bg-gray-50/50 group select-none"
            animate={isTrashBouncing ? {
              scale: [1, 1.2, 0.9, 1.1, 1],
              rotate: [0, -10, 10, -5, 5, 0],
            } : {}}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            title="Xem nhật ký lưu niệm các câu đã mở"
          >
            {/* Soft decorative ping if questions are available */}
            {exploredCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-600"></span>
              </span>
            )}

            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg shadow-inner group-hover:bg-blue-50 transition-colors">
              🗑️
            </div>
            
            <div className="flex flex-col text-left font-display">
              <span className="font-medium text-xs text-gray-800 tracking-wider group-hover:text-blue-600 transition-colors flex items-center space-x-1">
                <span>Memories Archive</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span id="memories-counter" className="text-[10px] text-gray-400 tracking-widest uppercase">
                {exploredCount} / 100 Ans
              </span>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* ----------------- MEMORIES HISTORY DRAWER SIDEBAR ----------------- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Sidebar backdrop blur */}
            <motion.div
              id="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { playSound("click"); setIsSidebarOpen(false); }}
              className="fixed inset-0 bg-black/10 backdrop-blur-xs z-40 transition-opacity"
            />

            {/* Slide-out drawer container */}
            <motion.div
              id="memories-sidebar-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-[450px] max-w-full bg-white z-50 shadow-2xl flex flex-col pointer-events-auto border-l border-gray-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🗑️</span>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 tracking-wide text-base">
                      Memories Archive
                    </h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      {exploredCount} / {totalQuestionsCount} questions revealed
                    </p>
                  </div>
                </div>

                <button
                  id="btn-close-sidebar"
                  onClick={() => { playSound("click"); setIsSidebarOpen(false); }}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Question list scroll container */}
              <div id="sidebar-scrolllist" className="flex-1 overflow-y-auto p-6 space-y-4">
                {completedQuestions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <span className="text-3xl text-gray-200">🎴</span>
                    <p className="font-serif italic text-base text-gray-400">
                      "Chưa có lá bài nào được mở."
                    </p>
                    <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                      Lật mở các lá bài và lướt qua để cất giấu kỷ niệm của bạn ở đây.
                    </p>
                  </div>
                ) : (
                  completedQuestions.map((q, idx) => {
                    // Find actual chronological order of completion
                    const originalIdx = shuffledList.findIndex(item => item.id === q.id);
                    return (
                      <motion.div
                        key={`memory-${q.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border border-gray-100 rounded-2xl bg-white hover:border-blue-100 hover:shadow-xs transition-all relative group"
                      >
                        <div className="flex justify-between items-start pb-2">
                          <span className="font-display font-medium text-[10px] text-gray-400 tracking-wider">
                            MEMORY CARD N° {String(originalIdx + 1).padStart(3, "0")}
                          </span>
                          
                          {q.type === "friends" ? (
                            <span className="text-[9px] font-display font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                              Friends Interact
                            </span>
                          ) : (
                            <span className="text-[9px] font-display uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                              Normal
                            </span>
                          )}
                        </div>

                        <p className="font-serif text-[15px] text-gray-700 leading-relaxed font-medium">
                          “{q.text}”
                        </p>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Clear progress footer toggle inside sidebar for advanced users */}
              {exploredCount > 0 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-display">
                    Danger Zone
                  </span>
                  <button
                    id="btn-sidebar-reset"
                    onClick={() => {
                      if (confirm("Mày có chắc muốn xoá toàn bộ tiến trình và xáo trộn lại từ đầu không?")) {
                        handlePlayAgain();
                        setIsSidebarOpen(false);
                      }
                    }}
                    className="text-xs bg-red-50 text-red-600 hover:bg-red-100/80 transition-all font-display tracking-wider py-1.5 px-3 rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Hành Trình</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
