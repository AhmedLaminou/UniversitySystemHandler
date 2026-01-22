import React, { useState } from 'react';
import { api } from '../../lib/api';

interface CourseAiPanelProps {
  courseId: string;
  courseTitle: string;
}

const CourseAiPanel: React.FC<CourseAiPanelProps> = ({ courseId, courseTitle }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'quiz'>('chat');

  const handleAsk = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await api.ai.courseChat(courseId, query);
      setResponse(res);
    } catch (err) {
      setResponse("Failed to get answer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await api.ai.generateQuiz(courseId);
      setResponse(res);
    } catch (err) {
      setResponse("Failed to generate quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Course Assistant</h3>
          <p className="text-xs text-gray-500">AI-powered study buddy for {courseTitle}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setMode('chat')}
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition ${
            mode === 'chat' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Chat with Content
        </button>
        <button
          onClick={() => setMode('quiz')}
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition ${
            mode === 'quiz' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Generate Quiz
        </button>
      </div>

      {mode === 'chat' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ask a question about the course</label>
            <textarea
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3 border"
              rows={3}
              placeholder="e.g., Explain the concept of SOA..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleAsk}
            disabled={isLoading || !query.trim()}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Thinking...' : 'Get Answer'}
          </button>
        </div>
      )}

      {mode === 'quiz' && (
        <div className="space-y-4 text-center py-4">
          <p className="text-sm text-gray-600">Test your knowledge! I will generate 5 multiple-choice questions based on the course material.</p>
          <button
            onClick={handleGenerateQuiz}
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Generating Quiz...' : 'Start Quiz'}
          </button>
        </div>
      )}

      {/* Response Area */}
      {response && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-800 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
          <div className="font-semibold text-gray-400 text-xs uppercase mb-2">AI Response</div>
          {response}
        </div>
      )}
    </div>
  );
};

export default CourseAiPanel;
