import React from 'react';
import { Shield, Bell, Users, MapPin, LogOut } from 'lucide-react';

interface HeaderProps {
  activeAlerts: number;
  currentUser: string;
  lastUpdate: Date;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeAlerts, currentUser, lastUpdate, onSignOut }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">SimhaGuard 360</h1>
              <p className="text-sm text-slate-400">Simhastha 2028 Safety Command</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-slate-300">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Ujjain, Madhya Pradesh</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-300" />
              {activeAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeAlerts}
                </span>
              )}
            </div>
            <span className="text-sm text-slate-300">{activeAlerts} Active Alerts</span>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-white">{currentUser}</p>
            <p className="text-xs text-slate-400">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>

          <button
            onClick={onSignOut}
            className="text-slate-400 hover:text-red-400 transition-colors duration-200"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};