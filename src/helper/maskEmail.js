function maskEmail(email) {
  if (!email) return "";

  const [name, domain] = email.split("@");

  if (name.length <= 2) {
    return `${name[0]}*@${domain}`;
  }

  const first = name.slice(0, 2);
  const last = name.slice(-2);
  const masked = "*".repeat(name.length - 4);

  return `${first}${masked}${last}@${domain}`;
}
