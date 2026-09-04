import React, { useState } from 'react';
import { Assignment } from '../types';
import { calculateDaysDifference, formatSpanishDate } from '../services/notificationService';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  UserCheck, 
  CheckCircle2, 
  Share2, 
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { WhatsAppModal } from './WhatsAppModal';

interface NextAssignmentCardProps {
  assignment?: Assignment | null;
  onToggleStatus?: (id: string, newStatus: 'pendiente' | 'confirmado') => void;
  onNavigateToCalendar?: () => void;
}

export const NextAssignmentCard: React.FC<NextAssignmentCardProps> = ({
  assignment,
  onToggleStatus,
  onNavigateToCalendar
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPreparationTips, setShowPreparationTips] = useState(false);

  if (!assignment) {
    return (
      <div 
        id="no-next-assignment-card"
        className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/90 shadow-xs text-center space-y-3"
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif-elegant text-lg font-semibold text-slate-800">
          Sin asignaciones pendientes
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Actualmente no tienes partes programadas en las próximas reuniones. Puedes consultar el calendario mensual general.
        </p>
        {onNavigateToCalendar && (
          <button
            onClick={onNavigateToCalendar}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 pt-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Ver programa completo del mes</span>
          </button>
        )}
      </div>
    );
  }

  const daysRemaining = calculateDaysDifference(assignment.date);
  const formattedDate = formatSpanishDate(assignment.date);

  // Determine countdown badge styling
  let countdownLabel = '';
  let badgeClasses = '';

  if (daysRemaining < 0) {
    countdownLabel = 'Fecha pasada';
    badgeClasses = 'bg-slate-100 text-slate-600 border-slate-200';
  } else if (daysRemaining === 0) {
    countdownLabel = '¡HOY ES TU ASIGNACIÓN!';
    badgeClasses = 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse font-bold';
  } else if (daysRemaining === 1) {
    countdownLabel = '¡MAÑANA!';
    badgeClasses = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
  } else if (daysRemaining <= 5) {
    countdownLabel = `FALTAN ${daysRemaining} DÍAS`;
    badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
  } else {
    countdownLabel = `EN ${daysRemaining} DÍAS`;
    badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
  }

  const getSectionBadge = () => {
    switch (assignment.section) {
      case 'TESOROS':
        return { label: 'Tesoros de la Biblia', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'MAESTROS':
        return { label: 'Seamos Mejores Maestros', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'VIDA_CRISTIANA':
        return { label: 'Nuestra Vida Cristiana', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'FIN_DE_SEMANA':
        return { label: 'Reunión de Fin de Semana', color: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'SERVICIOS_TURNOS':
        return { label: 'Turno de Apoyo', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      default:
        return { label: 'Programa de Reunión', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const sectionInfo = getSectionBadge();

  return (
    <>
      <div 
        id="prominent-next-assignment-card"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-5 sm:p-6 shadow-xl border border-slate-800"
      >
        {/* Decorative subtle ambient glow */}
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-44 h-44 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header with Prominence */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider font-semibold border bg-white/10 text-amber-300 border-amber-500/30">
              Próxima Asignación
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] tracking-wide border ${badgeClasses}`}>
              {countdownLabel}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowShareModal(true)}
              title="Compartir o copiar recordatorio"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section title & Main Title */}
        <div className="relative z-10 space-y-1.5 mb-4">
          <p className="text-[11px] font-medium tracking-wide text-amber-400/90 uppercase">
            {sectionInfo.label} • {assignment.hall}
          </p>
          <h2 className="font-serif-elegant text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
            {assignment.title}
          </h2>
        </div>

        {/* Key Time & Date Strip */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs mb-4">
          <div className="flex items-center space-x-2.5 text-slate-200">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Fecha de la Reunión</p>
              <p className="text-xs font-semibold capitalize text-slate-100">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 text-slate-200">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Hora Programada</p>
              <p className="text-xs font-semibold text-slate-100">{assignment.time} hrs</p>
            </div>
          </div>
        </div>

        {/* Details: Assistant, Study Point, Source */}
        <div className="relative z-10 space-y-2 text-xs text-slate-300 mb-5">
          {assignment.assistantName && (
            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg">
              <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-slate-400">Ayudante asignado:</span>
              <span className="font-medium text-white">{assignment.assistantName}</span>
            </div>
          )}

          {assignment.lessonOrStudy && (
            <div className="flex items-start space-x-2 bg-white/5 px-3 py-1.5 rounded-lg">
              <BookOpen className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400">Punto de oratoria: </span>
                <span className="text-slate-200 font-medium">{assignment.lessonOrStudy}</span>
              </div>
            </div>
          )}

          {assignment.source && (
            <div className="flex items-center space-x-2 px-3 py-1 text-slate-400 text-[11px]">
              <span className="font-semibold text-slate-300">Fuente:</span>
              <span>{assignment.source}</span>
            </div>
          )}

          {assignment.notes && (
            <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200/90 text-[11px] leading-relaxed">
              <span className="font-semibold">Nota: </span>{assignment.notes}
            </div>
          )}
        </div>

        {/* Preparation guidance toggle */}
        <div className="relative z-10 mb-4 border-t border-white/10 pt-3">
          <button
            onClick={() => setShowPreparationTips(!showPreparationTips)}
            className="w-full flex items-center justify-between text-xs text-amber-300/90 hover:text-amber-200 transition-colors py-1"
          >
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">Sugerencias para una preparación eficaz</span>
            </span>
            {showPreparationTips ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showPreparationTips && (
            <div className="mt-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 space-y-2 leading-relaxed animate-in fade-in duration-200">
              <p>• <strong>Oración:</strong> Comience pidiéndole espíritu santo a Jehová para transmitir ideas que edifiquen a la congregación.</p>
              <p>• <strong>Ensayos:</strong> Cronometre su lectura o demostración. Es preferible terminar 15 segundos antes que pasarse del tiempo.</p>
              <p>• <strong>Punto de lección:</strong> Concéntrese en aplicar la cualidad asignada (énfasis, preguntas, contacto visual).</p>
            </div>
          )}
        </div>

        {/* Action Buttons: Confirm Attendance */}
        <div className="relative z-10 flex items-center justify-between pt-1 gap-2">
          {onToggleStatus && (
            <button
              id="confirm-assignment-status-btn"
              onClick={() => onToggleStatus(
                assignment.id,
                assignment.status === 'confirmado' ? 'pendiente' : 'confirmado'
              )}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                assignment.status === 'confirmado'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold shadow-md'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {assignment.status === 'confirmado' ? 'Asignación Confirmada' : 'Confirmar que podré cumplirla'}
              </span>
            </button>
          )}

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartir</span>
          </button>
        </div>
      </div>

      {showShareModal && (
        <WhatsAppModal
          assignment={assignment}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};
