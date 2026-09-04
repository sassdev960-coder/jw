import React, { useState } from 'react';
import { AppNotification } from '../types';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Calendar, 
  Clock, 
  Sparkles, 
  Volume2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { playGentleChime } from '../services/notificationService';

interface NotificationCenterModalProps {
  notifications: AppNotification[];
  currentUserId: string;
  isAdmin: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onSimulateNextDay?: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  notifications,
  currentUserId,
  isAdmin,
  onClose,
  onMarkAllAsRead,
  onSimulateNextDay
}) => {
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default';
  });

  // Filter for user or admin
  const userNotifications = notifications.filter(
    (n) => isAdmin || n.userId === currentUserId || n.userId === 'all'
  );

  const displayedNotifications = filterUnreadOnly
    ? userNotifications.filter((n) => !n.read)
    : userNotifications;

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleRequestBrowserPermission = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
        if (perm === 'granted') {
          playGentleChime();
          new Notification('Notificaciones Activadas', {
            body: 'Recibirás avisos de tus asignaciones y turnos con 5 días de anticipación.',
            icon: '/favicon.ico'
          });
        }
      } catch (err) {
        console.error('Notification error:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="notification-center-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] text-slate-800"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-elegant font-bold text-base tracking-wide">
                Avisos y Notificaciones
              </h3>
              <p className="text-xs text-slate-400">
                {unreadCount > 0 ? `${unreadCount} aviso(s) sin leer` : 'Al día con todas las asignaciones'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Simulation bar */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                filterUnreadOnly
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {filterUnreadOnly ? 'Solo no leídas' : 'Todas'}
            </button>

            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 font-medium px-2 py-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Marcar leídas</span>
              </button>
            )}
          </div>

          {onSimulateNextDay && (
            <button
              id="simulate-daily-advance-btn"
              onClick={() => {
                playGentleChime();
                onSimulateNextDay();
              }}
              title="Simular el paso de 1 día para verificar el aviso diario (de 5 a 0 días)"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-semibold border border-amber-300 hover:bg-amber-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Simular +1 día</span>
            </button>
          )}
        </div>

        {/* Browser Permission Banner if not enabled */}
        {browserPermission !== 'granted' && (
          <div className="px-4 py-2.5 bg-amber-50/90 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>¿Deseas recibir avisos en la pantalla de tu móvil?</span>
            </div>
            <button
              onClick={handleRequestBrowserPermission}
              className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg text-[11px] shrink-0"
            >
              Activar
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {displayedNotifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto opacity-30 text-slate-400" />
              <p className="text-xs">No hay notificaciones en este momento.</p>
            </div>
          ) : (
            displayedNotifications.map((n) => {
              const isCountdown = n.type === 'countdown';
              const isNew = n.type === 'new_assignment';

              return (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    !n.read
                      ? 'bg-amber-50/40 border-amber-300/80 shadow-xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isCountdown
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : isNew
                            ? 'bg-sky-100 text-sky-900 border border-sky-200'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {isCountdown
                          ? n.daysRemaining !== undefined
                            ? `Faltan ${n.daysRemaining} días`
                            : 'Cuenta Regresiva'
                          : isNew
                          ? 'Nueva Asignación'
                          : 'Aviso'}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {new Date(n.createdAt).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <h4 className="font-serif-elegant font-bold text-slate-900 text-xs sm:text-sm mt-1.5">
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Avisos diarios activos desde 5 días antes</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
