export function createHeaders(json = true): Headers {
  const headers = new Headers();

  if (json) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Accept", "application/json");
  headers.set("ngrok-skip-browser-warning", "true");

  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export function createHeadersNoAuth(json = true): Headers {
  const headers = new Headers();

  if (json) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Accept", "application/json");
  headers.set("ngrok-skip-browser-warning", "true");

  return headers;
}