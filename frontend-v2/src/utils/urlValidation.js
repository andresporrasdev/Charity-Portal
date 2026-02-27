/**
 * Validates if a URL is safe for redirects
 * Only allows relative paths starting with '/' or same-origin absolute URLs
 * Rejects external URLs, javascript:, data:, and other dangerous protocols
 *
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if the URL is safe, false otherwise
 */
export const isSafeRedirectUrl = (url) => {
  // Return false for null, undefined, or empty strings
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }

  const trimmedUrl = url.trim();

  // Allow relative paths starting with '/'
  if (trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('//')) {
    // Additional check: ensure it doesn't contain dangerous patterns
    // Reject paths with protocol-like patterns
    if (trimmedUrl.includes('://')) {
      return false;
    }
    // Reject paths with javascript: or data: patterns
    if (/^(javascript|data|vbscript|file):/i.test(trimmedUrl)) {
      return false;
    }
    return true;
  }

  // For absolute URLs, only allow same-origin
  try {
    const urlObj = new URL(trimmedUrl, window.location.origin);

    // Reject dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    if (dangerousProtocols.some(protocol => urlObj.protocol.toLowerCase().startsWith(protocol.replace(':', '')))) {
      return false;
    }

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol.toLowerCase())) {
      return false;
    }

    // Only allow same origin (same protocol, host, and port)
    if (urlObj.origin === window.location.origin) {
      return true;
    }

    // Reject external URLs
    return false;
  } catch {
    // If URL parsing fails, it's not safe
    return false;
  }
};

/**
 * Gets a safe redirect URL, falling back to '/' if the provided URL is unsafe
 *
 * @param {string} url - The URL to validate and return
 * @returns {string} - Safe redirect URL or '/' as fallback
 */
export const getSafeRedirectUrl = (url) => {
  if (isSafeRedirectUrl(url)) {
    return url;
  }
  return '/';
};
