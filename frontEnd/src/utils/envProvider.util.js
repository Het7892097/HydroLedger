export function envProvider(key) {
  const value = import.meta.env[key];
  if (value) return value;
  throw new Error(`Environment variable ${key} not found`);
}
