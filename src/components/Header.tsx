import React, { useState } from 'react';
import { Member } from '../types';
import { 
  Bell, 
  Smartphone, 
  Monitor, 
  User, 
  ShieldAlert, 
  Sparkles,
  ChevronDown,
  Lock,
  Unlock,
  Copy,
  Check,
  Cloud,
  Share2
} from 'lucide-react';

interface HeaderProps {
  members: Member[];
  currentUserId: string;
  isAdmin: boolean;
  onSelectMember: (memberId: string) => void;
  onRequestAdminAccess: () => void;
  onLogoutAdmin: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  members,
  currentUserId,
  isAdmin,
  onSelectMember,
  onRequestAdminAccess,
  onLogoutAdmin,
  unreadNotificationsCount,
  onOpenNotifications,
  isPhoneFrame,
  onTogglePhoneFrame
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const currentMember = members.find((m) => m.id === currentUserId) || members[0];

  const handleCopyMyLink = () => {
    if (!currentMember) return;
    const url = `${window.location.origin}${window.location.pathname}?u=${encodeURIComponent(currentMember.id)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      {/* Top micro bar with congregation name & view switch */}
      <div className="px-4 py-1.5 bg-slate-950/90 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Sincronizado con Firebase Firestore" />
          <span className="font-cinzel tracking-wider text-slate-300 font-semibold uppercase text-[10px] sm:text-[11px]">
            Congregación Valle Hermoso
          </span>
          <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-800/40">
            <Cloud className="w-2.5 h-2.5" />
            <span>Firestore</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Frame switcher toggle for preview testing */}
          <button
            onClick={onTogglePhoneFrame}
            className="hidden sm:inline-flex items-center space-x-1 text-slate-400 hover:text-slate-200 py-0.5 px-2 rounded-md hover:bg-white/5 transition-colors text-[10px]"
            title={isPhoneFrame ? 'Cambiar a vista completa (Tablet/PC)' : 'Ver en marco de teléfono'}
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3 h-3" />
                <span>Vista Completa</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3" />
                <span>Marco Móvil</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main app bar */}
      <div className="px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md shrink-0">
            <span className="font-cinzel text-sm">JW</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-serif-elegant font-bold text-xs sm:text-sm text-white tracking-wide leading-tight truncate">
              Asignaciones Teocráticas
            </h1>
            <p className="text-[10px] text-amber-300/80 font-medium truncate">
              {isAdmin ? 'Panel de Administración' : (currentMember?.name || 'Portal del Publicador')}
            </p>
          </div>
        </div>

        {/* Member / Admin Selector and Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Direct Link Share Button for current member */}
          {!isAdmin && currentMember && (
            <button
              onClick={handleCopyMyLink}
              className={`text-[11px] font-semibold py-1.5 px-2.5 rounded-xl border transition-all flex items-center space-x-1 ${
                copiedLink
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
              }`}
              title="Copiar mi enlace personal directo"
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
          )}

          {/* Admin Toggle / Lock Button */}
          {isAdmin ? (
            <button
              onClick={onLogoutAdmin}
              className="text-[11px] font-semibold py-1.5 px-2.5 rounded-xl bg-amber-500 text-slate-950 border border-amber-400 flex items-center space-x-1 shadow-xs hover:bg-amber-400 transition-colors"
              title="Modo Administrador Activo. Clic para salir."
            >
              <Unlock className="w-3.5 h-3.5" />
              <span className="font-bold">Admin</span>
            </button>
          ) : (
            <button
              onClick={onRequestAdminAccess}
              className="text-[11px] font-semibold py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 flex items-center space-x-1 transition-colors"
              title="Acceso para Superintendente (Contraseña: 123456789)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Publicador Dropdown Switcher */}
          <div className="relative">
            <select
              id="active-user-profile-select"
              value={currentUserId}
              onChange={(e) => {
                onSelectMember(e.target.value);
              }}
              className="text-[11px] py-1.5 pl-2 pr-6 rounded-xl font-medium bg-white/10 text-slate-200 border border-white/15 appearance-none cursor-pointer focus:outline-none max-w-[110px] sm:max-w-[150px] truncate"
              title="Cambiar publicador"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                  {m.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Notifications button */}
          <button
            id="open-notifications-bell-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white transition-colors"
            title="Avisos y notificaciones automáticas"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
