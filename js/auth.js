const SUPABASE_URL = "https://ibeagogaitscqctumiqy.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_ZgNx01Yd_QbT7aNkzQW2IQ_GjA5V4N3";

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

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Có lỗi xảy ra.");
  }

  return result;
}
