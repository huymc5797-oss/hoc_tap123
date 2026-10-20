/**
 * STUDYVERSE - AUTHENTICATION CONTROLLER (LOCAL STORAGE MODE)
 */

function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  if (username.length < 3) {
    showToast('Tên tài khoản phải có ít nhất 3 ký tự', 'error');
    return;
  }
  if (password.length < 6) {
    showToast('Mật khẩu phải có ít nhất 6 ký tự', 'error');
    return;
  }
  if (password !== confirm) {
    showToast('Mật khẩu xác nhận không khớp', 'error');
    return;
  }

  // Lấy danh sách user hiện có
  const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
  const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (existingUser) {
    showToast('Tên tài khoản này đã tồn tại', 'error');
    return;
  }

  // Tạo user mới
  const newUser = {
    id: 'user-' + Date.now(),
    username: username,
    password: btoa(password), // Mã hóa cơ bản phía client
    role: users.length === 0 ? 'admin' : 'user', // Tài khoản đầu tiên tự động làm Admin
    xp: 0,
    level: 1,
    streak: 1,
    study_hours: 0,
    created_at: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
  
  // Tự động đăng nhập luôn
  localStorage.setItem(CONFIG.STORAGE_KEYS.SESSION, JSON.stringify(newUser));

  showToast('Đăng ký thành công! Đang chuyển hướng...', 'success');
  setTimeout(() => {
    window.location.href = './trangchu.html';
  }, 1000);
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user || user.password !== btoa(password)) {
    showToast('Tên tài khoản hoặc mật khẩu không chính xác', 'error');
    return;
  }

  // Lưu phiên đăng nhập
  localStorage.setItem(CONFIG.STORAGE_KEYS.SESSION, JSON.stringify(user));
  showToast('Đăng nhập thành công!', 'success');
  setTimeout(() => {
    window.location.href = './trangchu.html';
  }, 1000);
}

function handleLogout() {
  localStorage.removeItem(CONFIG.STORAGE_KEYS.SESSION);
  showToast('Đã đăng xuất thành công', 'success');
  setTimeout(() => {
    window.location.href = './trangchu.html';
  }, 1000);
}
