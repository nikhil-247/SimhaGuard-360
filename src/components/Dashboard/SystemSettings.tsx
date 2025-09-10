import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Users, 
  MapPin,
  Radio,
  AlertTriangle,
  Save,
  RefreshCw,
  Monitor,
  Wifi,
  Battery,
  Clock
} from 'lucide-react';

interface SystemConfig {
  alertThresholds: {
    crowdDensity: number;
    batteryLevel: number;
    responseTime: number;
  };
  notifications: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    pushNotifications: boolean;
    soundAlerts: boolean;
  };
  monitoring: {
    realTimeUpdates: boolean;
    dataRetention: number;
    autoBackup: boolean;
    logLevel: string;
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: boolean;
    twoFactorAuth: boolean;
    auditLogging: boolean;
  };
}

export default function SystemSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('alerts');
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<SystemConfig>({
    alertThresholds: {
      crowdDensity: 85,
      batteryLevel: 20,
      responseTime: 300
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: true,
      pushNotifications: true,
      soundAlerts: false
    },
    monitoring: {
      realTimeUpdates: true,
      dataRetention: 30,
      autoBackup: true,
      logLevel: 'info'
    },
    security: {
      sessionTimeout: 60,
      passwordPolicy: true,
      twoFactorAuth: false,
      auditLogging: true
    }
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    // Show success message
  };

  const tabs = [
    { id: 'alerts', name: 'Alert Thresholds', icon: AlertTriangle },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'monitoring', name: 'Monitoring', icon: Monitor },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600">Configure system parameters and preferences</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Alert Thresholds Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Thresholds</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Crowd Density Alert (%)
                    </label>
                    <input
                      type="number"
                      value={config.alertThresholds.crowdDensity}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        alertThresholds: {
                          ...prev.alertThresholds,
                          crowdDensity: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="50"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Trigger alert when zone reaches this capacity</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Low Battery Alert (%)
                    </label>
                    <input
                      type="number"
                      value={config.alertThresholds.batteryLevel}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        alertThresholds: {
                          ...prev.alertThresholds,
                          batteryLevel: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="5"
                      max="50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Alert when RFID device battery is low</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response Time (seconds)
                    </label>
                    <input
                      type="number"
                      value={config.alertThresholds.responseTime}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        alertThresholds: {
                          ...prev.alertThresholds,
                          responseTime: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="60"
                      max="1800"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum expected emergency response time</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Email Alerts</p>
                        <p className="text-sm text-gray-500">Receive alerts via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.notifications.emailAlerts}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            emailAlerts: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Radio className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">SMS Alerts</p>
                        <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.notifications.smsAlerts}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            smsAlerts: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wifi className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-500">Browser push notifications</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.notifications.pushNotifications}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            pushNotifications: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Sound Alerts</p>
                        <p className="text-sm text-gray-500">Audio notifications for critical alerts</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.notifications.soundAlerts}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            soundAlerts: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">System Monitoring</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Real-time Updates</p>
                        <p className="text-sm text-gray-500">Enable live data streaming</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.monitoring.realTimeUpdates}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          monitoring: {
                            ...prev.monitoring,
                            realTimeUpdates: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Auto Backup</p>
                        <p className="text-sm text-gray-500">Automatic database backups</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.monitoring.autoBackup}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          monitoring: {
                            ...prev.monitoring,
                            autoBackup: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Retention (days)
                    </label>
                    <input
                      type="number"
                      value={config.monitoring.dataRetention}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        monitoring: {
                          ...prev.monitoring,
                          dataRetention: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="7"
                      max="365"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Log Level
                    </label>
                    <select
                      value={config.monitoring.logLevel}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        monitoring: {
                          ...prev.monitoring,
                          logLevel: e.target.value
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="error">Error</option>
                      <option value="warn">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={config.security.sessionTimeout}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          sessionTimeout: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="15"
                      max="480"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Strong Password Policy</p>
                        <p className="text-sm text-gray-500">Enforce complex passwords</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.security.passwordPolicy}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordPolicy: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.security.twoFactorAuth}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            twoFactorAuth: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Audit Logging</p>
                        <p className="text-sm text-gray-500">Log all user actions</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.security.auditLogging}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            auditLogging: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}