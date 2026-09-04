import { Assignment, Member } from '../types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Carlos Morales',
    gender: 'M',
    role: 'siervo_ministerial',
    phone: '+34 612 345 678',
    privileges: ['discursos', 'lectura_biblia', 'audio_video', 'acomodador', 'oracion']
  },
  {
    id: 'm2',
    name: 'David Benítez',
    gender: 'M',
    role: 'anciano',
    phone: '+34 622 456 789',
    privileges: ['discursos', 'presidente', 'atalaya_conductor', 'oracion']
  },
  {
    id: 'm3',
    name: 'Elena Ortiz',
    gender: 'F',
    role: 'precursor',
    phone: '+34 633 567 890',
    privileges: ['maestros_conversacion', 'maestros_discipulos']
  },
  {
    id: 'm4',
    name: 'Sofía Martínez',
    gender: 'F',
    role: 'publicador',
    phone: '+34 644 678 901',
    privileges: ['maestros_conversacion']
  },
  {
    id: 'm5',
    name: 'Marcos Rivas',
    gender: 'M',
    role: 'siervo_ministerial',
    phone: '+34 655 789 012',
    privileges: ['lectura_atalaya', 'audio_video', 'microfonos', 'acomodador']
  },
  {
    id: 'm6',
    name: 'Gabriel Navarro',
    gender: 'M',
    role: 'anciano',
    phone: '+34 666 890 123',
    privileges: ['discursos', 'presidente', 'atalaya_conductor', 'oracion']
  },
  {
    id: 'm7',
    name: 'Lucía Fernández',
    gender: 'F',
    role: 'precursor',
    phone: '+34 677 901 234',
    privileges: ['maestros_conversacion', 'maestros_discipulos']
  },
  {
    id: 'm8',
    name: 'Mateo Castillo',
    gender: 'M',
    role: 'publicador',
    phone: '+34 688 012 345',
    privileges: ['microfonos', 'aseo', 'lectura_biblia']
  }
];

// Helper to get formatted YYYY-MM-DD offset from today
export const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getInitialAssignments = (): Assignment[] => [
  {
    id: 'asg-1',
    title: 'Lectura de la Biblia (Salmo 84 a 86)',
    section: 'TESOROS',
    meetingType: 'ENTRE_SEMANA',
    date: getRelativeDate(3), // In 3 days!
    time: '19:15',
    assigneeId: 'm1',
    assigneeName: 'Carlos Morales',
    assigneeRole: 'Siervo Ministerial',
    hall: 'Salón Principal',
    lessonOrStudy: 'Lección 7: Énfasis en las ideas principales',
    source: 'mwb24.09 pág. 4',
    notes: 'Por favor cuidar el tiempo asignado (4 minutos) y modular bien la voz.',
    status: 'confirmado',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-2',
    title: 'Primera Conversación: Cómo consuela la Biblia',
    section: 'MAESTROS',
    meetingType: 'ENTRE_SEMANA',
    date: getRelativeDate(3),
    time: '19:25',
    assigneeId: 'm3',
    assigneeName: 'Elena Ortiz',
    assigneeRole: 'Precursora Regular',
    assistantId: 'm4',
    assistantName: 'Sofía Martínez',
    hall: 'Salón Principal',
    lessonOrStudy: 'Lección 1: Contacto visual y amabilidad',
    source: 'Seamos Mejores Maestros - mwb24.09',
    notes: 'Preparar una introducción sencilla y dejar pregunta pendiente para la revisita.',
    status: 'pendiente',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-3',
    title: 'Operador de Audio y Video',
    section: 'SERVICIOS_TURNOS',
    meetingType: 'ENTRE_SEMANA',
    date: getRelativeDate(3),
    time: '18:45',
    assigneeId: 'm5',
    assigneeName: 'Marcos Rivas',
    assigneeRole: 'Siervo Ministerial',
    hall: 'Salón Principal',
    notes: 'Llegar 15 minutos antes para probar la transmisión híbrida y micrófonos.',
    status: 'confirmado',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-4',
    title: 'Discurso Público: ¿Tiene usted fe en las promesas divinas?',
    section: 'FIN_DE_SEMANA',
    meetingType: 'FIN_DE_SEMANA',
    date: getRelativeDate(5), // In 5 days!
    time: '10:00',
    assigneeId: 'm2',
    assigneeName: 'David Benítez',
    assigneeRole: 'Anciano',
    hall: 'Salón Principal',
    source: 'Bosquejo Núm. 42',
    notes: 'Discurso de 30 minutos. Utilizar ilustraciones claras.',
    status: 'confirmado',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-5',
    title: 'Acomodador de Auditorio y Puerta Principal',
    section: 'SERVICIOS_TURNOS',
    meetingType: 'FIN_DE_SEMANA',
    date: getRelativeDate(5), // In 5 days!
    time: '09:30',
    assigneeId: 'm1',
    assigneeName: 'Carlos Morales',
    assigneeRole: 'Siervo Ministerial',
    hall: 'Salón Principal',
    notes: 'Dar la bienvenida con afecto a los visitantes y registrar la asistencia.',
    status: 'pendiente',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-6',
    title: 'Lectura de La Atalaya: "Sigamos buscando la paz"',
    section: 'FIN_DE_SEMANA',
    meetingType: 'FIN_DE_SEMANA',
    date: getRelativeDate(5),
    time: '10:40',
    assigneeId: 'm5',
    assigneeName: 'Marcos Rivas',
    assigneeRole: 'Siervo Ministerial',
    hall: 'Salón Principal',
    source: 'La Atalaya de Estudio, Julio 2024, art. 30',
    notes: 'Pronunciación clara y ritmo pausado en los párrafos clave.',
    status: 'pendiente',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-7',
    title: 'Explicación de Creencias (Discurso estudiantil)',
    section: 'MAESTROS',
    meetingType: 'ENTRE_SEMANA',
    date: getRelativeDate(10),
    time: '19:35',
    assigneeId: 'm7',
    assigneeName: 'Lucía Fernández',
    assigneeRole: 'Precursora Regular',
    assistantId: 'm3',
    assistantName: 'Elena Ortiz',
    hall: 'Salón Auxiliar 1',
    lessonOrStudy: 'Lección 12: Argumentación lógica',
    source: 'mwb24.09 pág. 6',
    notes: 'Demostración de 5 minutos explicando por qué Dios permite el sufrimiento.',
    status: 'pendiente',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-8',
    title: 'Aseo y Desinfección del Salón (Grupo 2)',
    section: 'SERVICIOS_TURNOS',
    meetingType: 'LIMPIEZA',
    date: getRelativeDate(6),
    time: '11:45',
    assigneeId: 'm8',
    assigneeName: 'Mateo Castillo',
    assigneeRole: 'Publicador',
    hall: 'General',
    notes: 'Limpieza de sanitarios y aspirado del pasillo central.',
    status: 'confirmado',
    createdAt: new Date().toISOString()
  },
  // Completed past assignments for history
  {
    id: 'asg-hist-1',
    title: 'Discurso de 10 min: Tesoros de la Palabra de Dios',
    section: 'TESOROS',
    meetingType: 'ENTRE_SEMANA',
    date: getRelativeDate(-4),
    time: '19:05',
    assigneeId: 'm6',
    assigneeName: 'Gabriel Navarro',
    assigneeRole: 'Anciano',
    hall: 'Salón Principal',
    source: 'mwb24.08 pág. 2',
    status: 'completado',
    completedAt: getRelativeDate(-4),
    completionNotes: 'Excelente aplicación práctica. Tiempo exacto.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-hist-2',
    title: 'Haga Discípulos (Revisita)',
    section: 'MAESTROS',
    meetingType: 'ENTRE_SEMANA',
    date: getRelativeDate(-4),
    time: '19:30',
    assigneeId: 'm3',
    assigneeName: 'Elena Ortiz',
    assigneeRole: 'Precursora Regular',
    assistantId: 'm7',
    assistantName: 'Lucía Fernández',
    hall: 'Salón Principal',
    lessonOrStudy: 'Lección 5: Uso eficaz de textos bíblicos',
    status: 'completado',
    completedAt: getRelativeDate(-4),
    completionNotes: 'Punto de oratoria cumplido satisfactoriamente.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-hist-3',
    title: 'Lectura de La Atalaya',
    section: 'FIN_DE_SEMANA',
    meetingType: 'FIN_DE_SEMANA',
    date: getRelativeDate(-7),
    time: '10:40',
    assigneeId: 'm1',
    assigneeName: 'Carlos Morales',
    assigneeRole: 'Siervo Ministerial',
    hall: 'Salón Principal',
    source: 'La Atalaya, edición de estudio, art. 28',
    status: 'completado',
    completedAt: getRelativeDate(-7),
    completionNotes: 'Lectura fluida y reverente.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-hist-4',
    title: 'Micrófonos de Pasillo',
    section: 'SERVICIOS_TURNOS',
    meetingType: 'FIN_DE_SEMANA',
    date: getRelativeDate(-7),
    time: '10:00',
    assigneeId: 'm8',
    assigneeName: 'Mateo Castillo',
    assigneeRole: 'Publicador',
    hall: 'Salón Principal',
    status: 'completado',
    completedAt: getRelativeDate(-7),
    completionNotes: 'Atento a los comentarios de los asistentes.',
    createdAt: new Date().toISOString()
  }
];
