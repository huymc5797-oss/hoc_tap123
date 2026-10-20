// ========================================
// STUDYVERSE - AUTHENTICATION
// ========================================

const SUPABASE_URL = "https://ibeagogaitscqctumiqy.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_ZgNx01Yd_QbT7aNkzQW2IQ_GjA5V4N3";

const HOME_URL =
  "https://huymc5797-oss.github.io/hoc_tap123/trangchu.html";

const LOGIN_URL =
  "https://huymc5797-oss.github.io/hoc_tap123/dang-nhap.html";

// ========================================
// GỌI BACKEND SUPABASE
// ========================================

async function authRequest(action, username, password) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/auth`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        action,
        username,
        password
      })
    }
  );

  const text = await response.text();

  let result;

  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(
      `Máy chủ trả về dữ liệu không hợp lệ (HTTP ${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      result.error ||
      result.message ||
      `Yêu cầu thất bại (HTTP ${response.status}).`
    );
  }

  return result;
}

// ========================================
// HIỂN THỊ THÔNG BÁO
// ========================================

function showMessage(element, text, type = "info") {
  if (!element) return;

  element.classList.remove("hidden");
  element.textContent = text;

  element.style.color =
    type === "error" ? "#dc2626" :
    type === "success" ? "#16a34a" :
    "#2563eb";
}

// ========================================
// KHỞI TẠO FORM
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  console.log("Studyverse auth.js đã tải thành công.");

  // ----------------------------------------
  // ĐĂNG NHẬP
  // ----------------------------------------

  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const usernameInput =
        document.getElementById("login-username");

      const passwordInput =
        document.getElementById("login-password");

      const message =
        document.getElementById("auth-message");

      const button =
        loginForm.querySelector('button[type="submit"]');

      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      if (!username || !password) {
        showMessage(
          message,
          "Vui lòng nhập tên đăng nhập và mật khẩu.",
          "error"
        );
        return;
      }

      if (button) button.disabled = true;

      showMessage(message, "Đang kiểm tra tài khoản...");

      try {
        const result = await authRequest(
          "login",
          username,
          password
        );

        console.log("Kết quả đăng nhập:", result);

        if (!result.user) {
          throw new Error(
            "Máy chủ chưa trả về thông tin người dùng. Cần kiểm tra Edge Function auth."
          );
        }

        // Lưu thông tin người dùng trên trình duyệt hiện tại.
        localStorage.setItem(
          "sv_user",
          JSON.stringify(result.user)
        );

        showMessage(
          message,
          "Đăng nhập thành công! Đang chuyển đến trang chủ...",
          "success"
        );

        // Chuyển trang sau khi xác thực thành công.
        window.location.assign(HOME_URL);

      } catch (error) {
        console.error("Lỗi đăng nhập:", error);

        showMessage(
          message,
          error.message || "Không thể kết nối máy chủ.",
          "error"
        );
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  // ----------------------------------------
  // ĐĂNG KÝ
  // ----------------------------------------

  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const usernameInput =
        document.getElementById("register-username");

      const passwordInput =
        document.getElementById("register-password");

      const confirmInput =
        document.getElementById("register-confirm");

      const message =
        document.getElementById("auth-message");

      const button =
        registerForm.querySelector('button[type="submit"]');

      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      const confirm = confirmInput.value;

      if (!username || !password || !confirm) {
        showMessage(
          message,
          "Vui lòng điền đầy đủ thông tin.",
          "error"
        );
        return;
      }

      if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
        showMessage(
          message,
          "Tên đăng nhập phải dài 3–24 ký tự, chỉ gồm chữ không dấu, số và dấu gạch dưới.",
          "error"
        );
        return;
      }

      if (password.length < 8) {
        showMessage(
          message,
          "Mật khẩu phải có ít nhất 8 ký tự.",
          "error"
        );
        return;
      }

      if (password !== confirm) {
        showMessage(
          message,
          "Mật khẩu nhập lại không khớp.",
          "error"
        );
        return;
      }

      if (button) button.disabled = true;

      showMessage(message, "Đang tạo tài khoản...");

      try {
        const result = await authRequest(
          "register",
          username,
          password
        );

        console.log("Kết quả đăng ký:", result);

        showMessage(
          message,
          result.message || "Đăng ký thành công!",
          "success"
        );

        setTimeout(() => {
          window.location.assign(LOGIN_URL);
        }, 1000);

      } catch (error) {
        console.error("Lỗi đăng ký:", error);

        showMessage(
          message,
          error.message || "Không thể kết nối máy chủ.",
          "error"
        );
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

});
