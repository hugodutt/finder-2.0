const NOREPLY = [/@users\.noreply\.github\.com$/i, /@noreply\.github\.com$/i];

export function classify(email: string) {
  return NOREPLY.some((re) => re.test(email.toLowerCase())) ? "noreply" : "real";
}

export function isRoutable(email: string) {
  return !/\.local$|\.lan$|\.home$|\.internal$|example\.com$/i.test(email);
}
