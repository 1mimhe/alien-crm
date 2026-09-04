/**
 * CRM Authentication Manager
 * Handles Bearer token lifecycle, auto-login upon token expiration (401),
 * and credential-based token renewal.
 */

// In-memory token cache for the current Worker execution environment
let inMemoryToken = null;
let tokenExpiresAt = null;

const DEFAULT_LOGIN_URL = "https://panel.hooshacrm.ir/api/auth/login";
const ALTERNATIVE_LOGIN_URLS = [
  "https://panel.hooshacrm.ir/api/auth/login",
  "https://panel.hooshacrm.ir/api/login",
  "https://panel.hooshacrm.ir/api/v1/auth/login",
];

/**
 * Log in to CRM and acquire a new Bearer token
 */
export async function loginToCRM(env) {
  const username =
    env.CRM_USERNAME ||
    env.HOOSHA_USERNAME ||
    env.CRM_PHONE ||
    env.HOOSHA_PHONE ||
    env.CRM_EMAIL ||
    env.HOOSHA_EMAIL;
  const password = env.CRM_PASSWORD || env.HOOSHA_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "نام کاربری یا رمز عبور CRM (CRM_USERNAME و CRM_PASSWORD) در متغیرهای محیطی کلودفلر تنظیم نشده است."
    );
  }

  const loginEndpoints = env.CRM_LOGIN_URL || env.HOOSHA_LOGIN_URL
    ? [env.CRM_LOGIN_URL || env.HOOSHA_LOGIN_URL]
    : ALTERNATIVE_LOGIN_URLS;

  let lastError = null;

  for (const endpoint of loginEndpoints) {
    try {
      console.log(`Attempting login to CRM via ${endpoint}...`);

      const payload = {
        username: username,
        password: password,
        phone: username,
        email: username,
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "CrmCartablePrioritizer/1.0",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        lastError = new Error(`Login failed on ${endpoint} (${res.status}): ${errBody}`);
        continue;
      }

      const data = await res.json();

      // Extract token from common response structures
      const newToken =
        data.token ||
        data.accessToken ||
        data.access_token ||
        data.jwt ||
        (data.data && (data.data.token || data.data.accessToken || data.data.access_token));

      if (newToken) {
        console.log("Successfully logged in to CRM and acquired new Bearer token.");
        inMemoryToken = newToken;
        tokenExpiresAt = Date.now() + 6 * 60 * 60 * 1000;
        return newToken;
      } else {
        lastError = new Error("Response did not contain a recognizable token field: " + JSON.stringify(data));
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to authenticate with CRM login endpoints.");
}

/**
 * Get active Bearer Token:
 * 1. Checks in-memory cached token.
 * 2. Checks CRM_BEARER_TOKEN or HOOSHA_BEARER_TOKEN from environment.
 * 3. If missing or forced refresh, logs in using credentials.
 */
export async function getValidBearerToken(env, forceRefresh = false) {
  if (forceRefresh) {
    return await loginToCRM(env);
  }

  if (inMemoryToken && (!tokenExpiresAt || Date.now() < tokenExpiresAt)) {
    return inMemoryToken;
  }

  const staticToken = env.CRM_BEARER_TOKEN || env.HOOSHA_BEARER_TOKEN;
  if (staticToken) {
    return staticToken;
  }

  const username =
    env.CRM_USERNAME ||
    env.HOOSHA_USERNAME ||
    env.CRM_PHONE ||
    env.HOOSHA_PHONE ||
    env.CRM_EMAIL ||
    env.HOOSHA_EMAIL;
  const password = env.CRM_PASSWORD || env.HOOSHA_PASSWORD;

  if (username && password) {
    return await loginToCRM(env);
  }

  throw new Error(
    "هیچ توکن یا مشخصات ورودی برای احراز هویت در سامانه CRM یافت نشد. لطفاً CRM_BEARER_TOKEN یا (CRM_USERNAME و CRM_PASSWORD) را تنظیم کنید."
  );
}

/**
 * Invalidate cached token when 401 Unauthorized is detected
 */
export function invalidateToken() {
  inMemoryToken = null;
  tokenExpiresAt = null;
}
