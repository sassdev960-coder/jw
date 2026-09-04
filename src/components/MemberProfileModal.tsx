import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import { X, User, Phone, Check, Award, Shield, HeartHandshake } from 'lucide-react';

interface MemberProfileModalProps {
  memberToEdit?: Member | null;
  onClose: () => void;
  onSave: (member: Member) => void;
}

const COMMON_PRIVILEGES = [
  'Discurso Público',
  'Presidente de Reunión',
  'Oración Inicial / Final',
  'Lectura de La Atalaya',
  'Tesoros de la Biblia',
  'Perlas Escondidas',
  'Conductor Estudio Bíblico',
  'Lectura Estudio Bíblico',
  'Seamos Mejores Maestros',
  'Nuestra Vida Cristiana',
  'Acomodador',
  'Audio y Video',
  'Micrófonos',
  'Aseo del Salón'
];

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  memberToEdit,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [role, setRole] = useState<'anciano' | 'siervo_ministerial' | 'publicador' | 'precursor'>('publicador');
  const [phone, setPhone] = useState('');
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name);
      setGender(memberToEdit.gender);
      setRole(memberToEdit.role);
      setPhone(memberToEdit.phone || '');
      setSelectedPrivileges(memberToEdit.privileges || []);
    } else {
      setName('');
      setGender('M');
      setRole('publicador');
      setPhone('');
      setSelectedPrivileges(['Seamos Mejores Maestros', 'Aseo del Salón']);
    }
  }, [memberToEdit]);

  const togglePrivilege = (priv: string) => {
    setSelectedPrivileges((prev) =>
      prev.includes(priv) ? prev.filter((p) => p !== priv) : [...prev, priv]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    const newMember: Member = {
      id: memberToEdit ? memberToEdit.id : `m_${Date.now()}`,
      name: name.trim(),
      gender,
      role,
      phone: phone.trim() || undefined,
      privileges: selectedPrivileges,
      createdAt: memberToEdit?.createdAt || new Date().toISOString()
    };

    try {
      await onSave(newMember);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 text-slate-800 my-8 space-y-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Directorio Teocrático
            </span>
            <h3 className="font-serif-elegant text-lg font-bold text-slate-900">
              {memberToEdit ? 'Editar Perfil de Publicador' : 'Nuevo Perfil de Publicador'}
            </h3>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Carlos Morales"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm"
            />
          </div>

          {/* Gender & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Género
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('M')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    gender === 'M'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Hermano (Varón)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('F')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    gender === 'F'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Hermana
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Responsabilidad / Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 text-xs bg-white"
              >
                <option value="publicador">Publicador(a) Bautizado(a)</option>
                <option value="precursor">Precursor(a) Regular / Auxiliar</option>
                {gender === 'M' && <option value="siervo_ministerial">Siervo Ministerial</option>}
                {gender === 'M' && <option value="anciano">Anciano</option>}
              </select>
            </div>
          </div>

          {/* WhatsApp Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Teléfono WhatsApp (opcional para recordatorios)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 9 11 2345 6789"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 text-xs"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Privileges selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Privilegios y Asignaciones Aptas</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {selectedPrivileges.length} seleccionados
              </span>
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
              {COMMON_PRIVILEGES.map((priv) => {
                const checked = selectedPrivileges.includes(priv);
                return (
                  <button
                    key={priv}
                    type="button"
                    onClick={() => togglePrivilege(priv)}
                    className={`flex items-center space-x-1.5 p-2 rounded-lg text-left transition-all ${
                      checked
                        ? 'bg-amber-100 text-amber-950 font-semibold border border-amber-300'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                        checked
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {checked && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span className="truncate">{priv}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              {isSaving ? (
                <span>Guardando en Firebase...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>{memberToEdit ? 'Guardar Cambios' : 'Crear Perfil'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
