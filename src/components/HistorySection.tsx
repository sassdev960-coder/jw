import React, { useState } from 'react';
import { Assignment, AssignmentSection } from '../types';
import { formatSpanishDate } from '../services/notificationService';
import { 
  History, 
  Search, 
  CheckCircle2, 
  BookOpen, 
  User, 
  Calendar, 
  Award,
  Filter,
  Check
} from 'lucide-react';

interface HistorySectionProps {
  assignments: Assignment[];
  isAdmin: boolean;
  onMarkCompleted?: (id: string, notes?: string) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  assignments,
  isAdmin,
  onMarkCompleted
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');

  // Completed items sorted with most recent first
  const completedAssignments = assignments
    .filter((a) => a.status === 'completado')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filtered
  const filteredList = completedAssignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assigneeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.assistantName && a.assistantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.lessonOrStudy && a.lessonOrStudy.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSection =
      selectedSection === 'ALL' || a.section === selectedSection;

    return matchesSearch && matchesSection;
  });

  // Calculate stats
  const totalCompleted = completedAssignments.length;
  const uniqueParticipants = new Set(completedAssignments.map((a) => a.assigneeId)).size;

  return (
    <div className="space-y-4 text-slate-800 pb-8">
      {/* Header card with summary stats */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <History className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Registro Teocrático
            </span>
            <h2 className="font-serif-elegant text-xl font-bold text-slate-900">
              Historial de Asignaciones
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Registro de participaciones, discursos y turnos completados favorablemente en la congregación.
        </p>

        {/* Mini stats summary */}
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Partes Cumplidas
            </span>
            <p className="font-serif-elegant text-2xl font-bold text-slate-900 mt-0.5">
              {totalCompleted}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Hermanos Participantes
            </span>
            <p className="font-serif-elegant text-2xl font-bold text-amber-700 mt-0.5">
              {uniqueParticipants}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-200 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-history-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por hermano, discurso o lección..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Section categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'ALL', label: 'Todas' },
            { id: 'TESOROS', label: 'Tesoros' },
            { id: 'MAESTROS', label: 'Maestros' },
            { id: 'VIDA_CRISTIANA', label: 'Vida Cristiana' },
            { id: 'FIN_DE_SEMANA', label: 'Fin de Semana' },
            { id: 'SERVICIOS_TURNOS', label: 'Turnos y Servicios' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium text-xs transition-colors ${
                selectedSection === sec.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* List of completed assignments */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto opacity-30 text-slate-400" />
            <p className="text-xs">No se encontraron asignaciones completadas con ese criterio.</p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 transition-all hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center space-x-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Completada</span>
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {formatSpanishDate(item.date)}
                    </span>
                  </div>
                  <h3 className="font-serif-elegant font-bold text-slate-900 text-sm sm:text-base">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Assignee & Assistant */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    Asignado a: <strong className="text-slate-900">{item.assigneeName}</strong>
                    {item.assigneeRole && <span className="text-slate-400"> ({item.assigneeRole})</span>}
                  </span>
                </div>

                {item.assistantName && (
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Ayudante:</span>
                    <strong className="text-slate-900">{item.assistantName}</strong>
                  </div>
                )}
              </div>

              {/* Lesson point */}
              {item.lessonOrStudy && (
                <div className="flex items-center space-x-2 text-xs text-slate-600 px-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{item.lessonOrStudy}</span>
                </div>
              )}

              {/* Completion Notes from Superintendent / Elder */}
              {item.completionNotes && (
                <div className="text-xs bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl text-amber-900 flex items-start space-x-2">
                  <Award className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-950">Observación: </span>
                    <span>{item.completionNotes}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
