// Phone numbers are stored in international format without spaces ("+22890123456").

/** "+22890123456" → "+228 90 12 34 56"; "+33612345678" → "+33 6 12 34 56 78"; "+15145550142" → "+1 514 555 0142". */
export function formatPhone(phone: string) {
  const togo = /^\+228(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(phone);
  if (togo) return `+228 ${togo.slice(1).join(" ")}`;
  const europe = /^\+(33|32)(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(phone);
  if (europe) return `+${europe[1]} ${europe.slice(2).join(" ")}`;
  const northAmerica = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(phone);
  if (northAmerica) return `+1 ${northAmerica.slice(1).join(" ")}`;
  return phone;
}

/** Digits only, for wa.me links and searching. */
export function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}
