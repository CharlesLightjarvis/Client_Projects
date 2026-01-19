import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useChat, fetchServerSentEvents } from '@tanstack/ai-react'
import { Send, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/gemini-chat')({
  component: GeminiChatDemo,
})

function GeminiChatDemo() {
  const [input, setInput] = useState('')

  // Initialize the chat client with the API endpoint
  const { messages, sendMessage, isLoading, error } = useChat({
    connection: fetchServerSentEvents('http://localhost:4000/api/chat'),
    onError: (err) => {
      console.error('❌ Error:', err)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      sendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Gemini Chat
          </span>
          <span className="text-sm font-normal text-gray-400">
            (Powered by Gemini 2.5 Flash)
          </span>
        </h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p className="text-lg">Commence une conversation avec Gemini!</p>
            <p className="text-sm mt-2">
              Pose-moi n'importe quelle question...
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700/50 backdrop-blur-sm text-white border border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase opacity-70">
                  {message.role === 'user' ? 'Toi' : 'Gemini'}
                </span>
              </div>

              {message.parts.map((part, idx) => {
                if (part.type === 'text') {
                  return (
                    <div
                      key={idx}
                      className="whitespace-pre-wrap wrap-break-word"
                    >
                      {part.content}
                    </div>
                  )
                }

                if (part.type === 'thinking') {
                  return (
                    <div
                      key={idx}
                      className="text-sm italic opacity-70 border-l-2 border-cyan-400 pl-2 mt-2"
                    >
                      💭 Réflexion: {part.content}
                    </div>
                  )
                }

                return null
              })}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini réfléchit...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="flex justify-start">
            <div className="bg-red-900/50 backdrop-blur-sm border border-red-700 rounded-lg p-4">
              <div className="text-red-200">
                <strong>Erreur:</strong> {error.message}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-700 bg-slate-800/80 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écris ton message ici..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-600 bg-slate-700/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
