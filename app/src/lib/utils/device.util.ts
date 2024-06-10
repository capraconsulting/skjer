function isSafari() {
  if (typeof window !== "undefined") {
    const userAgent = window.navigator.userAgent;
    const isChrome = userAgent.includes("Chrome") || userAgent.includes("Chromium");
    return userAgent.includes("Safari") && !isChrome;
  }
  return false;
}

function isIOS() {
  if (typeof window !== "undefined") {
    const userAgent = window.navigator.userAgent;
    return /iPad|iPhone/.test(userAgent);
  }
  return false;
}

export function isSafariOrIOS() {
  return isSafari() || isIOS();
}
