import React, { useState } from 'react';
import { Assignment, Member } from '../types';
import { formatSpanishDate } from '../services/notificationService';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Plus,
  Share2,
  Calendar as CalendarIcon,
  CheckCircle2
} from 'lucide-react';
import { WhatsAppModal } from './WhatsAppModal';

interface VisualCalendarProps {
  assignments: Assignment[];
  members: Member[];
  currentUserId: string;
  isAdmin: boolean;
  onOpenAssignModalForDate?: (dateStr: string) => void;
  onToggleStatus?: (id: string, newStatus: 'pendiente' | 'confirmado') => void;
}

export const VisualCalendar: React.FC<VisualCalendarProps> = ({
  assignments,
  members,
  currentUserId,
  isAdmin,
  onOpenAssignModalForDate,
  onToggleStatus
}) => {
  // Calendar month state
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  const [filterMode, setFilterMode] = useState<'all' | 'mine' | 'midweek' | 'weekend'>('all');
  const [shareAssignment, setShareAssignment] = useState<Assignment | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setSelectedDateStr(`${y}-${m}-${d}`);
  };

  // Month details
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  // Grid calculation (Monday as first day of week)
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Day of week index (0=Sun, 1=Mon, ..., 6=Sat) converted to Monday=0
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastDayOfMonth.getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  // Filter assignments based on filterMode
  const filteredAssignments = assignments.filter((asg) => {
    if (filterMode === 'mine') {
      return asg.assigneeId === currentUserId || asg.assistantId === currentUserId;
    }
    if (filterMode === 'midweek') {
      return asg.meetingType === 'ENTRE_SEMANA';
    }
    if (filterMode === 'weekend') {
      return asg.meetingType === 'FIN_DE_SEMANA';
    }
    return true;
  });

  // Map assignments by date
  const assignmentsByDate: Record<string, Assignment[]> = {};
  filteredAssignments.forEach((asg) => {
    if (!assignmentsByDate[asg.date]) {
      assignmentsByDate[asg.date] = [];
    }
    assignmentsByDate[asg.date].push(asg);
  });

  const selectedDayAssignments = assignmentsByDate[selectedDateStr] || [];

  return (
    <div className="space-y-4 text-slate-800 pb-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
              Programa Mensual
            </span>
            <h2 className="font-serif-elegant text-xl font-bold capitalize text-slate-900">
              {monthName}
            </h2>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({assignments.length})
          </button>
          <button
            onClick={() => setFilterMode('mine')}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
              filterMode === 'mine'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Solo mis partes
          </button>
          <button
            onClick={() => setFilterMode('midweek')}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
              filterMode === 'midweek'
                ? 'bg-sky-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Entre Semana
          </button>
          <button
            onClick={() => setFilterMode('weekend')}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
              filterMode === 'weekend'
                ? 'bg-indigo-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Fin de Semana
          </button>
        </div>
      </div>

      {/* Visual Calendar Grid Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <span>Lun</span>
          <span>Mar</span>
          <span>Mié</span>
          <span>Jue</span>
          <span>Vie</span>
          <span className="text-amber-700">Sáb</span>
          <span className="text-amber-700">Dom</span>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {daysArray.map((dayNum, index) => {
            if (dayNum === null) {
              return <div key={`empty-${index}`} className="h-10 sm:h-12 rounded-lg" />;
            }

            const mStr = String(month + 1).padStart(2, '0');
            const dStr = String(dayNum).padStart(2, '0');
            const dateStr = `${year}-${mStr}-${dStr}`;

            const isSelected = dateStr === selectedDateStr;
            const now = new Date();
            const isToday =
              now.getFullYear() === year &&
              now.getMonth() === month &&
              now.getDate() === dayNum;

            const dayAssignments = assignmentsByDate[dateStr] || [];
            const hasAssignments = dayAssignments.length > 0;
            const hasMyAssignment = dayAssignments.some(
              (a) => a.assigneeId === currentUserId || a.assistantId === currentUserId
            );

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`h-11 sm:h-14 rounded-xl flex flex-col items-center justify-between p-1 text-xs relative transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md font-bold'
                    : isToday
                    ? 'bg-amber-50 text-amber-900 border border-amber-300 font-bold'
                    : hasAssignments
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-[11px]">{dayNum}</span>

                {/* Indicator dots */}
                {hasAssignments && (
                  <div className="flex items-center space-x-0.5 mt-0.5">
                    {hasMyAssignment && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ring-1 ring-white" />
                    )}
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-300' : 'bg-slate-400'
                      }`}
                    />
                    {dayAssignments.length > 1 && (
                      <span className="text-[8px] opacity-75 font-mono">
                        +{dayAssignments.length}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 pt-4 mt-3 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 ring-1 ring-amber-300" />
            <span>Asignación mía</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Otras partes programadas</span>
          </div>
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-serif-elegant font-bold text-slate-900 text-base capitalize">
              {formatSpanishDate(selectedDateStr)}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedDayAssignments.length === 0
                ? 'No hay reuniones ni asignaciones programadas para este día.'
                : `${selectedDayAssignments.length} parte(s) programada(s)`}
            </p>
          </div>

          {isAdmin && onOpenAssignModalForDate && (
            <button
              onClick={() => onOpenAssignModalForDate(selectedDateStr)}
              className="inline-flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Programar parte</span>
            </button>
          )}
        </div>

        {selectedDayAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-400 space-y-2">
            <CalendarIcon className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
            <p className="text-xs">Día libre de asignaciones en este calendario.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDayAssignments.map((asg) => {
              const isMine = asg.assigneeId === currentUserId || asg.assistantId === currentUserId;
              return (
                <div
                  key={asg.id}
                  className={`bg-white rounded-2xl p-4 border transition-all ${
                    isMine
                      ? 'border-amber-400/80 shadow-xs ring-1 ring-amber-300/40'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {asg.hall}
                        </span>
                        {isMine && (
                          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            Tu Asignación
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-semibold flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{asg.time} hrs</span>
                        </span>
                      </div>
                      <h4 className="font-serif-elegant text-sm sm:text-base font-bold text-slate-900 pt-0.5">
                        {asg.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => setShareAssignment(asg)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors"
                      title="Compartir o enviar recordatorio"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center space-x-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Asignado a: <strong className="text-slate-800">{asg.assigneeName}</strong>
                      </span>
                    </div>

                    {asg.assistantName && (
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Ayudante:</span>
                        <strong className="text-slate-800">{asg.assistantName}</strong>
                      </div>
                    )}
                  </div>

                  {asg.lessonOrStudy && (
                    <div className="mt-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg flex items-center space-x-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{asg.lessonOrStudy}</span>
                    </div>
                  )}

                  {onToggleStatus && isMine && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Estado:</span>
                      <button
                        onClick={() => onToggleStatus(
                          asg.id,
                          asg.status === 'confirmado' ? 'pendiente' : 'confirmado'
                        )}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-colors ${
                          asg.status === 'confirmado'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{asg.status === 'confirmado' ? 'Confirmada' : 'Confirmar'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {shareAssignment && (
        <WhatsAppModal
          assignment={shareAssignment}
          onClose={() => setShareAssignment(null)}
        />
      )}
    </div>
  );
};
