export function formatToWon(price: number) {
  return price.toLocaleString("ko-KR", { style: "currency", currency: "KRW" });
}

export function formatToDate(date: Date) {
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / (1000 * 60 * 60 * 24));
  const format = new Intl.RelativeTimeFormat("ko");

  return format.format(diff, "days");
}
