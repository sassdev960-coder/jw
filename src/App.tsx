import React, { useState, useEffect, useMemo } from 'react';
import { Assignment, Member, AppNotification } from './types';
import { INITIAL_MEMBERS, getInitialAssignments } from './data/initialData';
import { 
  checkAndGenerateDailyNotifications, 
  createNewAssignmentNotification,
  playGentleChime
} from './services/notificationService';
import {
  seedFirestoreIfEmpty,
  subscribeMembers,
  subscribeAssignments,
  subscribeNotifications,
  saveMemberToFirestore,
  deleteMemberFromFirestore,
  saveAssignmentToFirestore,
  updateAssignmentStatusInFirestore,
  deleteAssignmentFromFirestore,
  saveNotificationToFirestore,
  markNotificationsAsReadInFirestore
} from './services/firebase';
import { UserInterface } from './components/UserInterface';
import { AdminInterface } from './components/AdminInterface';
import { AdminLoginScreen } from './components/AdminLoginScreen';
import { InvalidLinkScreen } from './components/InvalidLinkScreen';
import { Bell } from 'lucide-react';

const STORAGE_KEYS = {
  ADMIN_AUTH: 'jw_admin_session_auth_v4'
};

export default function App() {
  // Members state (synced with Firebase Firestore)
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);

  // Assignments state (synced with Firebase Firestore)
  const [assignments, setAssignments] = useState<Assignment[]>(getInitialAssignments);

  // Notifications state (synced with Firebase Firestore)
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Frame toggle (Mobile frame vs Wide view)
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Toast Notification
  const [toastNotification, setToastNotification] = useState<AppNotification | null>(null);

  // Check if current URL contains a publisher ID parameter: ?u=m1 or ?user=m1
  const [urlUserId, setUrlUserId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('u') || params.get('user') || params.get('id') || null;
    }
    return null;
  });

  // Admin authentication state (for primary app access with 123456789)
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // 1. Initial Firestore Setup & Real-time Subscriptions
  useEffect(() => {
    // Seed initial data to Firestore if collections are empty
    seedFirestoreIfEmpty();

    // Subscribe to Members
    const unsubMembers = subscribeMembers((cloudMembers) => {
      if (cloudMembers.length > 0) {
        setMembers(cloudMembers);
      }
    });

    // Subscribe to Assignments
    const unsubAssignments = subscribeAssignments((cloudAsgs) => {
      if (cloudAsgs.length > 0) {
        setAssignments(cloudAsgs);
      }
    });

    // Subscribe to Notifications
    const unsubNotifications = subscribeNotifications((cloudNotifs) => {
      setNotifications(cloudNotifs);
    });

    return () => {
      unsubMembers();
      unsubAssignments();
      unsubNotifications();
    };
  }, []);

  // 2. Listen to URL parameter changes (?u=...)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const u = params.get('u') || params.get('user') || params.get('id') || null;
      setUrlUserId(u);
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // 3. Daily countdown check and automatic alerts (5, 4, 3, 2, 1 day, 0 days)
  useEffect(() => {
    if (assignments.length === 0) return;
    const generated = checkAndGenerateDailyNotifications(assignments, notifications);
    if (generated.length > 0) {
      for (const notif of generated) {
        saveNotificationToFirestore(notif);
      }
      setNotifications((prev) => [...generated, ...prev]);
      setToastNotification(generated[0]);
      playGentleChime();
    }
  }, [assignments]);

  // Dismiss toast after 6 seconds
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Current active member if accessed via personal link
  const currentPublisher = useMemo(() => {
    if (!urlUserId) return null;
    return members.find((m) => m.id === urlUserId) || null;
  }, [members, urlUserId]);

  // Handle Admin login success
  const handleAdminLoginSuccess = () => {
    setIsAdminAuth(true);
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } catch {
      // ignore
    }
    playGentleChime();
  };

  // Handle Admin logout
  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch {
      // ignore
    }
  };

  // Switch to viewing a member's personal link
  const handleViewMemberAsUser = (memberId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('u', memberId);
    window.history.pushState({}, '', url.toString());
    setUrlUserId(memberId);
  };

  // Toggle status of an assignment
  const handleToggleStatus = async (id: string, newStatus: 'pendiente' | 'confirmado') => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    await updateAssignmentStatusInFirestore(id, newStatus);
    playGentleChime();
  };

  // Mark assignment completed
  const handleMarkCompleted = async (id: string, notes?: string) => {
    const nowStr = new Date().toISOString().split('T')[0];
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'completado',
              completedAt: nowStr,
              completionNotes: notes
            }
          : a
      )
    );
    await updateAssignmentStatusInFirestore(id, 'completado', nowStr, notes);
    playGentleChime();
  };

  // Delete assignment
  const handleDeleteAssignment = async (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    await deleteAssignmentFromFirestore(id);
  };

  // Save new assignment from admin modal
  const handleSaveNewAssignment = async (
    newAsgData: Omit<Assignment, 'id' | 'createdAt'>,
    sendImmediateNotif: boolean
  ) => {
    const id = `asg-${Date.now()}`;
    const newAssignment: Assignment = {
      ...newAsgData,
      id,
      createdAt: new Date().toISOString()
    };

    setAssignments((prev) => [newAssignment, ...prev]);
    await saveAssignmentToFirestore(newAssignment);

    if (sendImmediateNotif) {
      const notif = createNewAssignmentNotification(newAssignment);
      setNotifications((prev) => [notif, ...prev]);
      await saveNotificationToFirestore(notif);
      setToastNotification(notif);
      playGentleChime();
    }
  };

  // Save member profile (Create or Edit)
  const handleSaveMember = async (member: Member) => {
    setMembers((prev) => {
      const exists = prev.some((m) => m.id === member.id);
      if (exists) {
        return prev.map((m) => (m.id === member.id ? member : m));
      }
      return [...prev, member].sort((a, b) => a.name.localeCompare(b.name));
    });
    await saveMemberToFirestore(member);
    playGentleChime();
  };

  // Delete member profile
  const handleDeleteMember = async (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    await deleteMemberFromFirestore(memberId);
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markNotificationsAsReadInFirestore(unreadIds);
  };

  // Simulate advancing 1 day
  const handleSimulateNextDay = () => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.status === 'completado') return a;
        const d = new Date(a.date + 'T00:00:00');
        d.setDate(d.getDate() - 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return {
          ...a,
          date: `${year}-${month}-${day}`
        };
      })
    );

    setTimeout(() => {
      setNotifications((prevNotifs) => {
        const generated = checkAndGenerateDailyNotifications(assignments, prevNotifs);
        if (generated.length > 0) {
          setToastNotification(generated[0]);
          return [...generated, ...prevNotifs];
        }
        return prevNotifs;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-800 flex items-center justify-center p-0 sm:p-4 md:p-6 selection:bg-amber-100 selection:text-amber-900">
      {/* Device frame container */}
      <div
        id="app-device-container"
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-md sm:rounded-[36px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800/80 sm:ring-1 sm:ring-white/10 overflow-hidden'
            : 'max-w-3xl sm:rounded-3xl sm:shadow-2xl sm:border sm:border-slate-800 overflow-hidden'
        } bg-slate-50 min-h-[92vh] flex flex-col relative`}
      >
        {/* Floating Toast Notification Banner */}
        {toastNotification && (
          <div className="absolute top-16 left-3 right-3 z-50 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl border border-amber-500/40 backdrop-blur-md flex items-start space-x-3">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl mt-0.5 shrink-0">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Aviso Teocrático
                  </span>
                  <span className="text-[10px] text-slate-400">Notificación</span>
                </div>
                <h4 className="font-serif-elegant font-bold text-xs sm:text-sm text-white mt-0.5 truncate">
                  {toastNotification.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                  {toastNotification.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SCENARIO A: A user opened the app via personal link (?u=...) */}
        {urlUserId ? (
          currentPublisher ? (
            /* Dedicated User Interface: strictly NO admin controls */
            <UserInterface
              currentMember={currentPublisher}
              assignments={assignments}
              members={members}
              notifications={notifications}
              onToggleStatus={handleToggleStatus}
              onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
              onSimulateNextDay={handleSimulateNextDay}
              isPhoneFrame={isPhoneFrame}
              onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
            />
          ) : (
            /* Link was not found in the database */
            <InvalidLinkScreen searchedId={urlUserId} />
          )
        ) : (
          /* SCENARIO B: PRIMARY APP (ADMINISTRATOR) */
          isAdminAuth ? (
            /* Dedicated Admin Interface */
            <AdminInterface
              assignments={assignments}
              members={members}
              notifications={notifications}
              onSaveAssignment={handleSaveNewAssignment}
              onMarkCompleted={handleMarkCompleted}
              onDeleteAssignment={handleDeleteAssignment}
              onSaveMember={handleSaveMember}
              onDeleteMember={handleDeleteMember}
              onViewMemberAsUser={handleViewMemberAsUser}
              onLogoutAdmin={handleAdminLogout}
              onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
              onSimulateNextDay={handleSimulateNextDay}
              isPhoneFrame={isPhoneFrame}
              onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
            />
          ) : (
            /* Admin Password Login (123456789) */
            <AdminLoginScreen onSuccess={handleAdminLoginSuccess} />
          )
        )}
      </div>
    </div>
  );
}
