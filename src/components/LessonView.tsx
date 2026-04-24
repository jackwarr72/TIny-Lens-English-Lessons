import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Lightbulb, Sparkles, ArrowLeft, Languages, MessageSquare, GraduationCap } from 'lucide-react';
import { Lesson } from '../services/gemini';

interface LessonViewProps {
  lesson: Lesson;
  imageSrc?: string;
  onReset: () => void;
}

export default function LessonView({ lesson, imageSrc, onReset }: LessonViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto flex flex-col gap-6"
    >
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors self-start"
      >
        <ArrowLeft size={20} />
        <span>Back to Camera</span>
      </button>

      {imageSrc && (
        <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-md">
          <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          {lesson.topic}
        </h1>
        <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold">
          Tiny Lesson
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Card
            icon={<BookOpen className="text-blue-500" size={24} />}
            title="What is it?"
            content={lesson.whatIsIt}
            color="bg-blue-50 border-blue-100"
          />
        </div>
        
        <Card
          icon={<Lightbulb className="text-amber-500" size={24} />}
          title="How it works / Why it matters"
          content={lesson.details}
          color="bg-amber-50 border-amber-100"
        />
        
        <Card
          icon={<Sparkles className="text-purple-500" size={24} />}
          title="Fun Fact"
          content={lesson.funFact}
          color="bg-purple-50 border-purple-100"
        />

        <ListCard
          icon={<Languages className="text-rose-500" size={24} />}
          title="Vocabulary"
          items={lesson.vocabulary?.map(v => ({ title: v.word, desc: v.definition })) || []}
          color="bg-rose-50 border-rose-100"
        />

        <ListCard
          icon={<MessageSquare className="text-indigo-500" size={24} />}
          title="Useful Phrases"
          items={lesson.phrases?.map(p => ({ title: p.phrase, desc: p.usage })) || []}
          color="bg-indigo-50 border-indigo-100"
        />

        <div className="md:col-span-2">
          <Card
            icon={<GraduationCap className="text-emerald-500" size={24} />}
            title="Grammar Tip"
            content={lesson.grammarTip}
            color="bg-emerald-50 border-emerald-100"
          />
        </div>
      </div>
    </motion.div>
  );
}

function Card({ icon, title, content, color }: { icon: React.ReactNode, title: string, content: string, color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-6 rounded-2xl border ${color} shadow-sm h-full`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <p className="text-gray-700 leading-relaxed">
        {content}
      </p>
    </motion.div>
  );
}

function ListCard({ icon, title, items, color }: { icon: React.ReactNode, title: string, items: { title: string, desc: string }[], color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-6 rounded-2xl border ${color} shadow-sm h-full`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex flex-col">
            <span className="font-semibold text-gray-900">{item.title}</span>
            <span className="text-gray-700 text-sm">{item.desc}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
