const env = import.meta.env;
export function envProvider(key) {
  if (env[key]) return env[key];
  else throw new Error(`Environment variable ${key} not found`);
}
