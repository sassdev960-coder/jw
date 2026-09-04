import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  doc, 
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Assignment, Member, AppNotification, AssignmentStatus } from '../types';
import { INITIAL_MEMBERS, getInitialAssignments } from '../data/initialData';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must use firestoreDatabaseId and experimentalForceLongPolling to prevent iframe connection timeouts
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId
);
export const auth = getAuth(app);

// Connection test as required by Firebase integration guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('unavailable'))) {
      console.warn('Verificando conexión con Firebase Firestore...');
    }
  }
}
testConnection();

// Standard Error Handling conforming to FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Collections
const MEMBERS_COLLECTION = 'members';
const ASSIGNMENTS_COLLECTION = 'assignments';
const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Seeds initial members and assignments if the collections are empty
 */
export async function seedFirestoreIfEmpty() {
  try {
    const membersSnap = await getDocs(collection(db, MEMBERS_COLLECTION));
    if (membersSnap.empty) {
      console.log('Seeding initial members into Firestore...');
      const batch = writeBatch(db);
      for (const m of INITIAL_MEMBERS) {
        const ref = doc(db, MEMBERS_COLLECTION, m.id);
        batch.set(ref, {
          ...m,
          createdAt: new Date().toISOString()
        });
      }
      await batch.commit();
    }

    const assignmentsSnap = await getDocs(collection(db, ASSIGNMENTS_COLLECTION));
    if (assignmentsSnap.empty) {
      console.log('Seeding initial assignments into Firestore...');
      const batch = writeBatch(db);
      const initialAsgs = getInitialAssignments();
      for (const a of initialAsgs) {
        const ref = doc(db, ASSIGNMENTS_COLLECTION, a.id);
        batch.set(ref, a);
      }
      await batch.commit();
    }
  } catch (err) {
    console.error('Error during Firestore initial seed:', err);
  }
}

/**
 * Subscribe to Members in real-time
 */
export function subscribeMembers(
  onUpdate: (members: Member[]) => void,
  onError?: (err: unknown) => void
) {
  return onSnapshot(
    collection(db, MEMBERS_COLLECTION),
    (snapshot) => {
      const list: Member[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Member);
      });
      // Sort alphabetically
      list.sort((a, b) => a.name.localeCompare(b.name));
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, MEMBERS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Subscribe to Assignments in real-time
 */
export function subscribeAssignments(
  onUpdate: (assignments: Assignment[]) => void,
  onError?: (err: unknown) => void
) {
  return onSnapshot(
    collection(db, ASSIGNMENTS_COLLECTION),
    (snapshot) => {
      const list: Assignment[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Assignment);
      });
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, ASSIGNMENTS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Subscribe to Notifications in real-time
 */
export function subscribeNotifications(
  onUpdate: (notifications: AppNotification[]) => void,
  onError?: (err: unknown) => void
) {
  return onSnapshot(
    collection(db, NOTIFICATIONS_COLLECTION),
    (snapshot) => {
      const list: AppNotification[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as AppNotification);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, NOTIFICATIONS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

// ----------------- CRUD MEMBER -----------------
export async function saveMemberToFirestore(member: Member) {
  const path = `${MEMBERS_COLLECTION}/${member.id}`;
  try {
    const docRef = doc(db, MEMBERS_COLLECTION, member.id);
    await setDoc(docRef, {
      ...member,
      createdAt: member.createdAt || new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMemberFromFirestore(memberId: string) {
  const path = `${MEMBERS_COLLECTION}/${memberId}`;
  try {
    await deleteDoc(doc(db, MEMBERS_COLLECTION, memberId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------- CRUD ASSIGNMENT -----------------
export async function saveAssignmentToFirestore(assignment: Assignment) {
  const path = `${ASSIGNMENTS_COLLECTION}/${assignment.id}`;
  try {
    const docRef = doc(db, ASSIGNMENTS_COLLECTION, assignment.id);
    await setDoc(docRef, assignment, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateAssignmentStatusInFirestore(
  assignmentId: string, 
  status: AssignmentStatus, 
  completedAt?: string, 
  completionNotes?: string
) {
  const path = `${ASSIGNMENTS_COLLECTION}/${assignmentId}`;
  try {
    const docRef = doc(db, ASSIGNMENTS_COLLECTION, assignmentId);
    const updateData: Partial<Assignment> = { status };
    if (completedAt) updateData.completedAt = completedAt;
    if (completionNotes !== undefined) updateData.completionNotes = completionNotes;
    await updateDoc(docRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAssignmentFromFirestore(assignmentId: string) {
  const path = `${ASSIGNMENTS_COLLECTION}/${assignmentId}`;
  try {
    await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, assignmentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------- CRUD NOTIFICATIONS -----------------
export async function saveNotificationToFirestore(notification: AppNotification) {
  const path = `${NOTIFICATIONS_COLLECTION}/${notification.id}`;
  try {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notification.id);
    await setDoc(docRef, notification, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function markNotificationsAsReadInFirestore(notificationIds: string[]) {
  if (notificationIds.length === 0) return;
  try {
    const batch = writeBatch(db);
    for (const id of notificationIds) {
      const docRef = doc(db, NOTIFICATIONS_COLLECTION, id);
      batch.update(docRef, { read: true });
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, NOTIFICATIONS_COLLECTION);
  }
}
