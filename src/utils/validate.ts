export const isValidEmail = (email: unknown): boolean => {
  return typeof email === "string" && email.includes("@");
};

export const isValidPassword = (password: unknown): boolean => {
  return typeof password === "string" && password.length >= 6;
};