import React, { useState } from 'react';
import { Assignment, Member, AppNotification } from '../types';
import { UserDashboard } from './UserDashboard';
import { VisualCalendar } from './VisualCalendar';
import { HistorySection } from './HistorySection';
import { NotificationCenterModal } from './NotificationCenterModal';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Bell, 
  Share2, 
  Check, 
  Calendar, 
  Home, 
  History, 
  Smartphone,
  Monitor,
  Download
} from 'lucide-react';

interface UserInterfaceProps {
  currentMember: Member;
  assignments: Assignment[];
  members: Member[];
  notifications: AppNotification[];
  onToggleStatus: (id: string, newStatus: 'pendiente' | 'confirmado') => void;
  onMarkAllNotificationsRead: () => void;
  onSimulateNextDay: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
}

export const UserInterface: React.FC<UserInterfaceProps> = ({
  currentMember,
  assignments,
  members,
  notifications,
  onToggleStatus,
  onMarkAllNotificationsRead,
  onSimulateNextDay,
  isPhoneFrame,
  onTogglePhoneFrame
}) => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'calendario' | 'historial'>('inicio');
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate personal direct link URL
  const personalUrl = `${window.location.origin}${window.location.pathname}?u=${encodeURIComponent(currentMember.id)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(personalUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Unread notifications for this user
  const unreadCount = notifications.filter(
    (n) => !n.read && (n.userId === currentMember.id || n.userId === 'all')
  ).length;

  return (
    <div className="flex-1 flex flex-col relative text-slate-800">
      {/* Publicador Clean Header (Strictly NO admin references or controls) */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        {/* Top micro bar */}
        <div className="px-4 py-1.5 bg-slate-950/90 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-cinzel tracking-wider text-slate-300 font-semibold uppercase text-[10px]">
              Congregación Valle Hermoso
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onTogglePhoneFrame}
              className="hidden sm:inline-flex items-center space-x-1 text-slate-400 hover:text-slate-200 py-0.5 px-2 rounded hover:bg-white/5 text-[10px]"
            >
              {isPhoneFrame ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
              <span>{isPhoneFrame ? 'Vista Completa' : 'Marco Móvil'}</span>
            </button>
          </div>
        </div>

        {/* User bar */}
        <div className="px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold font-cinzel text-sm shadow-md shrink-0">
              {currentMember.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="font-serif-elegant font-bold text-sm sm:text-base text-white tracking-wide truncate">
                  {currentMember.name}
                </h1>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  {currentMember.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Mi Portal de Asignaciones
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {/* PWA In-App Install Button */}
            <PWAInstallButton variant="button" />

            {/* Direct personal link copy */}
            <button
              onClick={handleCopyLink}
              className={`text-xs py-1.5 px-2.5 rounded-xl border transition-all flex items-center space-x-1 font-semibold ${
                copiedLink
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
              }`}
              title="Copiar mi enlace personal"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Mi Enlace</span>
                </>
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => setShowNotificationCenter(true)}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white transition-colors"
              title="Avisos y recordatorios"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-3.5 sm:p-5 overflow-y-auto pb-24 space-y-4">
        {/* Prominent PWA Install Banner at top of page */}
        <PWAInstallButton variant="banner" />

        {activeTab === 'inicio' && (
          <UserDashboard
            currentMember={currentMember}
            assignments={assignments}
            onToggleStatus={onToggleStatus}
            onNavigateToCalendar={() => setActiveTab('calendario')}
            onOpenNotifications={() => setShowNotificationCenter(true)}
          />
        )}

        {activeTab === 'calendario' && (
          <VisualCalendar
            assignments={assignments}
            members={members}
            currentUserId={currentMember.id}
            isAdmin={false}
            onOpenAssignModalForDate={() => {}}
            onToggleStatus={onToggleStatus}
          />
        )}

        {activeTab === 'historial' && (
          <HistorySection
            assignments={assignments.filter(
              (a) => a.assigneeId === currentMember.id || a.assistantId === currentMember.id
            )}
            isAdmin={false}
            onMarkCompleted={() => {}}
          />
        )}
      </main>

      {/* Bottom Navigation for Publicador */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 mx-auto shadow-lg transition-all ${
        isPhoneFrame ? 'max-w-md' : 'max-w-3xl'
      }`}>
        <div className="flex items-center justify-around h-16 px-2">
          {[
            { id: 'inicio', label: 'Mi Programa', icon: Home },
            { id: 'calendario', label: 'Calendario', icon: Calendar },
            { id: 'historial', label: 'Mi Historial', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* Notification Center Modal */}
      {showNotificationCenter && (
        <NotificationCenterModal
          notifications={notifications}
          currentUserId={currentMember.id}
          isAdmin={false}
          onClose={() => setShowNotificationCenter(false)}
          onMarkAllAsRead={onMarkAllNotificationsRead}
          onSimulateNextDay={onSimulateNextDay}
        />
      )}
    </div>
  );
};
