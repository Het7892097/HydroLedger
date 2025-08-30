export default function isJWTExpired(token: string): boolean {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );

  const payload = JSON.parse(jsonPayload);
  const exp = payload.exp;
  const now = Math.floor(Date.now() / 1000);

  return exp < now;
}
