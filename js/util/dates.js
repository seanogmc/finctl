const now = new Date();

export function getStartOfMonth() {
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export function getEndOfMonth() {
  return new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  ).toISOString();
}
