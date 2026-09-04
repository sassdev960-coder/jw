import React, { useState } from 'react';
import { Assignment, Member, AppNotification } from '../types';
import { AdminPanel } from './AdminPanel';
import { VisualCalendar } from './VisualCalendar';
import { HistorySection } from './HistorySection';
import { AdminAssignmentModal } from './AdminAssignmentModal';
import { NotificationCenterModal } from './NotificationCenterModal';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Shield, 
  Plus, 
  Calendar, 
  Users, 
  History, 
  Cloud, 
  LogOut, 
  Eye, 
  Bell, 
  Smartphone, 
  Monitor, 
  Sliders,
  Database
} from 'lucide-react';

interface AdminInterfaceProps {
  assignments: Assignment[];
  members: Member[];
  notifications: AppNotification[];
  onSaveAssignment: (asgData: Omit<Assignment, 'id' | 'createdAt'>, sendImmediateNotif: boolean) => Promise<void>;
  onMarkCompleted: (id: string, notes?: string) => void;
  onDeleteAssignment: (id: string) => void;
  onSaveMember: (member: Member) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
  onViewMemberAsUser: (memberId: string) => void;
  onLogoutAdmin: () => void;
  onMarkAllNotificationsRead: () => void;
  onSimulateNextDay: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
}

export const AdminInterface: React.FC<AdminInterfaceProps> = ({
  assignments,
  members,
  notifications,
  onSaveAssignment,
  onMarkCompleted,
  onDeleteAssignment,
  onSaveMember,
  onDeleteMember,
  onViewMemberAsUser,
  onLogoutAdmin,
  onMarkAllNotificationsRead,
  onSimulateNextDay,
  isPhoneFrame,
  onTogglePhoneFrame
}) => {
  const [adminNav, setAdminNav] = useState<'panel' | 'calendar' | 'history'>('panel');
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [selectedDateForAssign, setSelectedDateForAssign] = useState<string | undefined>(undefined);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex-1 flex flex-col relative text-slate-800">
      {/* Administrator Dedicated Header */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
        {/* Top micro bar */}
        <div className="px-4 py-1.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-cinzel tracking-wider text-amber-300 font-semibold uppercase text-[10px]">
              Panel de Administración Teocrática
            </span>
            <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
              <Cloud className="w-2.5 h-2.5" />
              <span>Firebase Conectado</span>
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

            <button
              onClick={onLogoutAdmin}
              className="flex items-center space-x-1 text-rose-300 hover:text-rose-100 text-[10px] py-0.5 px-2 rounded bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/40 transition-colors"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="w-3 h-3" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Title bar */}
        <div className="px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-serif-elegant font-bold text-sm sm:text-base text-white tracking-wide truncate">
                Superintendencia de Reuniones
              </h1>
              <p className="text-[10px] text-slate-400 truncate">
                {members.length} Publicadores • {assignments.length} Asignaciones
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {/* In-app install button */}
            <PWAInstallButton variant="button" />

            {/* Quick new assignment button */}
            <button
              onClick={() => {
                setSelectedDateForAssign(undefined);
                setShowCreateAssignmentModal(true);
              }}
              className="py-1.5 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nueva Parte</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => setShowNotificationCenter(true)}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white transition-colors"
              title="Avisos y notificaciones"
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

      {/* Main Admin Content */}
      <main className="flex-1 p-3.5 sm:p-5 overflow-y-auto pb-24">
        {adminNav === 'panel' && (
          <AdminPanel
            assignments={assignments}
            members={members}
            onOpenCreateModal={() => {
              setSelectedDateForAssign(undefined);
              setShowCreateAssignmentModal(true);
            }}
            onMarkCompleted={onMarkCompleted}
            onDeleteAssignment={onDeleteAssignment}
            onSendBulkReminders={() => setShowNotificationCenter(true)}
            onSaveMember={onSaveMember}
            onDeleteMember={onDeleteMember}
            onSelectMemberToView={onViewMemberAsUser}
            onLogoutAdmin={onLogoutAdmin}
          />
        )}

        {adminNav === 'calendar' && (
          <VisualCalendar
            assignments={assignments}
            members={members}
            currentUserId=""
            isAdmin={true}
            onOpenAssignModalForDate={(dateStr) => {
              setSelectedDateForAssign(dateStr);
              setShowCreateAssignmentModal(true);
            }}
            onToggleStatus={() => {}}
          />
        )}

        {adminNav === 'history' && (
          <HistorySection
            assignments={assignments}
            isAdmin={true}
            onMarkCompleted={onMarkCompleted}
          />
        )}
      </main>

      {/* Bottom Navigation for Administrator */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 mx-auto shadow-2xl transition-all ${
        isPhoneFrame ? 'max-w-md' : 'max-w-3xl'
      }`}>
        <div className="flex items-center justify-around h-16 px-2">
          {[
            { id: 'panel', label: 'Gestión & Perfiles', icon: Sliders },
            { id: 'calendar', label: 'Calendario General', icon: Calendar },
            { id: 'history', label: 'Historial', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminNav === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setAdminNav(tab.id as any)}
                className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-all ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-amber-500/20 text-amber-300' : ''
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>

                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Assignment Creation Modal */}
      {showCreateAssignmentModal && (
        <AdminAssignmentModal
          members={members}
          initialDate={selectedDateForAssign}
          onClose={() => {
            setShowCreateAssignmentModal(false);
            setSelectedDateForAssign(undefined);
          }}
          onSaveAssignment={onSaveAssignment}
        />
      )}

      {/* Notification Center */}
      {showNotificationCenter && (
        <NotificationCenterModal
          notifications={notifications}
          currentUserId="all"
          isAdmin={true}
          onClose={() => setShowNotificationCenter(false)}
          onMarkAllAsRead={onMarkAllNotificationsRead}
          onSimulateNextDay={onSimulateNextDay}
        />
      )}
    </div>
  );
};
