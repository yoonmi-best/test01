
import React, { useState, useRef, useCallback } from 'react';
import { generateImage, generateMeditationScript, generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio';
import { SparklesIcon } from './common/icons/SparklesIcon';
import { PlayIcon } from './common/icons/PlayIcon';
import { StopIcon } from './common/icons/StopIcon';
import Loader from './common/Loader';

interface MeditationResult {
  imageUrl: string;
  script: string;
  audioBuffer: AudioBuffer;
}

const MeditationGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MeditationResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stopAudio = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playAudio = useCallback(() => {
    if (result?.audioBuffer) {
      stopAudio(); // Stop any existing audio first
      if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const source = audioContextRef.current.createBufferSource();
      source.buffer = result.audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setIsPlaying(false);
        audioSourceRef.current = null;
      };
      source.start();
      audioSourceRef.current = source;
      setIsPlaying(true);
    }
  }, [result, stopAudio]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('명상 테마를 입력해 주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    stopAudio();

    try {
      const [imageUrl, script] = await Promise.all([
        generateImage(prompt),
        generateMeditationScript(prompt),
      ]);
      
      const audioBase64 = await generateSpeech(script);
      
      if (!audioContextRef.current) {
         audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const audioBytes = decode(audioBase64);
      const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
      
      setResult({ imageUrl, script, audioBuffer });

    } catch (err) {
      console.error(err);
      setError('명상 세션 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioToggle = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };
  
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-indigo-800/50">
      {!result && !isLoading && (
         <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">나만의 작은 휴식처</h2>
            <p className="text-indigo-300 mb-6 max-w-md">테마나 감정을 입력하면, AI가 당신만을 위한 특별한 가이드 명상 경험을 만들어 드립니다.</p>
            <div className="w-full max-w-lg relative">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예: 해 뜰 녘 고요한 숲"
                    className="w-full bg-indigo-900/50 border border-indigo-700 rounded-full py-3 pl-5 pr-32 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-300"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2 px-5 rounded-full flex items-center gap-2 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SparklesIcon />
                    생성하기
                </button>
            </div>
            {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      )}

      {isLoading && <Loader message="명상 세션을 만드는 중..." />}

      {result && !isLoading && (
        <div className="relative rounded-xl overflow-hidden min-h-[60vh] flex flex-col justify-end text-white p-6 md:p-10 bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url(${result.imageUrl})` }}>
           <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex-grow overflow-y-auto pr-4">
                    <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-serif">
                      {result.script}
                    </p>
                </div>
                <div className="mt-6 flex-shrink-0 flex flex-col sm:flex-row items-center gap-4">
                    <button onClick={handleAudioToggle} className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white">
                        {isPlaying ? <StopIcon /> : <PlayIcon />}
                    </button>
                    <button onClick={() => { stopAudio(); setResult(null); setPrompt(''); }} className="bg-indigo-600/80 text-white font-semibold py-2 px-6 rounded-full hover:bg-indigo-500/80 transition-colors duration-300">
                      새로 만들기
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MeditationGenerator;