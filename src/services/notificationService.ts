import { Assignment, AppNotification } from '../types';

export const calculateDaysDifference = (targetDateStr: string): number => {
  const target = new Date(targetDateStr + 'T00:00:00');
  const now = new Date();
  // Strip time from today
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const formatSpanishDate = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const formatShortDate = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return dateStr;
  }
};

export const getCountdownMessage = (
  daysRemaining: number,
  title: string,
  time: string,
  dateStr: string
): { title: string; message: string } => {
  const formattedDate = formatShortDate(dateStr);

  switch (daysRemaining) {
    case 5:
      return {
        title: `Faltan 5 días para tu asignación`,
        message: `Tienes programada la parte "${title}" para el ${formattedDate} a las ${time}. Momento oportuno para comenzar la preparación.`
      };
    case 4:
      return {
        title: `Faltan 4 días para tu parte`,
        message: `Recordatorio para "${title}" el ${formattedDate}. Repasa el objetivo de la lección y los puntos principales.`
      };
    case 3:
      return {
        title: `Faltan 3 días para tu asignación`,
        message: `Tu parte "${title}" se presentará el ${formattedDate}. Buen momento para coordinar con tu ayudante si aplica.`
      };
    case 2:
      return {
        title: `Faltan 2 días para tu asignación`,
        message: `Se acerca tu participación en "${title}". Asegúrate de cronometrar el tiempo asignado.`
      };
    case 1:
      return {
        title: `¡Mañana es tu asignación!`,
        message: `Mañana presentarás "${title}" a las ${time}. Que Jehová bendiga tu preparación y esfuerzo.`
      };
    case 0:
      return {
        title: `¡Hoy es el día de tu asignación!`,
        message: `Hoy tienes a cargo "${title}" a las ${time}. Por favor llega unos minutos antes para estar listo.`
      };
    default:
      return {
        title: `Próxima asignación`,
        message: `Tienes programada la parte "${title}" para el ${formattedDate}.`
      };
  }
};

/**
 * Checks all active assignments and generates missing 5-to-0 day daily notifications
 */
export const checkAndGenerateDailyNotifications = (
  assignments: Assignment[],
  existingNotifications: AppNotification[]
): AppNotification[] => {
  const newNotifications: AppNotification[] = [];

  assignments.forEach((asg) => {
    if (asg.status === 'completado' || asg.status === 'sustituido') {
      return;
    }

    const days = calculateDaysDifference(asg.date);

    // Rule requested: "desde los 5 dias avisara diariamente una notificacion"
    if (days >= 0 && days <= 5) {
      // Check if a notification for this specific assignment and daysRemaining already exists
      const alreadyNotified = existingNotifications.some(
        (n) =>
          n.assignmentId === asg.id &&
          n.type === 'countdown' &&
          n.daysRemaining === days
      );

      if (!alreadyNotified) {
        const { title, message } = getCountdownMessage(
          days,
          asg.title,
          asg.time,
          asg.date
        );

        newNotifications.push({
          id: `notif-cnt-${asg.id}-${days}-${Date.now()}`,
          userId: asg.assigneeId,
          assignmentId: asg.id,
          title,
          message,
          type: 'countdown',
          daysRemaining: days,
          dateTarget: asg.date,
          createdAt: new Date().toISOString(),
          read: false
        });

        // Also if there's an assistant, generate a notification for the assistant too!
        if (asg.assistantId) {
          const assistantAlreadyNotified = existingNotifications.some(
            (n) =>
              n.assignmentId === asg.id &&
              n.userId === asg.assistantId &&
              n.type === 'countdown' &&
              n.daysRemaining === days
          );
          if (!assistantAlreadyNotified) {
            newNotifications.push({
              id: `notif-asst-${asg.id}-${days}-${Date.now()}`,
              userId: asg.assistantId,
              assignmentId: asg.id,
              title: `Faltan ${days === 0 ? 'horas' : `${days} días`} para tu ayuda en asignación`,
              message: `Acompañas como ayudante a ${asg.assigneeName} en "${asg.title}" el ${formatShortDate(asg.date)} a las ${asg.time}.`,
              type: 'countdown',
              daysRemaining: days,
              dateTarget: asg.date,
              createdAt: new Date().toISOString(),
              read: false
            });
          }
        }
      }
    }
  });

  return newNotifications;
};

/**
 * Creates notification when administrator creates a new assignment
 */
export const createNewAssignmentNotification = (
  assignment: Assignment
): AppNotification => {
  const formattedDate = formatSpanishDate(assignment.date);
  return {
    id: `notif-new-${assignment.id}-${Date.now()}`,
    userId: assignment.assigneeId,
    assignmentId: assignment.id,
    title: `Nueva asignación programada`,
    message: `El superintendente te ha asignado "${assignment.title}" para la reunión del ${formattedDate} a las ${assignment.time}.`,
    type: 'new_assignment',
    dateTarget: assignment.date,
    createdAt: new Date().toISOString(),
    read: false
  };
};

/**
 * Subtle dignified chime using Web Audio API
 */
export const playGentleChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle melodic bell: A4 to C#5
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(554.37, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.65);
  } catch {
    // Gracefully ignore audio autoplay restrictions
  }
};
