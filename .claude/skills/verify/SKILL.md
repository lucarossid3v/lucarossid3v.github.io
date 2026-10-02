---
name: verify
description: Verify the blog builds and passes type checks and the site audits. Use after changing code, content or config.
---

1. Run `npm run qa` (astro check + build). Stop and report if it fails.
2. Run `npm run audit:wcag`, `npm run audit:security`, `npm run audit:google`. These scripts always exit 0, so read the printed output.
3. Summarize only real issues, grouped by audit. Ignore findings that stem from the known demo placeholders (`minrock.vercel.app`) unless the user is replacing them.
