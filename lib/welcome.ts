// The homepage welcome screen shows once per browser session. Kept out of the
// client component so the server page can inline the script.

export const WELCOME_KEY = 'lp-welcome-seen'

/** Runs before first paint: marks a returning visitor so CSS hides the welcome. */
export const welcomeBootstrapScript = `try{if(sessionStorage.getItem('${WELCOME_KEY}'))document.documentElement.dataset.welcome='skip'}catch(e){}`
