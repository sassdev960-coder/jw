import React, { useState } from 'react';
import { Assignment, AssignmentSection, MeetingType, Member } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  X, 
  BellRing, 
  MapPin, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { playGentleChime } from '../services/notificationService';

interface AdminAssignmentModalProps {
  members: Member[];
  initialDate?: string;
  onClose: () => void;
  onSaveAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>, sendImmediateNotif: boolean) => void;
}

const COMMON_PART_PRESETS: { title: string; section: AssignmentSection; meetingType: MeetingType }[] = [
  { title: 'Lectura de la Biblia', section: 'TESOROS', meetingType: 'ENTRE_SEMANA' },
  { title: 'Primera Conversación', section: 'MAESTROS', meetingType: 'ENTRE_SEMANA' },
  { title: 'Revisita', section: 'MAESTROS', meetingType: 'ENTRE_SEMANA' },
  { title: 'Curso Bíblico', section: 'MAESTROS', meetingType: 'ENTRE_SEMANA' },
  { title: 'Discurso de 10 min: Tesoros Bíblicos', section: 'TESOROS', meetingType: 'ENTRE_SEMANA' },
  { title: 'Perlas Escondidas (10 min)', section: 'TESOROS', meetingType: 'ENTRE_SEMANA' },
  { title: 'Discurso de Estudiante (5 min)', section: 'MAESTROS', meetingType: 'ENTRE_SEMANA' },
  { title: 'Estudio Bíblico de Congregación (Lector)', section: 'VIDA_CRISTIANA', meetingType: 'ENTRE_SEMANA' },
  { title: 'Lectura de La Atalaya', section: 'FIN_DE_SEMANA', meetingType: 'FIN_DE_SEMANA' },
  { title: 'Discurso Público', section: 'FIN_DE_SEMANA', meetingType: 'FIN_DE_SEMANA' },
  { title: 'Presidente de Reunión', section: 'FIN_DE_SEMANA', meetingType: 'FIN_DE_SEMANA' },
  { title: 'Oración Final', section: 'FIN_DE_SEMANA', meetingType: 'FIN_DE_SEMANA' },
  { title: 'Operador de Audio y Video', section: 'SERVICIOS_TURNOS', meetingType: 'ENTRE_SEMANA' },
  { title: 'Acomodador de Entrada y Auditorio', section: 'SERVICIOS_TURNOS', meetingType: 'ENTRE_SEMANA' },
  { title: 'Micrófonos de Pasillo', section: 'SERVICIOS_TURNOS', meetingType: 'ENTRE_SEMANA' },
  { title: 'Aseo y Limpieza del Salón', section: 'SERVICIOS_TURNOS', meetingType: 'LIMPIEZA' }
];

export const AdminAssignmentModal: React.FC<AdminAssignmentModalProps> = ({
  members,
  initialDate,
  onClose,
  onSaveAssignment
}) => {
  const [title, setTitle] = useState('');
  const [section, setSection] = useState<AssignmentSection>('MAESTROS');
  const [meetingType, setMeetingType] = useState<MeetingType>('ENTRE_SEMANA');
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [assigneeId, setAssigneeId] = useState(members[0]?.id || '');
  const [assistantId, setAssistantId] = useState('');
  const [hall, setHall] = useState<'Salón Principal' | 'Salón Auxiliar 1' | 'Salón Auxiliar 2' | 'General'>('Salón Principal');
  const [lessonOrStudy, setLessonOrStudy] = useState('');
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');
  const [sendImmediateNotif, setSendImmediateNotif] = useState(true);

  const selectedMember = members.find((m) => m.id === assigneeId);
  const selectedAssistant = members.find((m) => m.id === assistantId);

  const handleApplyPreset = (preset: typeof COMMON_PART_PRESETS[0]) => {
    setTitle(preset.title);
    setSection(preset.section);
    setMeetingType(preset.meetingType);
    if (preset.meetingType === 'FIN_DE_SEMANA') {
      setTime('10:00');
    } else {
      setTime('19:00');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assigneeId || !date) return;

    playGentleChime();
    onSaveAssignment(
      {
        title: title.trim(),
        section,
        meetingType,
        date,
        time,
        assigneeId,
        assigneeName: selectedMember ? selectedMember.name : '',
        assigneeRole: selectedMember ? selectedMember.role.replace('_', ' ') : '',
        assistantId: assistantId || undefined,
        assistantName: selectedAssistant ? selectedAssistant.name : undefined,
        hall,
        lessonOrStudy: lessonOrStudy.trim() || undefined,
        source: source.trim() || undefined,
        notes: notes.trim() || undefined,
        status: 'pendiente'
      },
      sendImmediateNotif
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="admin-assignment-dialog"
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 text-slate-800"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-elegant font-bold text-base tracking-wide">
                Programar Asignación Teocrática
              </h3>
              <p className="text-xs text-slate-400">
                Asignación de parte o turno con notificación automática
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick presets chip bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Plantillas de partes frecuentes:</span>
            </label>
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              {COMMON_PART_PRESETS.slice(0, 7).map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px] font-medium transition-colors"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título o Nombre de la Parte *
            </label>
            <input
              id="assignment-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Lectura de la Biblia (Salmo 84), Primera Conversación, Acomodador..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Section and Meeting Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sección del Programa
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as AssignmentSection)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
              >
                <option value="TESOROS">Tesoros de la Biblia</option>
                <option value="MAESTROS">Seamos Mejores Maestros</option>
                <option value="VIDA_CRISTIANA">Nuestra Vida Cristiana</option>
                <option value="FIN_DE_SEMANA">Reunión de Fin de Semana</option>
                <option value="SERVICIOS_TURNOS">Turnos y Servicios de Apoyo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo de Reunión
              </label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value as MeetingType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
              >
                <option value="ENTRE_SEMANA">Vida y Ministerio (Entre Semana)</option>
                <option value="FIN_DE_SEMANA">Discurso y La Atalaya (Fin de Semana)</option>
                <option value="LIMPIEZA">Limpieza y Mantenimiento</option>
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Fecha asignada *</span>
              </label>
              <input
                id="assignment-date-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Hora *</span>
              </label>
              <input
                id="assignment-time-input"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Assignee & Assistant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Hermano(a) Asignado(a) *</span>
              </label>
              <select
                id="assignment-assignee-select"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none font-medium"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ayudante (si aplica)
              </label>
              <select
                value={assistantId}
                onChange={(e) => setAssistantId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
              >
                <option value="">-- Sin ayudante --</option>
                {members
                  .filter((m) => m.id !== assigneeId)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Hall & Study point */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Salón / Ubicación</span>
              </label>
              <select
                value={hall}
                onChange={(e) => setHall(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
              >
                <option value="Salón Principal">Salón Principal</option>
                <option value="Salón Auxiliar 1">Salón Auxiliar 1</option>
                <option value="Salón Auxiliar 2">Salón Auxiliar 2</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Punto de Oratoria / Lección</span>
              </label>
              <input
                type="text"
                value={lessonOrStudy}
                onChange={(e) => setLessonOrStudy(e.target.value)}
                placeholder="Ej. Lección 7: Énfasis en ideas principales"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Source and notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fuente o Publicación
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Ej. mwb24.09 pág. 4 o Bosquejo 42"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notas / Instrucciones adicionales
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Llegar 15 min antes para probar micrófonos..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Notification Checkbox */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <BellRing className="w-4 h-4 text-amber-700" />
              <div>
                <p className="text-xs font-semibold text-amber-950">
                  Enviar notificación automática inmediata
                </p>
                <p className="text-[11px] text-amber-800/80">
                  Avisa al hermano de su nueva asignación y activará los recordatorios diarios desde 5 días antes.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={sendImmediateNotif}
              onChange={(e) => setSendImmediateNotif(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="submit-new-assignment-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              Guardar y Notificar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
