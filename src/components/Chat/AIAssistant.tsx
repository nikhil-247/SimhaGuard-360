import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Lightbulb, AlertTriangle, MapPin } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Namaste! I\'m your Kumbh Mela AI Assistant. I can help you with crowd management, emergency protocols, pilgrim guidance, and safety suggestions. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'Show crowd density at major ghats',
        'Emergency evacuation procedures',
        'Lost pilgrim protocols',
        'Weather impact on crowd flow'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('crowd') || message.includes('density')) {
      return {
        content: '🚨 **Current Crowd Analysis:**\n\n• **Triveni Sangam**: 85% capacity (Critical - implement flow control)\n• **Dashashwamedh Ghat**: 72% capacity (Moderate)\n• **Manikarnika Ghat**: 45% capacity (Safe)\n\n**Recommendations:**\n✅ Redirect pilgrims from Sangam to Assi Ghat\n✅ Deploy additional barriers at Gate 1\n✅ Activate alternate routes via Sector 2',
        suggestions: [
          'Show evacuation routes',
          'Deploy emergency teams',
          'Send crowd alerts',
          'Weather impact analysis'
        ]
      };
    }
    
    if (message.includes('emergency') || message.includes('evacuation')) {
      return {
        content: '🚨 **Emergency Evacuation Protocol:**\n\n**Immediate Actions:**\n1. Sound evacuation alarms in affected sectors\n2. Open all emergency gates (Gates 5 & 6)\n3. Deploy crowd control barriers\n4. Activate PA system in Hindi, English, and local languages\n\n**Evacuation Routes:**\n🔹 **Route A**: Sangam → Gate 5 (Capacity: 5000/hour)\n🔹 **Route B**: Sector 2 → Gate 6 (Capacity: 3000/hour)\n🔹 **Route C**: Main Road → Gate 1 (Emergency only)',
        suggestions: [
          'Activate evacuation now',
          'Medical emergency protocol',
          'Contact emergency services',
          'Crowd control measures'
        ]
      };
    }
    
    if (message.includes('lost') || message.includes('missing')) {
      return {
        content: '👤 **Lost Pilgrim Protocol:**\n\n**Immediate Steps:**\n1. Check RFID tracking system for last known location\n2. Broadcast announcement in multiple languages\n3. Alert Lost & Found centers at both locations\n4. Deploy search teams to high-density areas\n\n**Current Lost & Found Status:**\n📍 **Center 1**: 12 cases resolved today\n📍 **Center 2**: 8 cases pending\n\n**Family Reunification:**\n• Use RFID family linking system\n• Check family meeting points\n• Coordinate with local police',
        suggestions: [
          'Track RFID device',
          'Broadcast announcement',
          'Deploy search teams',
          'Contact family members'
        ]
      };
    }
    
    if (message.includes('weather') || message.includes('rain')) {
      return {
        content: '🌦️ **Weather Impact Analysis:**\n\n**Current Conditions:**\n• Temperature: 26°C (Comfortable)\n• Humidity: 65% (Moderate)\n• Wind: 5 km/h NE (Light breeze)\n• Forecast: Clear skies next 6 hours\n\n**Crowd Flow Impact:**\n✅ Favorable conditions for outdoor activities\n⚠️ Monitor for afternoon heat buildup\n\n**Recommendations:**\n• Increase water distribution points\n• Ensure shade availability at ghats\n• Monitor elderly pilgrims for heat stress',
        suggestions: [
          'Setup cooling stations',
          'Increase medical patrols',
          'Water distribution plan',
          'Heat emergency protocol'
        ]
      };
    }
    
    if (message.includes('medical') || message.includes('health')) {
      return {
        content: '🏥 **Medical Emergency Support:**\n\n**Available Resources:**\n• **Medical Camp 1**: 15 doctors, 25 nurses (Active)\n• **Medical Camp 2**: 12 doctors, 20 nurses (Active)\n• **Mobile Units**: 8 ambulances deployed\n• **Helicopter**: On standby for critical cases\n\n**Common Issues Today:**\n1. Heat exhaustion (23 cases)\n2. Minor injuries (15 cases)\n3. Elderly assistance (31 cases)\n\n**Quick Response:**\n📞 Emergency: 108\n📞 Medical Helpline: +91-9876543210',
        suggestions: [
          'Deploy medical team',
          'Request ambulance',
          'Heat stroke protocol',
          'Elderly assistance'
        ]
      };
    }
    
    if (message.includes('security') || message.includes('safety')) {
      return {
        content: '🔒 **Security & Safety Status:**\n\n**Current Deployment:**\n• **Police Posts**: 12 active stations\n• **Security Personnel**: 450 officers on duty\n• **CCTV Coverage**: 95% area monitored\n• **Metal Detectors**: All gates operational\n\n**Today\'s Incidents:**\n✅ 0 major security incidents\n⚠️ 3 minor disputes resolved\n📱 12 pickpocketing reports\n\n**Safety Measures:**\n• Regular patrol schedules active\n• Crowd monitoring via AI systems\n• Emergency response teams positioned',
        suggestions: [
          'Increase patrols',
          'Check CCTV footage',
          'Deploy additional security',
          'Anti-theft measures'
        ]
      };
    }
    
    if (message.includes('food') || message.includes('water')) {
      return {
        content: '🍽️ **Food & Water Management:**\n\n**Distribution Points:**\n• **Food Courts**: 2 main locations operational\n• **Water Stations**: 25 points across all sectors\n• **Free Meal Centers**: 8 locations (Langar)\n\n**Current Status:**\n✅ Water supply: Adequate (tested hourly)\n✅ Food safety: All vendors certified\n⚠️ High demand at Sector 2 food court\n\n**Recommendations:**\n• Add mobile water tankers near Sangam\n• Increase food court capacity in Sector 2\n• Monitor queue lengths at meal centers',
        suggestions: [
          'Deploy water tankers',
          'Food safety inspection',
          'Increase meal distribution',
          'Queue management'
        ]
      };
    }
    
    // Default response
    return {
      content: '🤖 I can help you with various aspects of Kumbh Mela management:\n\n**Available Services:**\n• 📊 Crowd density monitoring\n• 🚨 Emergency protocols\n• 👤 Lost pilgrim assistance\n• 🌦️ Weather impact analysis\n• 🏥 Medical emergency support\n• 🔒 Security coordination\n• 🍽️ Food & water management\n\nPlease let me know what specific information or assistance you need!',
      suggestions: [
        'Show current crowd status',
        'Emergency procedures',
        'Weather forecast impact',
        'Medical resources available'
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-800 border border-slate-700 rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">Kumbh AI Assistant</h3>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-100'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'ai' && <Bot className="w-4 h-4 mt-1 text-blue-400" />}
                {message.type === 'user' && <User className="w-4 h-4 mt-1" />}
                <div className="flex-1">
                  <div className="whitespace-pre-line text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              {message.suggestions && (
                <div className="mt-3 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center space-x-1">
                    <Lightbulb className="w-3 h-3" />
                    <span>Quick actions:</span>
                  </div>
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left text-xs bg-slate-600 hover:bg-slate-500 text-slate-200 px-2 py-1 rounded transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-lg p-3 flex items-center space-x-2">
              <Bot className="w-4 h-4 text-blue-400" />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about crowd management, emergencies, or safety..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white p-2 rounded-lg transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};