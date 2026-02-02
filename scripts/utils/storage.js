const tokenKey = "token";
const userKey = "user";

export function saveToken(token) {
  saveToStorage(tokenKey, token);
}

export function getToken() {
  return getFromStorage(tokenKey);
}

export function saveUser(user) {
  saveToStorage(userKey, user);
}

export function logOut() {
  localStorage.removeItem(userKey);
  localStorage.removeItem(tokenKey);
}

export function getUserId() {
  const user = getFromStorage(userKey);

  if (user) {
    return user.user_display_name;
  }
  return null;
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key) {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value);
}
