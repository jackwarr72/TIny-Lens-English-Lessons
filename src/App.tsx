import React, { useState } from 'react';
import { Camera, Type as TypeIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CameraView from './components/CameraView';
import LessonView from './components/LessonView';
import TextInput from './components/TextInput';
import { generateLesson, Lesson } from './services/gemini';

export default function App() {
  const [mode, setMode] = useState<'camera' | 'text'>('camera');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (base64Image: string) => {
    setImageSrc(base64Image);
    setIsLoading(true);
    setError(null);
    try {
      const generatedLesson = await generateLesson(base64Image);
      setLesson(generatedLesson);
    } catch (err) {
      console.error(err);
      setError("Failed to generate lesson. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async (topic: string) => {
    setImageSrc(undefined);
    setIsLoading(true);
    setError(null);
    try {
      const generatedLesson = await generateLesson(undefined, topic);
      setLesson(generatedLesson);
    } catch (err) {
      console.error(err);
      setError("Failed to generate lesson. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setLesson(null);
    setImageSrc(undefined);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-200">
      <header className="w-full max-w-4xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Camera className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
            Tiny Lens Lesson
          </h1>
        </div>
        
        {!lesson && !isLoading && (
          <div className="flex bg-neutral-200 rounded-full p-1 shadow-inner">
            <button
              onClick={() => setMode('camera')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === 'camera' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Camera size={16} />
              <span className="hidden sm:inline">Camera</span>
            </button>
            <button
              onClick={() => setMode('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === 'text' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <TypeIcon size={16} />
              <span className="hidden sm:inline">Text</span>
            </button>
          </div>
        )}
      </header>

      <main className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="text-lg font-medium text-neutral-600 animate-pulse">
                Analyzing and generating lesson...
              </p>
            </motion.div>
          ) : lesson ? (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <LessonView lesson={lesson} imageSrc={imageSrc} onReset={handleReset} />
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl flex flex-col items-center gap-8"
            >
              {error && (
                <div className="w-full p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-center">
                  {error}
                </div>
              )}

              {mode === 'camera' ? (
                <div className="w-full aspect-[3/4] sm:aspect-video relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 ring-4 ring-white/10">
                  <CameraView onCapture={handleCapture} />
                </div>
              ) : (
                <div className="w-full py-20 flex flex-col items-center justify-center gap-6">
                  <div className="text-center space-y-2 mb-4">
                    <h2 className="text-3xl font-bold text-neutral-800">What do you want to learn about?</h2>
                    <p className="text-neutral-500">Type any topic to get a bite-sized lesson.</p>
                  </div>
                  <TextInput onSubmit={handleTextSubmit} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
