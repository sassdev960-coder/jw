import React from 'react';
import { AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface InvalidLinkScreenProps {
  searchedId?: string | null;
}

export const InvalidLinkScreen: React.FC<InvalidLinkScreenProps> = ({ searchedId }) => {
  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:py-12 max-w-md mx-auto w-full text-slate-800">
      <div className="text-center space-y-3 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-xl mx-auto ring-4 ring-amber-500/20">
          <span className="font-cinzel text-2xl tracking-tight">JW</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
            Congregación Valle Hermoso
          </span>
          <h1 className="font-serif-elegant text-2xl font-bold text-slate-900 leading-tight">
            Asignaciones Teocráticas
          </h1>
        </div>
      </div>

      <div className="mb-4">
        <PWAInstallButton variant="banner" />
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-rose-200 space-y-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-2xl shrink-0 mt-0.5">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-serif-elegant font-bold text-base text-rose-950">
              Perfil no encontrado en la base de datos
            </h2>
            <p className="text-xs text-rose-800 leading-relaxed">
              El enlace proporcionado no coincide con ningún publicador activo en el registro de la congregación.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 space-y-2">
          <p className="font-semibold text-amber-900 flex items-center space-x-1.5">
            <Shield className="w-4 h-4 text-amber-600 shrink-0" />
            <span>¿Qué debes hacer?</span>
          </p>
          <p className="leading-relaxed text-[11px] text-slate-600">
            Por favor, <strong>habla con el hermano anciano encargado de las partes y asignaciones</strong> en la congregación para que registre tu perfil en la base de datos o te envíe tu enlace personal actualizado por WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};
