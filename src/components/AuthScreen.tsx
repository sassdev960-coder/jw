import React, { useState } from 'react';
import { Member } from '../types';
import { 
  User, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Check, 
  ArrowRight, 
  Smartphone, 
  Sparkles,
  PhoneCall,
  HelpCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface AuthScreenProps {
  members: Member[];
  onLoginUser: (memberId: string) => void;
  onLoginAdmin: () => void;
  initialErrorMemberName?: string | null;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  members,
  onLoginUser,
  onLoginAdmin,
  initialErrorMemberName
}) => {
  const [activeTab, setActiveTab] = useState<'USER' | 'ADMIN'>('USER');

  // User tab state
  const [userNameInput, setUserNameInput] = useState('');
  const [notFoundError, setNotFoundError] = useState<string | null>(initialErrorMemberName || null);
  const [suggestedMembers, setSuggestedMembers] = useState<Member[]>([]);

  // Admin tab state
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState(false);

  // Normalize string for case and accent-insensitive matching
  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  // User Login Submission
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = normalizeText(userNameInput);
    if (!query) return;

    // Search for exact or close match in Firebase members list
    const exactMatch = members.find(
      (m) => normalizeText(m.name) === query
    );

    if (exactMatch) {
      setNotFoundError(null);
      onLoginUser(exactMatch.id);
      return;
    }

    // Check partial matches
    const partialMatches = members.filter((m) =>
      normalizeText(m.name).includes(query) || query.includes(normalizeText(m.name))
    );

    if (partialMatches.length === 1) {
      // Exactly one strong match
      setNotFoundError(null);
      onLoginUser(partialMatches[0].id);
      return;
    }

    // Name was not found in database!
    // As explicitly requested by the user:
    // "el login leera que su nombre no esta en la base de datos y le aparecera que tiene que hablar con el anciano encargado de las partes en la congregacion"
    setNotFoundError(userNameInput.trim());
    setSuggestedMembers(partialMatches);
  };

  // Admin Login Submission
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '123456789') {
      setAdminError(false);
      onLoginAdmin();
    } else {
      setAdminError(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:py-12 max-w-md mx-auto w-full">
      {/* Congregation Emblem & Header */}
      <div className="text-center space-y-2.5 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-xl mx-auto ring-4 ring-amber-500/20">
          <span className="font-cinzel text-2xl tracking-tight">JW</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
            Congregación Valle Hermoso
          </span>
          <h1 className="font-serif-elegant text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            Control de Asignaciones
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
            Sistema teocrático de partes de reunión, turnos de servicio y avisos de preparación.
          </p>
        </div>
      </div>

      {/* Mode Switch Tabs (Publicador vs Administrador) */}
      <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center mb-5 border border-slate-300/60 shadow-xs">
        <button
          type="button"
          onClick={() => {
            setActiveTab('USER');
            setNotFoundError(null);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'USER'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 text-amber-600" />
          <span>Soy Publicador</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('ADMIN');
            setAdminError(false);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'ADMIN'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Administrador</span>
        </button>
      </div>

      {/* TAB 1: PUBLICADOR LOGIN */}
      {activeTab === 'USER' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
          <div className="space-y-1">
            <h2 className="font-serif-elegant text-lg font-bold text-slate-900">
              Acceso del Publicador
            </h2>
            <p className="text-xs text-slate-500">
              Ingresa tu nombre y apellido para ver tus asignaciones, cuenta regresiva y confirmar tu asistencia.
            </p>
          </div>

          {/* CRITICAL: "el login leera que su nombre no esta en la base de datos y le aparecera que tiene que hablar con el anciano encargado de las partes en la congregacion" */}
          {notFoundError && (
            <div className="bg-rose-50 border-2 border-rose-300/80 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-rose-950 text-xs sm:text-sm">
                    Nombre no registrado en la base de datos
                  </h3>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    El nombre <strong className="font-semibold text-rose-950">"{notFoundError}"</strong> no figura en el registro de publicadores de la congregación.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 rounded-xl p-3 border border-rose-200 text-xs text-slate-700 space-y-1.5">
                <p className="font-semibold text-amber-900 flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Instrucción requerida:</span>
                </p>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  Debes comunicarte con el <strong>hermano anciano encargado de las partes y asignaciones</strong> en la congregación para que registre tu perfil en la base de datos y te asigne tus privilegios teocráticos.
                </p>
              </div>

              {/* Suggestions if any close match */}
              {suggestedMembers.length > 0 && (
                <div className="pt-1">
                  <p className="text-[11px] font-semibold text-slate-600 mb-1">
                    ¿Quizá te referías a uno de estos hermanos?
                  </p>
                  <div className="space-y-1">
                    {suggestedMembers.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setNotFoundError(null);
                          onLoginUser(m.id);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 hover:bg-amber-50 hover:border-amber-300 font-medium flex items-center justify-between transition-colors"
                      >
                        <span>{m.name} ({m.role.replace('_', ' ')})</span>
                        <span className="text-[10px] text-amber-700 font-bold">Seleccionar</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setNotFoundError(null);
                  setUserNameInput('');
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all text-center"
              >
                Intentar con otro nombre
              </button>
            </div>
          )}

          {!notFoundError && (
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nombre Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    placeholder="Ej: Carlos Morales o Mariana Gómez"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ingresa tu nombre tal como figura en la lista de publicadores.
                </p>
              </div>

              {/* Quick helper list of active registered members */}
              <div className="pt-1">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Publicadores registrados en la congregación ({members.length}):
                </label>
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                  {members.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setUserNameInput(m.name);
                        onLoginUser(m.id);
                      }}
                      className="text-[10px] px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-amber-100 hover:border-amber-300 hover:text-amber-900 transition-all truncate max-w-[140px]"
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Acceder a mi Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: ADMINISTRADOR LOGIN */}
      {activeTab === 'ADMIN' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
              <Shield className="w-3 h-3 text-amber-600" />
              <span>Superintendencia</span>
            </div>
            <h2 className="font-serif-elegant text-lg font-bold text-slate-900">
              Panel del Administrador
            </h2>
            <p className="text-xs text-slate-500">
              Área restringida para ancianos y superintendentes. Permite crear publicadores, programar asignaciones y turnos.
            </p>
          </div>

          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contraseña de Administrador
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    if (adminError) setAdminError(false);
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

              {adminError && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center space-x-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Contraseña incorrecta. Intente nuevamente.</span>
                </p>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800">Clave de acceso establecida:</span>
              <p>
                La contraseña fijada para la administración es <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">123456789</code>.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/20 transition-all flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Ingresar como Administrador</span>
            </button>
          </form>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center mt-6 text-[11px] text-slate-400 space-y-1">
        <p>Los datos y perfiles se guardan de forma persistente en Firebase Firestore.</p>
        <p className="text-slate-500">¿Tienes un enlace personal directo? Ábrelo en tu navegador para ingresar sin escribir tu nombre.</p>
      </div>
    </div>
  );
};
