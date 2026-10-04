import React, { useState } from 'react';
import { Settings, Users, Shield, AlertTriangle, Radio, FileText } from 'lucide-react';

interface ControlPanelProps {
  onEmergencyAction: (action: string, data: unknown) => void;
}

const actions = [
  {
    id: 'crowd-review',
    title: 'Flag crowd-flow risk',
    description: 'Create an operator incident for crowd-flow review',
    icon: Users,
  },
  {
    id: 'medical-review',
    title: 'Request medical review',
    description: 'Create a high-priority incident for the medical team',
    icon: Shield,
  },
  {
    id: 'evacuation-review',
    title: 'Open evacuation review',
    description: 'Create an incident for authorized evacuation planning',
    icon: AlertTriangle,
  },
  {
    id: 'broadcast-draft',
    title: 'Create broadcast task',
    description: 'Create an operator task for a multilingual announcement',
    icon: Radio,
  },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({ onEmergencyAction }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [lastAction, setLastAction] = useState<string | null>(null);

  const submit = (id: string) => {
    const language = id === 'broadcast-draft' ? selectedLanguage : undefined;
    onEmergencyAction(id, language ? { language } : {});
    setLastAction(id);
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center space-x-2 mb-2">
        <Settings className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">Operator Actions</h2>
      </div>
      <p className="text-xs text-slate-400 mb-5">
        These controls create auditable incident/tasks in the current system. External dispatch, PA systems and physical barriers are not connected.
      </p>

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-300 mb-2">Broadcast language</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
          <option value="gu">ગુજરાતી</option>
        </select>
      </div>

      <div className="space-y-3">
        {actions.map(action => {
          const Icon = action.icon;
          const active = lastAction === action.id;
          return (
            <button
              type="button"
              key={action.id}
              onClick={() => submit(action.id)}
              className={
                'w-full text-left rounded-lg border p-4 transition-colors ' +
                (active
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-slate-600 bg-slate-700 hover:bg-slate-600')
              }
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-600">
                  <Icon className="w-5 h-5 text-slate-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{action.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {lastAction && (
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
          <FileText className="w-4 h-4" />
          Operator intent recorded: {lastAction}
        </div>
      )}
    </div>
  );
};
