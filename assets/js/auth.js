import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

export function requireAdminAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = 'login.html';
        return;
      }
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userDocRef);
        const data = snap.exists() ? snap.data() : null;
        if (!data || data.user_role !== 'admin') {
          await signOut(auth);
          window.location.href = 'login.html';
          return;
        }
        resolve({ user, profile: data });
      } catch (err) {
        console.error('Auth guard error', err);
        window.location.href = 'login.html';
      }
    });
  });
}

export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  const snap = await getDoc(doc(db, 'users', user.uid));
  const data = snap.exists() ? snap.data() : null;
  if (!data || data.user_role !== 'admin') {
    await signOut(auth);
    throw new Error('Access denied. Admin role required.');
  }
  return user;
}

export async function signOutUser() {
  await signOut(auth);
  window.location.href = 'login.html';
}

export async function changePassword(currentPassword, newPassword) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
  await reauthenticateWithCredential(auth.currentUser, credential);
  await updatePassword(auth.currentUser, newPassword);
}

export async function changeEmail(currentPassword, newEmail) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
  await reauthenticateWithCredential(auth.currentUser, credential);
  await updateEmail(auth.currentUser, newEmail);
  await updateDoc(doc(db, 'users', auth.currentUser.uid), { email: newEmail });
}
