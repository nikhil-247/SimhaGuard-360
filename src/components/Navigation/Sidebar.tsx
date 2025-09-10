import React from 'react';
import { 
  Map, 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Settings, 
  Radio,
  Shield,
  Activity,
  FileText,
  User
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'user';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, userRole }) => {
  const adminMenuItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'map', name: 'Live Map', icon: Map },
    { id: 'crowd', name: 'Crowd Monitor', icon: Users },
    { id: 'rfid', name: 'RFID Tracker', icon: Activity },
    { id: 'alerts', name: 'Alerts', icon: AlertTriangle },
    { id: 'communications', name: 'Communications', icon: Radio },
    { id: 'admin', name: 'Admin Panel', icon: Shield },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const userMenuItems = [
    { id: 'overview', name: 'Dashboard', icon: User },
    { id: 'map', name: 'Live Map', icon: Map },
    { id: 'rfid', name: 'Family Tracker', icon: Activity },
    { id: 'alerts', name: 'Alerts', icon: AlertTriangle }
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 p-4">
      {/* Role Indicator */}
      <div className="mb-6 p-3 bg-slate-800 rounded-lg border border-slate-600">
        <div className="flex items-center space-x-2">
          {userRole === 'admin' ? (
            <Shield className="w-4 h-4 text-red-400" />
          ) : (
            <User className="w-4 h-4 text-blue-400" />
          )}
          <span className="text-sm font-medium text-white">
            {userRole === 'admin' ? 'Administrator' : 'User Access'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Emergency Status */}
      <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-600">
        <div className="flex items-center space-x-2 mb-3">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-white">Emergency Status</span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Level:</span>
            <span className="text-green-400 font-medium">Normal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Response Teams:</span>
            <span className="text-white">12 Ready</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Last Drill:</span>
            <span className="text-slate-300">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};