/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Property } from '../types';
import { Send, Sparkles, MessageSquare, Compass, Shield, Building, ChevronRight } from 'lucide-react';

interface ConciergeProps {
  properties: Property[];
  triggerToast: (msg: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Concierge({ properties, triggerToast }: ConciergeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Welcome to the Obsidian Private Consultation Suite. Under strict confidentiality covenants, I am programmed to guide you through our monolithic modern layouts, raw stone pavilions, and structural brutalist landmarks. \n\nHow may I advise your acquisition strategy today?"
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMsg;
    if (!textToSend.trim()) return;

    if (!customText) setInputMsg('');
    
    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await fetch("/api/gemini/consultation-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          properties,
          messages: messages.slice(1), // Exclude greeting
          currentMessage: textToSend
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text || '' }]);
      } else {
        triggerToast(data.error || "Concierge intelligence is temporarily offline.");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Unable to communicate with full-stack concierge services.");
    } finally {
      setIsSending(false);
    }
  };

  const QUICK_PROMPTS = [
    "Summarize available brutalist modernist pavilions.",
    "Recommend a property under $6M and highlight structural concrete elements.",
    "Which registered landmarks feature dedicated biometric security locks?",
    "Plan a showing route for desert retreats in Sedona."
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="ai-concierge-suite">
      
      {/* Narrative Branding Header */}
      <div className="mb-10 text-left border-b border-neutral-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400">
            Private Advisory Portal
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-light text-white tracking-tight mt-1">
            Elite Architectural Concierge
          </h2>
          <p className="text-xs text-neutral-500 font-sans mt-2 max-w-xl leading-relaxed">
            A secure AI consultation channel trained exclusively on our available luxury real estate portfolio, architectural landmarks, and transaction parameters.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase text-[#E5D3B3] bg-[#221C14] border border-gold-500/10 px-3 py-1 rounded-sm">
            <Shield className="w-3 h-3 text-gold-400" /> Confid-Stream
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-3 py-1 rounded-sm">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Gemini Flash Active
          </span>
        </div>
      </div>

      {/* Grid: Chat Main and Details panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column - Chat Room Container */}
        <div className="lg:col-span-8 bg-[#080808] border border-neutral-900 rounded-lg flex flex-col h-[65vh] overflow-hidden">
          
          {/* Chat Stream Viewport */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-neutral-800">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 text-left ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#181510] border border-gold-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-md px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#181511] text-[#E5D3B3] border border-gold-500/10 font-mono'
                    : 'bg-neutral-950 border border-neutral-900 text-neutral-300 font-sans font-light'
                }`}>
                  {msg.content.split('\n').map((para, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {para}
                    </p>
                  ))}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[9px] text-[#E5D3B3]">
                    C
                  </div>
                )}
              </motion.div>
            ))}

            {isSending && (
              <div className="flex gap-3 text-left justify-start">
                <div className="w-8 h-8 rounded-full bg-[#181510] border border-gold-500/15 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                </div>
                <div className="bg-neutral-950 border border-neutral-900 rounded-md px-4 py-3 text-xs font-mono text-neutral-500 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-ping" />
                  <span>Synthesizing architectural specifications...</span>
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>

          {/* Quick-Picks Starter Panel */}
          {messages.length === 1 && (
            <div className="px-6 py-4 bg-neutral-950/40 border-t border-neutral-900 text-left space-y-2">
              <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block">
                Acquisition starter coordinates
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="p-2.5 bg-[#050505] hover:bg-[#120F0B] border border-neutral-900 hover:border-gold-500/15 text-[10px] text-neutral-400 hover:text-[#E5D3B3] rounded text-left transition-all block truncate"
                  >
                    ✦ {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Keyboard Row */}
          <div className="p-4 bg-neutral-950 border-t border-neutral-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Inquire about layouts, prices, materials, scheduling or legal compliance..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                disabled={isSending}
                className="flex-1 bg-[#050505] border border-neutral-800 text-xs text-neutral-300 py-2.5 px-4 rounded focus:outline-none focus:border-gold-500/30 disabled:opacity-50 font-sans placeholder-neutral-600"
              />
              <button
                type="submit"
                disabled={isSending || !inputMsg.trim()}
                className="bg-[#1C1812] hover:bg-[#2A2318] border border-gold-500/20 text-gold-400 hover:text-white px-4 py-2.5 rounded transition-all flex items-center justify-center shrink-0 disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Registered Assets Context Card */}
        <div className="lg:col-span-4 bg-[#080808] border border-neutral-900 rounded-lg p-5 sm:p-6 space-y-5 flex flex-col text-left">
          <div>
            <h4 className="font-display text-sm font-medium text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-gold-400" /> Active Directory Registry
            </h4>
            <p className="text-[11px] text-neutral-500 font-sans mt-1 leading-relaxed">
              These properties are fully indexed and formatted for real-time contextual queries by the AI Concierge.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[45vh] pr-1">
            {properties.map((p) => (
              <div key={p.id} className="p-3 bg-neutral-950 border border-neutral-900 hover:border-neutral-850 rounded flex items-center justify-between gap-3 transition-colors">
                <div className="truncate max-w-[70%]">
                  <span className="font-display text-xs text-neutral-200 block truncate leading-tight font-normal">{p.title}</span>
                  <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider block mt-0.5">
                    📍 {p.location.split(',')[0]}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-xs text-gold-400 font-semibold block">
                    ${(p.price / 1000000).toFixed(2)}M
                  </span>
                  <button
                    onClick={() => handleSendMessage(`Analyze ${p.title} at ${p.location} for structural and financial detail.`)}
                    className="font-mono text-[8px] uppercase tracking-wider text-neutral-500 hover:text-[#E5D3B3] flex items-center gap-0.5 mt-1 transition-colors ml-auto bg-transparent border-none"
                  >
                    Query <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#120F0B] border border-gold-500/10 p-3.5 rounded">
            <span className="font-mono text-[8px] text-gold-400 uppercase tracking-widest block font-semibold mb-1">
              Broker Advisory Notice
            </span>
            <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
              Adding new properties in the <strong>CRM Board</strong> automatically extends this agent's catalog and refreshes the grounding weights in real-time.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
