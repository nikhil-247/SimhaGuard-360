import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X, Bot, User, Lightbulb, ShieldCheck } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const AIAssistant: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => {
  const { crowdZones, alerts, rfidDevices, stats } = useSupabaseData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        type: 'assistant',
        timestamp: new Date(),
        content: 'Safety Playbook Assistant is connected to the current Supabase operational snapshot. Ask about crowd load, active incidents, response time, RFID distress, or the available operator playbooks.',
        suggestions: ['Show current crowd load', 'Summarize active incidents', 'Check RFID distress', 'Show response time']
      }]);
    }
  }, [messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const respond = (question: string): { content: string; suggestions: string[] } => {
    const q = question.toLowerCase();

    if (q.includes('crowd') || q.includes('density') || q.includes('capacity')) {
      const ranked = crowdZones
        .map(z => ({
          ...z,
          occupancy: z.maxCapacity > 0 ? (z.currentCapacity / z.maxCapacity) * 100 : 0
        }))
        .sort((a, b) => b.occupancy - a.occupancy)
        .slice(0, 5);

      return {
        content: ranked.length
          ? 'Current crowd snapshot:\n\n' +
            ranked.map(z => '• ' + z.name + ': ' + z.occupancy.toFixed(0) + '% (' + z.currentCapacity.toLocaleString() + ' / ' + z.maxCapacity.toLocaleString() + ')').join('\n') +
            '\n\nThese are live database values. Verify stale telemetry before operational action.'
          : 'No crowd-zone records are currently available.',
        suggestions: ['Summarize active incidents', 'Check stale telemetry']
      };
    }

    if (q.includes('incident') || q.includes('alert') || q.includes('emergency')) {
      const active = alerts.filter(a => a.isActive);
      const critical = active.filter(a => a.severity === 'critical').length;
      const high = active.filter(a => a.severity === 'high').length;

      return {
        content:
          'Active incident load: ' + active.length + '. Critical: ' + critical + '. High: ' + high + '.\n\n' +
          (active.length
            ? active.slice(0, 6).map(a => '• ' + a.severity.toUpperCase() + ' — ' + a.title + ' (' + a.location + ')').join('\n')
            : 'No active incidents.') +
          '\n\nThe assistant does not dispatch responders. Use the incident workflow for auditable actions.',
        suggestions: ['Show current crowd load', 'Check RFID distress']
      };
    }

    if (q.includes('rfid') || q.includes('tracked') || q.includes('distress') || q.includes('lost')) {
      const distressed = rfidDevices.filter(d => d.isDistressed);

      return {
        content:
          'Tracked devices: ' + rfidDevices.length + '. Distress flags: ' + distressed.length + '.\n\n' +
          (distressed.length
            ? distressed.map(d => '• ' + d.wearerId + ': assistance flag active, last seen ' + d.lastSeen.toLocaleTimeString()).join('\n')
            : 'No active RFID distress flags.') +
          '\n\nGuardian contact data is intentionally not surfaced in the assistant.',
        suggestions: ['Open RFID safety workflow', 'Summarize active incidents']
      };
    }

    if (q.includes('response') || q.includes('time')) {
      return {
        content: 'Measured average response time today: ' + stats.avgResponseTime.toFixed(1) +
          ' minutes across ' + stats.resolvedIncidents +
          ' resolved incidents with timestamps. This metric is calculated from stored created/resolved times, not a hardcoded value.',
        suggestions: ['Summarize active incidents', 'Show current crowd load']
      };
    }

    return {
      content: 'I can summarize live operational data and explain the configured safety playbooks. I do not claim autonomous prediction or emergency dispatch.',
      suggestions: ['Show current crowd load', 'Summarize active incidents', 'Check RFID distress', 'Show response time']
    };
  };

  const send = async (value = input) => {
    const trimmed = value.trim();
    if (!trimmed || typing) return;

    setMessages(prev => prev.concat({
      id: crypto.randomUUID(),
      type: 'user',
      content: trimmed,
      timestamp: new Date()
    }));
    setInput('');
    setTyping(true);

    await new Promise(resolve => window.setTimeout(resolve, 450));
    const answer = respond(trimmed);

    setMessages(prev => prev.concat({
      id: crypto.randomUUID(),
      type: 'assistant',
      content: answer.content,
      timestamp: new Date(),
      suggestions: answer.suggestions
    }));
    setTyping(false);
  };

  if (!isOpen) {
    return (
      <button onClick={onToggle} aria-label="Open safety playbook assistant" className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50">
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[610px] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="font-semibold text-white">Safety Playbook Assistant</h3>
            <p className="text-[10px] text-slate-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Live database context · rule-based</p>
          </div>
        </div>
        <button onClick={onToggle} aria-label="Close assistant" className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={'flex ' + (message.type === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={'max-w-[86%] rounded-xl p-3 ' + (message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-100')}>
              <div className="flex items-start gap-2">
                {message.type === 'assistant' ? <Bot className="w-4 h-4 mt-1 text-blue-300" /> : <User className="w-4 h-4 mt-1" />}
                <div className="min-w-0">
                  <div className="whitespace-pre-line text-xs leading-5">{message.content}</div>
                  <div className="text-[10px] opacity-60 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
              {message.suggestions && (
                <div className="mt-3 space-y-1.5">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Quick queries</div>
                  {message.suggestions.map(s => (
                    <button key={s} type="button" onClick={() => void send(s)} className="block w-full text-left text-[10px] bg-slate-600 hover:bg-slate-500 text-slate-200 px-2 py-1.5 rounded">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && <div className="text-[10px] text-slate-400">Reading current operational snapshot…</div>}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t border-slate-700">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); void send(); } }} placeholder="Ask about current operations..." className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="button" onClick={() => void send()} disabled={!input.trim() || typing} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white p-2 rounded-lg"><Send className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};
