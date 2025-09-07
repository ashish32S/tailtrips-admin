import { auth } from './firebase.js';
import { signOutUser } from './auth.js';

export function initCommonUI(profile) {
  const path = window.location.pathname.split('/').pop();
  const linkByPath = {
    'index.html': 'nav-dashboard',
    'properties.html': 'nav-properties',
    'users.html': 'nav-users',
    'bookings.html': 'nav-bookings',
    'admin.html': 'nav-admin'
  };
  const activeId = linkByPath[path] || 'nav-dashboard';
  const activeEl = document.getElementById(activeId);
  if (activeEl) activeEl.classList.add('active');

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', signOutUser);

  const nameEl = document.getElementById('topAdminName');
  const emailEl = document.getElementById('topAdminEmail');
  if (nameEl && profile?.name) nameEl.textContent = profile.name;
  if (emailEl && auth.currentUser?.email) emailEl.textContent = auth.currentUser.email;
}
