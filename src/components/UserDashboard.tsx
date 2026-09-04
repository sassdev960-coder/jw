import React, { useState } from 'react';
import { Assignment, Member } from '../types';
import { calculateDaysDifference, formatSpanishDate, formatShortDate } from '../services/notificationService';
import { NextAssignmentCard } from './NextAssignmentCard';
import { 
  BellRing, 
  Calendar, 
  Clock, 
  UserCheck, 
  BookOpen, 
  CheckCircle2, 
  CheckCircle, 
  AlertCircle,
  Shield, 
  Sparkles,
  Share2,
  ChevronRight
} from 'lucide-react';
import { WhatsAppModal } from './WhatsAppModal';

interface UserDashboardProps {
  currentMember: Member;
  assignments: Assignment[];
  onToggleStatus: (id: string, newStatus: 'pendiente' | 'confirmado') => void;
  onNavigateToCalendar: () => void;
  onOpenNotifications: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentMember,
  assignments,
  onToggleStatus,
  onNavigateToCalendar,
  onOpenNotifications
}) => {
  const [selectedShareAssignment, setSelectedShareAssignment] = useState<Assignment | null>(null);

  // Filter future assignments assigned to this brother (as primary or assistant)
  const myUpcomingAssignments = assignments
    .filter((a) => {
      const isAssigned = a.assigneeId === currentMember.id || a.assistantId === currentMember.id;
      const isFuture = a.status !== 'completado' && a.status !== 'sustituido';
      return isAssigned && isFuture;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // The very NEXT scheduled assignment
  const nextAssignment = myUpcomingAssignments[0] || null;

  // The remaining assignments after the first
  const remainingAssignments = myUpcomingAssignments.slice(1);

  // Turnos de apoyo (servicios)
  const mySupportTurns = myUpcomingAssignments.filter(
    (a) => a.section === 'SERVICIOS_TURNOS'
  );

  const daysToNext = nextAssignment ? calculateDaysDifference(nextAssignment.date) : -1;

  return (
    <div className="space-y-4 text-slate-800 pb-8">
      {/* Devotional / Scriptural Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-xs border border-slate-800 flex items-start space-x-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 mt-0.5 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] font-medium text-amber-300 tracking-wide uppercase">
            Hermano(a) {currentMember.name} • {currentMember.role.replace('_', ' ')}
          </p>
          <blockquote className="font-serif-elegant italic text-xs sm:text-sm text-slate-200 leading-relaxed">
            "Cualquier cosa que hagan, háganla de toda alma como para Jehová y no para los hombres."
          </blockquote>
          <p className="text-[10px] text-slate-400 font-semibold">— Colosenses 3:23</p>
        </div>
      </div>

      {/* 5-day active notification alert banner if applicable */}
      {nextAssignment && daysToNext >= 0 && daysToNext <= 5 && (
        <div 
          onClick={onOpenNotifications}
          className="bg-amber-50 border border-amber-300/80 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-amber-100/80 transition-colors shadow-xs"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-200/80 text-amber-900">
              <BellRing className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">
                {daysToNext === 0
                  ? '¡Aviso diario: Hoy es tu asignación!'
                  : daysToNext === 1
                  ? '¡Aviso diario: Mañana es tu asignación!'
                  : `Aviso diario: Faltan ${daysToNext} días para tu asignación`}
              </p>
              <p className="text-[11px] text-amber-800">
                Avisos automáticos activos diariamente. Toca para ver detalles.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-700" />
        </div>
      )}

      {/* 1. ALWAYS VISIBLE: Prominently pinned NEXT scheduled assignment */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-serif-elegant font-bold text-slate-900 text-sm tracking-wide">
            Próxima Asignación Programada
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Fecha y Hora Fijadas
          </span>
        </div>

        <NextAssignmentCard
          assignment={nextAssignment}
          onToggleStatus={onToggleStatus}
          onNavigateToCalendar={onNavigateToCalendar}
        />
      </div>

      {/* 2. Other upcoming assignments in pipeline */}
      {remainingAssignments.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-serif-elegant font-bold text-slate-900 text-sm">
              Siguientes Asignaciones en Lista ({remainingAssignments.length})
            </h3>
            <button
              onClick={onNavigateToCalendar}
              className="text-xs text-amber-800 font-semibold hover:underline"
            >
              Ver en calendario
            </button>
          </div>

          <div className="space-y-2.5">
            {remainingAssignments.map((asg) => {
              const daysDiff = calculateDaysDifference(asg.date);
              const formattedDate = formatSpanishDate(asg.date);

              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {asg.hall}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {formattedDate} • {asg.time} hrs
                        </span>
                      </div>
                      <h4 className="font-serif-elegant font-bold text-slate-900 text-sm sm:text-base">
                        {asg.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setSelectedShareAssignment(asg)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Compartir recordatorio"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {asg.lessonOrStudy && (
                    <div className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg flex items-center space-x-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{asg.lessonOrStudy}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      {daysDiff > 0 ? `En ${daysDiff} días` : 'Próximamente'}
                    </span>

                    <button
                      onClick={() => onToggleStatus(
                        asg.id,
                        asg.status === 'confirmado' ? 'pendiente' : 'confirmado'
                      )}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1 ${
                        asg.status === 'confirmado'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{asg.status === 'confirmado' ? 'Confirmada' : 'Pendiente'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Turnos de servicio y apoyo específicos */}
      {mySupportTurns.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center space-x-2 px-1">
            <Shield className="w-4 h-4 text-indigo-700" />
            <h3 className="font-serif-elegant font-bold text-slate-900 text-sm">
              Turnos y Servicios de Apoyo Asignados
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {mySupportTurns.map((turn) => (
              <div
                key={turn.id}
                className="bg-indigo-50/50 border border-indigo-200/80 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950 text-xs">{turn.title}</span>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    {turn.time} hrs
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  📅 {formatSpanishDate(turn.date)}
                </p>
                {turn.notes && (
                  <p className="text-[10px] text-slate-500 italic">
                    Nota: {turn.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {selectedShareAssignment && (
        <WhatsAppModal
          assignment={selectedShareAssignment}
          onClose={() => setSelectedShareAssignment(null)}
        />
      )}
    </div>
  );
};
