import React, { useState } from 'react';
import { Settings, Users, Shield, AlertTriangle, Radio, Zap } from 'lucide-react';

interface ControlPanelProps {
  onEmergencyAction: (action: string, data: any) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onEmergencyAction }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [barrierMode, setBarrierMode] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' }
  ];

  const emergencyActions = [
    {
      id: 'crowd-alert',
      title: 'Send Crowd Alert',
      description: 'Broadcast crowd management alert',
      icon: Users,
      color: 'bg-yellow-500',
      action: () => onEmergencyAction('crowd-alert', { zones: ['all'] })
    },
    {
      id: 'medical-emergency',
      title: 'Medical Emergency',
      description: 'Dispatch medical teams',
      icon: Shield,
      color: 'bg-red-500',
      action: () => onEmergencyAction('medical-emergency', { priority: 'high' })
    },
    {
      id: 'evacuation',
      title: 'Initiate Evacuation',
      description: 'Activate evacuation protocols',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      action: () => onEmergencyAction('evacuation', { routes: 'all' })
    },
    {
      id: 'broadcast',
      title: 'Emergency Broadcast',
      description: 'Send multilingual announcement',
      icon: Radio,
      color: 'bg-blue-500',
      action: () => onEmergencyAction('broadcast', { language: selectedLanguage })
    }
  ];

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">Control Panel</h2>
      </div>

      {/* Language Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Alert Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Barriers Control */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-300">
            Dynamic Barriers
          </label>
          <button
            onClick={() => setBarrierMode(!barrierMode)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
              barrierMode ? 'bg-blue-500' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${
                barrierMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-slate-400">
          {barrierMode ? 'Auto-deployment enabled' : 'Manual control active'}
        </p>
      </div>

      {/* Emergency Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Emergency Actions</h3>
        {emergencyActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="w-full text-left bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 rounded-lg p-4 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className={`${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{action.title}</p>
                  <p className="text-sm text-slate-400">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* System Status */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <h3 className="text-sm font-medium text-slate-300 mb-3">System Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">RFID Network</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Communication Link</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-400">Connected</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Emergency Systems</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-400">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};