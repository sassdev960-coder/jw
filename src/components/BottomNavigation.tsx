import React from 'react';
import { ActiveTab } from '../types';
import { 
  Home, 
  Calendar, 
  ClipboardList, 
  History, 
  Sliders,
  Users
} from 'lucide-react';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  isAdmin: boolean;
  unreadCount?: number;
  isPhoneFrame?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  isAdmin,
  unreadCount = 0,
  isPhoneFrame = true
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'inicio', label: 'Mi Panel', icon: Home },
    { id: 'calendario', label: 'Calendario', icon: Calendar },
    { id: 'asignar', label: isAdmin ? 'Admin & Partes' : 'Turnos', icon: isAdmin ? Sliders : ClipboardList },
    { id: 'historial', label: 'Historial', icon: History }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 mx-auto shadow-lg transition-all ${
      isPhoneFrame ? 'max-w-md' : 'max-w-3xl'
    }`}>
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-all ${
                isActive ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-amber-100 text-amber-900' : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>

              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
