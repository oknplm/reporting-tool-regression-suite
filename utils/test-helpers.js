/**
 * Small, dependency-free helpers reused across specs. Keeping these out of
 * page objects and out of the specs themselves makes both easier to read.
 */

/** Generates a unique, sortable name so parallel test runs don't collide. */
function uniqueName(prefix) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix} ${stamp}`;
}

/** Waits for a Playwright download and returns its suggested filename. */
async function captureDownloadFilename(page, triggerAction) {
  const [download] = await Promise.all([page.waitForEvent('download'), triggerAction()]);
  return download.suggestedFilename();
}

/** Retries an async assertion a fixed number of times with a delay (for eventually-consistent UI states). */
async function retryUntil(fn, { retries = 5, delayMs = 1000 } = {}) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise((resolve) => {
        setTimeout(resolve, delayMs);
      });
    }
  }
  throw lastError;
}

module.exports = { uniqueName, captureDownloadFilename, retryUntil };
