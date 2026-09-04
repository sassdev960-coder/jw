import React, { useState } from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Cloud
} from 'lucide-react';

interface AdminLoginScreenProps {
  onSuccess: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456789') {
      setHasError(false);
      onSuccess();
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:py-12 max-w-md mx-auto w-full text-slate-800">
      {/* Emblem and Title */}
      <div className="text-center space-y-3 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-xl mx-auto ring-4 ring-amber-500/20">
          <span className="font-cinzel text-2xl tracking-tight">JW</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
            Congregación Valle Hermoso
          </span>
          <h1 className="font-serif-elegant text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            Superintendencia de Reuniones
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
            Panel de control exclusivo para la gestión de asignaciones, turnos y perfiles de publicadores.
          </p>
        </div>
      </div>

      {/* PWA Install Button at top */}
      <div className="mb-4">
        <PWAInstallButton variant="banner" />
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200 space-y-4">
        <div className="flex items-center space-x-2 pb-1 border-b border-slate-100">
          <div className="p-1.5 bg-amber-500/10 text-amber-600 rounded-xl">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Acceso de Administrador
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contraseña de Administración
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (hasError) setHasError(false);
                }}
                placeholder="Ingrese contraseña..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 text-sm transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {hasError && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center space-x-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Contraseña incorrecta. Intente nuevamente.</span>
              </p>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800">Clave fijada:</span>
            <p>
              La contraseña de administrador es <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">123456789</code>.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>Ingresar al Panel</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>
      </div>

      {/* Notice about Publisher Links */}
      <div className="text-center mt-6 text-[11px] text-slate-400 space-y-1">
        <p className="text-slate-500">
          Los publicadores acceden exclusivamente a través del enlace personal generado por el superintendente.
        </p>
        <p className="flex items-center justify-center space-x-1 text-[10px] text-emerald-600 font-medium">
          <Cloud className="w-3 h-3" />
          <span>Base de datos sincronizada en Firebase Firestore</span>
        </p>
      </div>
    </div>
  );
};
