import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Header } from './components/Navigation/Header';
import { Sidebar } from './components/Navigation/Sidebar';
import { MapView } from './components/Map/MapView';
import { StatsPanel } from './components/Dashboard/StatsPanel';
import { AlertsPanel } from './components/Dashboard/AlertsPanel';
import { ControlPanel } from './components/Dashboard/ControlPanel';
import { RFIDTracker } from './components/Dashboard/RFIDTracker';
import PredictiveAlerts from './components/Dashboard/PredictiveAlerts';
import AdminPanel from './components/Dashboard/AdminPanel';
import UserDashboard from './components/Dashboard/UserDashboard';
import { AIAssistant } from './components/Chat/AIAssistant';
import { useSupabaseData } from './hooks/useSupabaseData';
import { useAuth } from './contexts/AuthContext';
import { mockEvacuationRoutes } from './data/mockData';

const DashboardContent: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedZone, setSelectedZone] = useState<string>();
  const [showAIChat, setShowAIChat] = useState(false);
  
  const {
    crowdZones,
    emergencyUnits,
    rfidDevices,
    alerts,
    stats,
    lastUpdate,
    addAlert,
    resolveAlert,
    markRFIDDistress,
    loading
  } = useSupabaseData();

  const activeAlerts = alerts.filter(alert => alert.isActive);

  const handleEmergencyAction = (action: string, data: any) => {
    console.log('Emergency action triggered:', action, data);
    addAlert({
      type: 'security',
      severity: 'high',
      title: `Emergency Action: ${action}`,
      description: `Emergency action triggered: ${action}`,
      location: 'Command Center',
      coordinates: { x: 250, y: 200 },
      isActive: true
    });
  };

  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard data...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return profile?.role === 'admin' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <MapView
                crowdZones={crowdZones}
                emergencyUnits={emergencyUnits}
                rfidDevices={rfidDevices}
                evacuationRoutes={mockEvacuationRoutes}
                selectedZone={selectedZone}
                onZoneSelect={setSelectedZone}
              />
            </div>
            <div className="space-y-6">
              <StatsPanel stats={stats} />
              <AlertsPanel alerts={activeAlerts} onResolveAlert={resolveAlert} />
            </div>
          </div>
        ) : (
          <UserDashboard />
        );
      case 'admin':
        return <AdminPanel />;
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <MapView
                crowdZones={crowdZones}
                emergencyUnits={emergencyUnits}
                rfidDevices={rfidDevices}
                evacuationRoutes={mockEvacuationRoutes}
                selectedZone={selectedZone}
                onZoneSelect={setSelectedZone}
              />
            </div>
            <div className="space-y-6">
              <StatsPanel stats={stats} />
              <AlertsPanel alerts={activeAlerts} onResolveAlert={resolveAlert} />
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <MapView
                crowdZones={crowdZones}
                emergencyUnits={emergencyUnits}
                rfidDevices={rfidDevices}
                evacuationRoutes={mockEvacuationRoutes}
                selectedZone={selectedZone}
                onZoneSelect={setSelectedZone}
              />
            </div>
            <div className="space-y-6">
              <ControlPanel onEmergencyAction={handleEmergencyAction} />
            </div>
          </div>
        );
      case 'rfid':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MapView
                crowdZones={crowdZones}
                emergencyUnits={emergencyUnits}
                rfidDevices={rfidDevices}
                evacuationRoutes={mockEvacuationRoutes}
                selectedZone={selectedZone}
                onZoneSelect={setSelectedZone}
              />
            </div>
            <RFIDTracker devices={rfidDevices} onDistress={markRFIDDistress} />
          </div>
        );
      case 'alerts':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsPanel alerts={alerts} onResolveAlert={resolveAlert} />
            <PredictiveAlerts />
          </div>
        );
      default:
        return (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-slate-400">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950">
        <Header
          activeAlerts={activeAlerts.length}
          currentUser={profile?.full_name || 'User'}
          lastUpdate={lastUpdate}
          onSignOut={signOut}
        />
        
        <div className="flex">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            userRole={profile?.role || 'user'}
          />
          
          <main className="flex-1 p-6">
            {renderMainContent()}
          </main>
        </div>
        
        <AIAssistant isOpen={showAIChat} onToggle={() => setShowAIChat(!showAIChat)} />
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
