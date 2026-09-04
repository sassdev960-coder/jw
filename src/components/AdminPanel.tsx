import React, { useState } from 'react';
import { Assignment, Member } from '../types';
import { formatSpanishDate, calculateDaysDifference } from '../services/notificationService';
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  Trash2, 
  Share2, 
  BellRing, 
  AlertCircle,
  Users,
  Award,
  Filter,
  Cloud,
  Check,
  Shield,
  Lock,
  LogOut,
  ExternalLink,
  Sparkles,
  Database
} from 'lucide-react';
import { WhatsAppModal } from './WhatsAppModal';
import { AdminProfilesSection } from './AdminProfilesSection';

interface AdminPanelProps {
  assignments: Assignment[];
  members: Member[];
  onOpenCreateModal: () => void;
  onMarkCompleted: (id: string, notes?: string) => void;
  onDeleteAssignment: (id: string) => void;
  onSendBulkReminders: () => void;
  onSaveMember: (member: Member) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
  onSelectMemberToView: (id: string) => void;
  onLogoutAdmin?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  assignments,
  members,
  onOpenCreateModal,
  onMarkCompleted,
  onDeleteAssignment,
  onSendBulkReminders,
  onSaveMember,
  onDeleteMember,
  onSelectMemberToView,
  onLogoutAdmin
}) => {
  const [adminTab, setAdminTab] = useState<'assignments' | 'profiles' | 'cloud_sync'>('assignments');
  const [selectedShare, setSelectedShare] = useState<Assignment | null>(null);
  const [completingAssignment, setCompletingAssignment] = useState<Assignment | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [filterMeeting, setFilterMeeting] = useState<string>('ALL');

  // Active / pending assignments
  const activeAssignments = assignments
    .filter((a) => a.status !== 'completado' && a.status !== 'sustituido')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filtered = activeAssignments.filter((a) => {
    if (filterMeeting === 'ALL') return true;
    if (filterMeeting === 'ENTRE_SEMANA') return a.meetingType === 'ENTRE_SEMANA';
    if (filterMeeting === 'FIN_DE_SEMANA') return a.meetingType === 'FIN_DE_SEMANA';
    if (filterMeeting === 'TURNOS') return a.section === 'SERVICIOS_TURNOS';
    return true;
  });

  const handleConfirmCompletion = () => {
    if (!completingAssignment) return;
    onMarkCompleted(completingAssignment.id, completionNotes.trim() || 'Completada satisfactoriamente.');
    setCompletingAssignment(null);
    setCompletionNotes('');
  };

  return (
    <div className="space-y-4 text-slate-800 pb-8">
      {/* Top Admin Navigation Pill Switcher */}
      <div className="bg-slate-900 rounded-2xl p-1.5 flex items-center gap-1 shadow-md border border-slate-800 text-xs">
        <button
          onClick={() => setAdminTab('assignments')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 ${
            adminTab === 'assignments'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Asignaciones ({activeAssignments.length})</span>
        </button>

        <button
          id="tab-admin-profiles"
          onClick={() => setAdminTab('profiles')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 ${
            adminTab === 'profiles'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Perfiles & Enlaces ({members.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('cloud_sync')}
          className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-1 ${
            adminTab === 'cloud_sync'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Firebase Firestore en la nube"
        >
          <Cloud className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Firebase</span>
        </button>

        {onLogoutAdmin && (
          <button
            onClick={onLogoutAdmin}
            className="py-2 px-2.5 rounded-xl font-semibold text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
            title="Cerrar sesión de administrador"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* TAB 1: ASIGNACIONES Y TURNOS */}
      {adminTab === 'assignments' && (
        <div className="space-y-4">
          {/* Admin Action Header Card */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-md border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  Superintendencia de Reuniones
                </span>
                <h2 className="font-serif-elegant text-xl font-bold text-white">
                  Gestión de Asignaciones y Turnos
                </h2>
              </div>

              <button
                id="admin-create-assignment-btn"
                onClick={onOpenCreateModal}
                className="flex items-center space-x-1.5 py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Asignar Parte</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Programe partes de Entre Semana, Fin de Semana y turnos de apoyo. Todos los datos se sincronizan automáticamente en Firebase Firestore y se notifican al publicador.
            </p>

            {/* Quick reminder dispatch bar */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-400">
                <BellRing className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeAssignments.length} asignaciones activas en programa</span>
              </div>

              <button
                onClick={onSendBulkReminders}
                className="text-xs text-amber-300 hover:text-amber-200 font-semibold underline"
              >
                Verificar avisos del día
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200 flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setFilterMeeting('ALL')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                filterMeeting === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({activeAssignments.length})
            </button>
            <button
              onClick={() => setFilterMeeting('ENTRE_SEMANA')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                filterMeeting === 'ENTRE_SEMANA'
                  ? 'bg-sky-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Vida y Ministerio
            </button>
            <button
              onClick={() => setFilterMeeting('FIN_DE_SEMANA')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                filterMeeting === 'FIN_DE_SEMANA'
                  ? 'bg-indigo-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Fin de Semana
            </button>
            <button
              onClick={() => setFilterMeeting('TURNOS')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                filterMeeting === 'TURNOS'
                  ? 'bg-emerald-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Turnos y Servicios
            </button>
          </div>

          {/* Assignments List */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 mx-auto opacity-30 text-slate-400" />
                <p className="text-xs">No hay asignaciones programadas en esta categoría.</p>
              </div>
            ) : (
              filtered.map((asg) => {
                const daysRemaining = calculateDaysDifference(asg.date);
                const formattedDate = formatSpanishDate(asg.date);

                return (
                  <div
                    key={asg.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {asg.hall}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            daysRemaining <= 1
                              ? 'bg-rose-100 text-rose-800 font-bold'
                              : daysRemaining <= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {daysRemaining === 0
                              ? 'Hoy'
                              : daysRemaining === 1
                              ? 'Mañana'
                              : `En ${daysRemaining} días`}
                          </span>
                        </div>

                        <h3 className="font-serif-elegant font-bold text-sm sm:text-base text-slate-900">
                          {asg.title}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedShare(asg)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                          title="Compartir por WhatsApp"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteAssignment(asg.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Eliminar asignación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{formattedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{asg.time} hrs</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                        <User className="w-3.5 h-3.5 text-amber-600" />
                        <span>{asg.assigneeName}</span>
                        {asg.assistantName && (
                          <span className="text-slate-400 font-normal">
                            (Ayudante: {asg.assistantName})
                          </span>
                        )}
                      </div>

                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        asg.status === 'confirmado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {asg.status}
                      </span>
                    </div>

                    {/* Action button to complete */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setCompletingAssignment(asg)}
                        className="flex items-center space-x-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Marcar como Cumplida</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PERFILES DE PUBLICADORES Y ENLACES PERSONALES */}
      {adminTab === 'profiles' && (
        <AdminProfilesSection
          members={members}
          assignments={assignments}
          onSaveMember={onSaveMember}
          onDeleteMember={onDeleteMember}
          onSelectMemberToView={onSelectMemberToView}
        />
      )}

      {/* TAB 3: FIREBASE CLOUD SYNC & SEGURIDAD */}
      {adminTab === 'cloud_sync' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200 space-y-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  Activo & Sincronizado
                </span>
              </div>
              <h3 className="font-serif-elegant text-lg font-bold text-slate-900 mt-0.5">
                Almacenamiento en Firebase Firestore
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Todas las asignaciones, turnos y perfiles de hermanos se almacenan de manera persistente en la nube de Google Cloud / Firebase Firestore. Cualquier cambio se replica en tiempo real en todos los dispositivos conectados (teléfonos móviles, tabletas o computadoras).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Colección de Perfiles
              </span>
              <p className="font-bold text-slate-800 text-sm">
                {members.length} Publicadores registrados
              </p>
              <p className="text-[11px] text-slate-500">
                Almacenados en <code>/members</code> con sus privilegios y teléfonos.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Colección de Asignaciones
              </span>
              <p className="font-bold text-slate-800 text-sm">
                {assignments.length} Asignaciones históricas y activas
              </p>
              <p className="text-[11px] text-slate-500">
                Almacenados en <code>/assignments</code> con estatus en tiempo real.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-950">
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Seguridad y Clave de Administrador</span>
            </div>
            <p className="leading-relaxed">
              La contraseña maestra para entrar al panel de administración es <code className="bg-amber-200/80 px-2 py-0.5 rounded font-mono font-bold text-amber-950">123456789</code>.
            </p>
            <p className="text-[11px] text-amber-800">
              Los publicadores que ingresan a través de su propio enlace personal tienen acceso directo a sus partes, cuenta regresiva y confirmación de asistencia, sin riesgo de modificar la base general.
            </p>
          </div>

          {onLogoutAdmin && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={onLogoutAdmin}
                className="flex items-center space-x-1.5 py-2 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bloquear y Cerrar Sesión de Administrador</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Completion Notes Modal */}
      {completingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-elegant font-bold text-sm text-slate-900">
                  Marcar Asignación como Cumplida
                </h4>
                <p className="text-xs text-slate-500 truncate max-w-[220px]">
                  {completingAssignment.title}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observaciones del Superintendente (opcional):
              </label>
              <textarea
                rows={3}
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Ej: Excelente aplicación del punto de oratoria, buena dicción y contacto visual..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCompletingAssignment(null)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCompletion}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs"
              >
                Guardar en Historial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Share Modal */}
      {selectedShare && (
        <WhatsAppModal
          assignment={selectedShare}
          onClose={() => setSelectedShare(null)}
        />
      )}
    </div>
  );
};
