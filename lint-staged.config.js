module.exports = {
  "app/**/*.{ts,tsx}": [
    "yarn workspace @lyra/app format",
    "yarn workspace @lyra/app lint --fix --quiet",
    () => "yarn workspace @lyra/app tsc --noEmit",
  ],
  "ui/**/*.{ts,tsx}": [
    "yarn workspace @lyra/ui format",
    "yarn workspace @lyra/ui lint --fix --quiet",
    () => "yarn workspace @lyra/ui tsc --skipLibCheck --noEmit",
  ],
  "sdk/**/*.ts": [
    "yarn workspace @lyrafinance/lyra-js format",
    "yarn workspace @lyrafinance/lyra-js lint --fix --quiet",
    () => "yarn workspace @lyrafinance/lyra-js build",
  ],
};
