const BASE_RATE = 12.92;

const RATES = Object.freeze({
  base: BASE_RATE,
  saturday: (BASE_RATE * 1.41).toFixed(2),
  after8pm: (BASE_RATE * 1.41).toFixed(2),
  sunday: (BASE_RATE * 1.83).toFixed(2),
});

export function calcPay(shift) {
  const start = new Date(shift.start.dateTime);
  const end = new Date(shift.end.dateTime);
  const hours = (end - start) / 3600000;

  if (start.getDay() > 0 && start.getDay() <= 5) {
    if (end.getHours() > 20) {
      const hrsAfter8 = end.getHours() - 20;
      const hrsBefore8 = hours - hrsAfter8;

      return Number(
        (hrsBefore8 * RATES.base + hrsAfter8 * RATES.after8pm).toFixed(2),
      );
    } else {
      return Number((hours * RATES.base).toFixed(2));
    }
  } else if (start.getDay() === 6) {
    return Number((hours * RATES.saturday).toFixed(2));
  } else if (start.getDay() === 0) {
    return Number((hours * RATES.sunday).toFixed(2));
  }
}
