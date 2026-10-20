const SUPABASE_URL = "https://ibeagogaitscqctumiqy.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_ZgNx01Yd_QbT7aNkzQW2IQ_GjA5V4N3";

async function authRequest(action, username, password) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ action, username, password })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Đã xảy ra lỗi.");
  }

  return result;
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value;
      const message = document.getElementById("auth-message");
      const button = loginForm.querySelector('button[type="submit"]');

      message.classList.remove("hidden");
      message.textContent = "Đang kiểm tra tài khoản...";
      button.disabled = true;

      try {
        const result = await authRequest("login", username, password);

        message.textContent = result.message;

        // Chưa chuyển trang vì backend hiện chưa cấp phiên đăng nhập.
      } catch (error) {
  console.error("Lỗi xác thực:", error);
  message.textContent = error.message || "Không thể kết nối máy chủ.";
} finally {
  button.disabled = false;
}
});
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("register-username").value.trim();
      const password = document.getElementById("register-password").value;
      const confirm = document.getElementById("register-confirm").value;
      const message = document.getElementById("auth-message");
      const button = registerForm.querySelector('button[type="submit"]');

      message.classList.remove("hidden");

      if (password !== confirm) {
        message.textContent = "Mật khẩu nhập lại không khớp.";
        return;
      }

      message.textContent = "Đang tạo tài khoản...";
      button.disabled = true;

      try {
        const result = await authRequest("register", username, password);

        message.textContent = result.message;

        setTimeout(() => {
          window.location.href = "dang-nhap.html";
        }, 1000);
      } catch (error) {
        message.textContent = error.message;
      } finally {
        button.disabled = false;
      }
    });
  }
});
