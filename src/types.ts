export type AssignmentSection =
  | 'TESOROS'
  | 'MAESTROS'
  | 'VIDA_CRISTIANA'
  | 'PRESIDENCIA_ORACION'
  | 'FIN_DE_SEMANA'
  | 'SERVICIOS_TURNOS';

export type MeetingType =
  | 'ENTRE_SEMANA' // Vida y Ministerio Cristianos
  | 'FIN_DE_SEMANA' // Discurso Público y La Atalaya
  | 'LIMPIEZA'; // Aseo del Salón

export type AssignmentStatus =
  | 'pendiente'
  | 'confirmado'
  | 'completado'
  | 'sustituido';

export interface Assignment {
  id: string;
  title: string;
  section: AssignmentSection;
  meetingType: MeetingType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  assigneeId: string;
  assigneeName: string;
  assigneeRole?: string;
  assistantId?: string;
  assistantName?: string;
  hall: 'Salón Principal' | 'Salón Auxiliar 1' | 'Salón Auxiliar 2' | 'General';
  lessonOrStudy?: string;
  source?: string;
  notes?: string;
  status: AssignmentStatus;
  completedAt?: string;
  completionNotes?: string;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  gender: 'M' | 'F';
  role: 'anciano' | 'siervo_ministerial' | 'publicador' | 'precursor';
  phone?: string;
  privileges: string[];
  createdAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string; // member id or 'all'
  assignmentId: string;
  title: string;
  message: string;
  type: 'new_assignment' | 'countdown' | 'reminder' | 'status_update';
  daysRemaining?: number;
  dateTarget: string; // YYYY-MM-DD
  createdAt: string;
  read: boolean;
}

export type ActiveTab = 'inicio' | 'calendario' | 'asignar' | 'historial';
