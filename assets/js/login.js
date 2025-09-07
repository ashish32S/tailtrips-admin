import { signIn } from './auth.js';

const form = document.getElementById('loginForm');
const notice = document.getElementById('loginNotice');
const loginBtn = document.getElementById('loginBtn');

function showMessage(text, isError = false) {
  notice.textContent = text;
  notice.classList.remove('hidden');
  notice.style.borderColor = isError ? '#ef4444' : '#1f2937';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  notice.classList.add('hidden');
  loginBtn.disabled = true;
  try {
    const email = document.getElementById('login_email').value.trim();
    const password = document.getElementById('login_password').value;
    await signIn(email, password);
    window.location.href = 'index.html';
  } catch (err) {
    showMessage(err.message || 'Login failed', true);
  } finally {
    loginBtn.disabled = false;
  }
});
