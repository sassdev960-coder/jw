import React, { useState } from 'react';
import { Member, Assignment } from '../types';
import { 
  Plus, 
  Search, 
  User, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Edit3, 
  Trash2, 
  Award, 
  Phone, 
  Smartphone, 
  Sparkles,
  Shield,
  HelpCircle
} from 'lucide-react';
import { MemberProfileModal } from './MemberProfileModal';

interface AdminProfilesSectionProps {
  members: Member[];
  assignments: Assignment[];
  onSaveMember: (member: Member) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
  onSelectMemberToView: (id: string) => void;
}

export const AdminProfilesSection: React.FC<AdminProfilesSectionProps> = ({
  members,
  assignments,
  onSaveMember,
  onDeleteMember,
  onSelectMemberToView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Helper to generate unique personal URL
  const getPersonalUrl = (memberId: string) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?u=${encodeURIComponent(memberId)}`;
  };

  const handleCopyLink = (memberId: string, memberName: string) => {
    const url = getPersonalUrl(memberId);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(memberId);
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  const handleShareWhatsApp = (member: Member) => {
    const url = getPersonalUrl(member.id);
    const greeting = member.gender === 'F' ? 'Estimada hermana' : 'Estimado hermano';
    const text = encodeURIComponent(
      `🏛️ *Asignaciones Teocráticas - Congregación*\n\n` +
      `${greeting} *${member.name}*,\n` +
      `La congregación ha habilitado tu enlace personal para consultar tus asignaciones, turnos de servicio y recibir recordatorios:\n\n` +
      `📲 *Acceder a mi interfaz personal:*\n${url}\n\n` +
      `_Puedes abrirlo cómodamente desde tu teléfono móvil, tableta o computadora._`
    );

    let phoneParam = '';
    if (member.phone) {
      const cleanPhone = member.phone.replace(/[^0-9]/g, '');
      if (cleanPhone) phoneParam = `phone=${cleanPhone}&`;
    }

    window.open(`https://api.whatsapp.com/send?${phoneParam}text=${text}`, '_blank');
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterRole === 'ALL') return true;
    return m.role === filterRole;
  });

  return (
    <div className="space-y-4">
      {/* Header action bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
            Directorio & Enlaces Personales
          </span>
          <h3 className="font-serif-elegant text-base font-bold text-slate-900">
            Perfiles de Publicadores ({members.length})
          </h3>
          <p className="text-xs text-slate-500">
            Cada publicador cuenta con un enlace único para acceder a su interfaz teocrática desde su teléfono, tableta o PC.
          </p>
        </div>

        <button
          id="btn-new-member-profile"
          onClick={() => {
            setMemberToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/10 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Nuevo Publicador</span>
        </button>
      </div>

      {/* Info notice about direct links */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-200/80 rounded-2xl p-3.5 flex items-start space-x-3 text-xs text-amber-900">
        <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg shrink-0 mt-0.5">
          <Smartphone className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-amber-950 text-xs">
            ¿Cómo funcionan los enlaces personales?
          </h4>
          <p className="text-amber-900/90 leading-relaxed text-[11px]">
            Al enviarle su enlace personal al hermano por WhatsApp, este se abre en cualquier navegador (móvil, tablet o PC) mostrando directamente sus asignaciones, cuenta regresiva diaria y confirmaciones sin requerir contraseñas complejas.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre de hermano o hermana..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          {[
            { key: 'ALL', label: 'Todos' },
            { key: 'anciano', label: 'Ancianos' },
            { key: 'siervo_ministerial', label: 'Siervos' },
            { key: 'precursor', label: 'Precursores' },
            { key: 'publicador', label: 'Publicadores' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterRole(tab.key)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterRole === tab.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members Cards List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredMembers.map((member) => {
          const personalUrl = getPersonalUrl(member.id);
          const activeAssignments = assignments.filter(
            (a) => a.assigneeId === member.id && a.status !== 'completado'
          );
          const isCopied = copiedId === member.id;

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/90 hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold font-cinzel text-sm shrink-0 mt-0.5 border border-slate-200">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 className="font-serif-elegant font-bold text-sm text-slate-900">
                        {member.name}
                      </h4>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {member.role.replace('_', ' ')}
                      </span>
                      {member.gender === 'F' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Hermana
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      {member.phone ? (
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{member.phone}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Sin teléfono registrado</span>
                      )}
                      <span className="text-slate-300">•</span>
                      <span className="font-medium text-amber-700">
                        {activeAssignments.length} asignación(es) activa(s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action buttons */}
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => {
                      setMemberToEdit(member);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Editar perfil"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {deletingId === member.id ? (
                    <div className="flex items-center space-x-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <span className="text-[10px] text-rose-700 font-bold px-1">¿Eliminar?</span>
                      <button
                        onClick={async () => {
                          await onDeleteMember(member.id);
                          setDeletingId(null);
                        }}
                        className="p-1 bg-rose-600 text-white rounded text-[10px] font-bold"
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="p-1 text-slate-500 text-[10px]"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(member.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Eliminar perfil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Privileges badges */}
              {member.privileges && member.privileges.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {member.privileges.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}

              {/* Personal Link Box */}
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Enlace Personal del Usuario:</span>
                  </span>
                  <button
                    onClick={() => onSelectMemberToView(member.id)}
                    className="text-slate-600 hover:text-slate-900 font-semibold flex items-center space-x-1 hover:underline text-[11px]"
                  >
                    <span>Abrir en vista de usuario</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={personalUrl}
                    className="flex-1 bg-white text-[11px] font-mono text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200 select-all focus:outline-none"
                  />

                  {/* Copy Link Button */}
                  <button
                    onClick={() => handleCopyLink(member.id, member.name)}
                    className={`flex items-center space-x-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>

                  {/* WhatsApp Share Button */}
                  <button
                    onClick={() => handleShareWhatsApp(member)}
                    className="flex items-center space-x-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shrink-0"
                    title="Enviar enlace por WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredMembers.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300 space-y-2">
            <User className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              No se encontraron publicadores con ese criterio
            </p>
            <p className="text-xs text-slate-400">
              Pruebe limpiando el buscador o cree un nuevo perfil.
            </p>
          </div>
        )}
      </div>

      {/* Member Profile Modal */}
      {isModalOpen && (
        <MemberProfileModal
          memberToEdit={memberToEdit}
          onClose={() => {
            setIsModalOpen(false);
            setMemberToEdit(null);
          }}
          onSave={onSaveMember}
        />
      )}
    </div>
  );
};
