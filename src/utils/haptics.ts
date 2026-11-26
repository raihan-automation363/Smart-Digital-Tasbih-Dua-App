export function isVibrationSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function'
  );
}

export function triggerTapVibration(): boolean {
  if (!isVibrationSupported()) return false;
  try {
    return navigator.vibrate(14);
  } catch {
    return false;
  }
}

export function triggerCompletionVibration(): boolean {
  if (!isVibrationSupported()) return false;
  try {
    return navigator.vibrate([45, 55, 85]);
  } catch {
    return false;
  }
}
