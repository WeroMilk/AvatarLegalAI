// Sistema de superusuario para pruebas
// Email: admin@avatar.com
// Password: admin123

export const SUPERUSER_EMAIL = "admin@avatar.com";
export const SUPERUSER_PASSWORD = "admin123";

export function isSuperUser(email: string | null | undefined): boolean {
  return email === SUPERUSER_EMAIL;
}

export function shouldSkipPayment(email: string | null | undefined): boolean {
  return isSuperUser(email);
}
