import "dotenv/config";

export function envProvider(key) {
  if (process.env[key]) return process.env[key];
  else throw new Error(`Environment variable ${key} not found`);
}
