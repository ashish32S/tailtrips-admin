import { auth, db } from './firebase.js';
import { changeEmail, changePassword, requireAdminAuth } from './auth.js';
import { initCommonUI } from './common.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { el } from './utils.js';

const profileForm = document.getElementById('adminProfileForm');
const profileNotice = document.getElementById('adminProfileNotice');
const pwdForm = document.getElementById('adminPasswordForm');
const pwdNotice = document.getElementById('adminPasswordNotice');

function setMsg(node, msg, isError = false) {
  node.textContent = msg;
  node.classList.remove('hidden');
  node.style.borderColor = isError ? '#ef4444' : '#1f2937';
}

const { user, profile } = await requireAdminAuth();
initCommonUI(profile);

const userDocRef = doc(db, 'users', user.uid);
const snap = await getDoc(userDocRef);
const data = snap.exists() ? snap.data() : {};

document.getElementById('admin_name').value = data.name || '';

document.getElementById('admin_email').value = auth.currentUser?.email || '';

profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  profileNotice.classList.add('hidden');
  try {
    const name = document.getElementById('admin_name').value.trim();
    const email = document.getElementById('admin_email').value.trim();
    const currentPassword = document.getElementById('admin_current_password').value;

    if (email && email !== auth.currentUser.email) {
      if (!currentPassword) throw new Error('Current password required to change email');
      await changeEmail(currentPassword, email);
    }
    if (name && name !== data.name) {
      await updateDoc(userDocRef, { name });
    }
    setMsg(profileNotice, 'Profile updated.');
  } catch (err) {
    setMsg(profileNotice, err.message || 'Update failed', true);
  }
});

pwdForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  pwdNotice.classList.add('hidden');
  try {
    const currentPassword = document.getElementById('pwd_current').value;
    const newPassword = document.getElementById('pwd_new').value;
    await changePassword(currentPassword, newPassword);
    setMsg(pwdNotice, 'Password updated.');
    pwdForm.reset();
  } catch (err) {
    setMsg(pwdNotice, err.message || 'Password update failed', true);
  }
});
