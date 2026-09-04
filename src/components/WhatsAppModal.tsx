import React, { useState } from 'react';
import { Assignment } from '../types';
import { formatSpanishDate } from '../services/notificationService';
import { Check, Copy, MessageCircle, X } from 'lucide-react';

interface WhatsAppModalProps {
  assignment: Assignment;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ assignment, onClose }) => {
  const [copied, setCopied] = useState(false);

  const formattedDate = formatSpanishDate(assignment.date);

  const messageText = `Estimado(a) hermano(a) ${assignment.assigneeName}:

Le enviamos este atento recordatorio con respecto a su próxima asignación en la congregación:

📌 *Asignación:* ${assignment.title}
📅 *Fecha:* ${formattedDate}
⏰ *Hora:* ${assignment.time} hrs
🏛️ *Lugar:* ${assignment.hall}${assignment.assistantName ? `\n🤝 *Ayudante:* ${assignment.assistantName}` : ''}${assignment.lessonOrStudy ? `\n📖 *Punto/Lección:* ${assignment.lessonOrStudy}` : ''}${assignment.source ? `\n📚 *Fuente:* ${assignment.source}` : ''}${assignment.notes ? `\n📝 *Nota:* ${assignment.notes}` : ''}

Que Jehová bendiga generosamente su preparación y servicio a la congregación.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="whatsapp-share-modal"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800"
      >
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-wide">Recordatorio Fraternal</h3>
              <p className="text-xs text-slate-400">Mensaje formal para compartir</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed selection:bg-amber-100">
            {messageText}
          </div>

          <p className="text-xs text-slate-500 italic text-center">
            Puede enviar este texto directamente al hermano o copiarlo para su registro personal.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              id="copy-whatsapp-text-btn"
              onClick={handleCopy}
              className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-300 font-medium text-xs text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copiar texto</span>
                </>
              )}
            </button>

            <button
              id="open-whatsapp-btn"
              onClick={handleOpenWhatsApp}
              className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all hover:shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Abrir WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
