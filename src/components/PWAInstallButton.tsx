import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2, Sparkles } from 'lucide-react';

interface PWAInstallProps {
  variant?: 'banner' | 'button';
  customClass?: string;
}

export const PWAInstallButton: React.FC<PWAInstallProps> = ({
  variant = 'button',
  customClass = ''
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as installed standalone PWA, suppress
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback for browsers when beforeinstallprompt has not fired or desktop
      setShowIOSModal(true);
    }
  };

  // 1. BANNER VARIANT (Top notification card)
  if (variant === 'banner') {
    return (
      <>
        <div className={`bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 p-3 sm:p-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-2.5 border border-amber-400/40 ${customClass}`}>
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
              <Download className="w-4 h-4 animate-bounce" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm tracking-tight leading-tight">
                Instalar App en tu Teléfono
              </h4>
              <p className="text-[11px] text-slate-900/80 leading-tight truncate">
                Acceso directo desde tu pantalla de inicio, sin configuraciones.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="shrink-0 py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Instalar</span>
          </button>
        </div>

        {/* iOS / General Install Guide Modal */}
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif-elegant font-bold text-sm text-slate-900">
                    Instalar en tu Pantalla de Inicio
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Para tener la aplicación siempre disponible con su propio icono sin abrir el navegador:
              </p>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <Share className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Paso 1:</span>
                    <p className="text-[11px] text-slate-600">
                      Toca el botón <strong>Compartir</strong> <span className="inline-block px-1 py-0.5 bg-slate-200 rounded text-[10px]">⎋</span> en la barra de tu navegador (Safari o Chrome).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Paso 2:</span>
                    <p className="text-[11px] text-slate-600">
                      Desliza y selecciona <strong>"Añadir a pantalla de inicio"</strong> <span className="inline-block px-1 py-0.5 bg-slate-200 rounded text-[10px]">⊞</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // 2. BUTTON VARIANT (Compact for Headers/Navbars)
  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center space-x-1.5 py-1.5 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-all ${customClass}`}
        title="Instalar App en el teléfono"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="truncate">Instalar App</span>
      </button>

      {/* Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-serif-elegant font-bold text-sm text-slate-900">
                  Instalar en tu Teléfono
                </h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Para tener la app siempre en tu pantalla de inicio sin usar el navegador:
            </p>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <Share className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">1. Toca Compartir:</span>
                  <p className="text-[11px] text-slate-600">
                    En el menú del navegador (Safari o Chrome), toca el botón <strong>Compartir</strong> <span className="inline-block px-1 py-0.5 bg-slate-200 rounded text-[10px]">⎋</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                  <PlusSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">2. Añadir a pantalla:</span>
                  <p className="text-[11px] text-slate-600">
                    Elige <strong>"Añadir a pantalla de inicio"</strong>. La aplicación quedará instalada como app nativa.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </>
  );
};
