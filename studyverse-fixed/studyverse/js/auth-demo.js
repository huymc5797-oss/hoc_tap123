(function(){
  const show = (message, success = false) => {
    const el = document.getElementById('auth-message');
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden', 'success');
    if (success) el.classList.add('success');
  };

  // Demo auth: accounts live only in this browser. This is NOT production authentication.
  // Hash passwords instead of saving them as readable text.
  async function passwordHash(password) {
    if (window.crypto && window.crypto.subtle && window.isSecureContext) {
      const bytes = new TextEncoder().encode(password);
      const digest = await window.crypto.subtle.digest('SHA-256', bytes);
      return 'sha256:' + Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    }
    // Compatibility fallback for opening the static demo directly via file://.
    // This is only a local demo hash, not cryptographically secure.
    let h1 = 0x811c9dc5, h2 = 0x9e3779b9;
    for (let i = 0; i < password.length; i++) {
      const c = password.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 0x01000193);
      h2 = Math.imul(h2 ^ (c + i), 0x85ebca6b);
    }
    return 'demo:' + (h1 >>> 0).toString(16) + (h2 >>> 0).toString(16) + password.length.toString(16);
  }

  function readAccounts() {
    try { return JSON.parse(localStorage.getItem('sv_demo_accounts') || '{}'); }
    catch (_) { return {}; }
  }
  function saveAccounts(accounts) {
    localStorage.setItem('sv_demo_accounts', JSON.stringify(accounts));
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    if (!username || !password) return show('Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.');

    const submit = loginForm.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Đang đăng nhập…';
    try {
      const accounts = readAccounts();
      const key = username.toLowerCase();
      const record = accounts[key];
      if (!record) return show('Tài khoản chưa tồn tại trên trình duyệt này. Hãy đăng ký trước.');
      const hash = await passwordHash(password);
      if (!record.passwordHash || record.passwordHash !== hash) {
        return show('Tên tài khoản hoặc mật khẩu không đúng.');
      }
      localStorage.setItem('sv_user', JSON.stringify({ username: record.username || username, loggedInAt: new Date().toISOString() }));
      show('Đăng nhập thành công! Đang chuyển đến trang chủ…', true);
      setTimeout(() => { window.location.href = 'trangchu.html'; }, 500);
    } catch (error) {
      show('Không thể đăng nhập do trình duyệt đang chặn lưu trữ. Hãy mở bằng Live Server hoặc bật local storage.');
    } finally {
      submit.disabled = false;
      submit.innerHTML = 'Đăng nhập <span>→</span>';
    }
  });

  const registerForm = document.getElementById('register-form');
  if (registerForm) registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    if (!/^[A-Za-z0-9_]{3,30}$/.test(username)) return show('Tên tài khoản cần từ 3–30 ký tự, chỉ gồm chữ không dấu, số và dấu gạch dưới.');
    if (password.length < 8) return show('Mật khẩu phải có ít nhất 8 ký tự.');
    if (password !== confirmPassword) return show('Hai mật khẩu chưa trùng khớp.');

    const submit = registerForm.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Đang tạo tài khoản…';
    try {
      const accounts = readAccounts();
      const key = username.toLowerCase();
      if (accounts[key]) return show('Tên tài khoản này đã được sử dụng. Hãy chọn tên khác hoặc đăng nhập.');
      accounts[key] = { username, passwordHash: await passwordHash(password), createdAt: new Date().toISOString() };
      saveAccounts(accounts);
      show('Tạo tài khoản thành công! Đang chuyển đến trang đăng nhập…', true);
      registerForm.reset();
      setTimeout(() => { window.location.href = 'dang-nhap.html'; }, 700);
    } catch (error) {
      show('Không thể lưu tài khoản. Hãy mở website bằng Live Server hoặc kiểm tra cài đặt lưu trữ của trình duyệt.');
    } finally {
      submit.disabled = false;
      submit.innerHTML = 'Tạo tài khoản <span>→</span>';
    }
  });
})();
