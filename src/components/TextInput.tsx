import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface TextInputProps {
  onSubmit: (topic: string) => void;
}

export default function TextInput({ onSubmit }: TextInputProps) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto relative">
      <div className="relative flex items-center w-full h-14 rounded-full bg-white shadow-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
        <div className="pl-5 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Type a topic (e.g., Black Holes)"
          className="w-full h-full px-4 text-gray-800 bg-transparent outline-none placeholder-gray-400 font-medium"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!topic.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ArrowRight size={20} />
        </motion.button>
      </div>
    </form>
  );
}
