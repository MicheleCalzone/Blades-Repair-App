const AUTH_STORAGE_KEY = "wpAuth";

export const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { username: "", token: "", expiresAt: "", isAuthenticated: false, user: null };
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { username: "", token: "", expiresAt: "", isAuthenticated: false, user: null };
    }

    const parsed = JSON.parse(raw);
    const username = String(parsed?.username || "").trim();
    const token = String(parsed?.token || "").trim();
    const expiresAt = String(parsed?.expiresAt || "");
    const user = parsed?.user || null;

    return {
      username,
      token,
      expiresAt,
      user,
      isAuthenticated: Boolean(username && token),
    };
  } catch {
    return { username: "", token: "", expiresAt: "", isAuthenticated: false, user: null };
  }
};

export const withAuth = (options = {}) => {
  const auth = getStoredAuth();
  const headers = new Headers(options.headers || {});

  if (auth.token) {
    headers.set("Authorization", `Bearer ${auth.token}`);
    headers.set("Accept", "application/json");
  }

  return {
    ...options,
    headers,
  };
};

export const persistAuth = (username, token, expiresAt, user = null) => {
  const next = {
    username: String(username || "").trim(),
    token: String(token || "").trim(),
    expiresAt: String(expiresAt || ""),
    user: user || null,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));

  return {
    ...next,
    isAuthenticated: Boolean(next.username && next.token),
  };
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const loginWithWpCredentials = async ({ username, password, deviceName = "Blades Repair App" }) => {
  const response = await fetch(
    "https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        device_name: deviceName,
      }),
      credentials: "include",
    }
  );

  if (response.status === 401 || response.status === 403) {
    throw new Error("Credenziali WordPress non valide");
  }

  if (!response.ok) {
    let message = "Accesso non riuscito";
    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = await response.json();

  if (!data?.token) {
    throw new Error("Login non riuscito: token non ricevuto");
  }

  return data;
};

export const logoutSession = async () => {
  const auth = getStoredAuth();
  if (!auth.token) {
    clearStoredAuth();
    return true;
  }

  try {
    await fetch(
      "https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/logout",
      withAuth({
        method: "POST",
        credentials: "include",
      })
    );
  } catch {
    // ignore network/logout failures and clear local session anyway
  }

  clearStoredAuth();
  return true;
};
