---
title: 'Open Source in the Vibe Coding Era: In Crisis, Not Dying'
description: 'AI and vibe coding are straining open source: slop PRs, collapsing docs traffic, licenses under pressure. Why the model is renegotiating, not dying.'
pubDate: 2026-10-02
tags: ['ai', 'open-source', 'vibe-coding', 'software-engineering']
draft: true
---

Look at January 2026 alone. tldraw started automatically closing pull requests from external contributors. Four economists published a paper titled, without hedging, "Vibe Coding Kills Open Source". Tailwind Labs laid off most of its engineering team, citing the impact of AI on its business. And curl, one of the most widely deployed pieces of software on the planet, shut down its bug bounty because the reports had become mostly noise.

Put those together and the headline writes itself: open source is dying. I don't think it is. I think it is in a real crisis, but the crisis is not where the headlines put it. The code is fine. What is breaking is the set of unwritten agreements that kept people paid, kept review manageable and kept licenses meaningful. Those are being renegotiated, project by project, right now.

> **Key Takeaways**
>
> - Open source activity is growing, not shrinking: GitHub counted 1.128 billion contributions to public repositories in the year to August 2025, up 13%.
> - What is under pressure is the economics and the etiquette: projects funded by documentation traffic are losing it, and maintainers are drowning in AI-generated pull requests and reports.
> - AI-assisted rewrites are testing whether copyleft licenses still bind when reimplementing code is cheap.
> - The model is adapting: contribution gates, disclosure rules such as the `Assisted-by:` trailer, and institutional funding are spreading.
> - The quiet risk is the pipeline from first-time contributor to maintainer. If the open door closes, who maintains things in ten years?

## The short answer: three layers, three different stories

"Open source" bundles three things that are moving in different directions:

1. **The code and the licenses.** Public repositories, packages, infrastructure. This layer is growing.
2. **The business model.** How the people who write the code get paid, often indirectly through attention: documentation visits, consulting leads, paid add-ons. This layer is leaking.
3. **The social contract of contribution.** The assumption that a pull request is a gift from someone who tried, and that reviewing it is worth the maintainer's time. This layer is under the most strain.

Most "open source is dying" arguments describe the second or third layer and conclude something about the first. Keeping them apart makes the picture less dramatic and more useful.

<figure>
<svg viewBox="0 0 440 470" role="img" aria-labelledby="oss-tl-title oss-tl-desc" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-width:440px;color:inherit">
<title id="oss-tl-title">Open source and AI: a timeline from July 2025 to August 2026</title>
<desc id="oss-tl-desc">A vertical timeline of nine events. July 2025: curl's maintainer writes "Death by a thousand slops". October 2025: AI-assisted analyzers lead to about 50 bug fixes in curl. January 2026: tldraw closes external pull requests, the "Vibe Coding Kills Open Source" paper appears, Tailwind lays off most engineers, and curl ends its bug bounty. February 2026: GitHub adds settings to restrict pull requests, and an AI agent publishes an attack on a matplotlib maintainer. March 2026: the chardet AI rewrite is relicensed and Jazzband announces it is winding down. May 2026: QEMU considers relaxing its AI ban. August 2026: Debian votes to allow responsible use of generative AI.</desc>
<g fill="currentColor" font-family="system-ui, sans-serif" font-size="16">
<line x1="92" y1="20" x2="92" y2="452" stroke="currentColor" stroke-width="2" opacity="0.6"/>
<text x="10" y="31" font-weight="bold">Jul 2025</text><circle cx="92" cy="26" r="6"/><text x="108" y="31">curl: "Death by a thousand slops"</text>
<text x="10" y="79" font-weight="bold">Oct 2025</text><circle cx="92" cy="74" r="6"/><text x="108" y="79">AI analyzers: ~50 real curl fixes</text>
<text x="10" y="127" font-weight="bold">Jan 2026</text><circle cx="92" cy="122" r="6"/><text x="108" y="127">tldraw auto-closes external PRs</text>
<text x="108" y="151">"Vibe Coding Kills Open Source"</text>
<text x="108" y="175">Tailwind lays off 3 of 4 engineers</text>
<text x="108" y="199">curl ends its bug bounty</text>
<text x="10" y="247" font-weight="bold">Feb 2026</text><circle cx="92" cy="242" r="6"/><text x="108" y="247">GitHub: restrict or disable PRs</text>
<text x="108" y="271">AI agent attacks matplotlib maintainer</text>
<text x="10" y="319" font-weight="bold">Mar 2026</text><circle cx="92" cy="314" r="6"/><text x="108" y="319">chardet AI rewrite: LGPL to MIT</text>
<text x="108" y="343">Jazzband announces wind-down</text>
<text x="10" y="391" font-weight="bold">May 2026</text><circle cx="92" cy="386" r="6"/><text x="108" y="391">QEMU considers relaxing AI ban</text>
<text x="10" y="439" font-weight="bold">Aug 2026</text><circle cx="92" cy="434" r="6"/><text x="108" y="439">Debian: AI allowed, human accountable</text>
</g>
</svg>
<figcaption>Fourteen months of open source and AI. The early events are mostly defensive; the later ones are attempts to write new rules. Sources are linked in the sections below.</figcaption>
</figure>

## Pressure 1: the attention economy that funded open source is leaking

A lot of open source is paid for indirectly. Developers read the docs, discover the commercial product, and some of them buy it. That funnel assumes developers visit the docs.

In January 2026, Tailwind's creator Adam Wathan closed a pull request that would have added an LLM-friendly `llms.txt` endpoint to the documentation, and [explained why in the thread](https://github.com/tailwindlabs/tailwindcss.com/pull/2388): "Traffic to our docs is down about 40% from early 2023 despite Tailwind being more popular than ever." Revenue was "down close to 80%", and "75% of the people on our engineering team lost their jobs here yesterday."

That is the mechanism in one company. The framework is used more than ever, through AI assistants that already know it, and the people who build it see less of the attention that used to pay them.

The economists Miklós Koren, Gábor Békés, Julian Hinz and Aaron Lohmann formalize the same idea in [Vibe Coding Kills Open Source](https://arxiv.org/abs/2601.15494), a preprint from January 2026. In their model, vibe coding raises productivity but "weakens the user engagement through which many maintainers earn returns", and when open source is monetized only through that engagement, more vibe coding means fewer and worse projects. Read the conditional carefully: _when OSS is monetized only through direct user engagement_. The title is a conclusion about one funding model, not about open source as a whole. Their own closing line says sustaining it "requires major changes in how maintainers are paid", which is a call for adaptation, not a death certificate.

## Pressure 2: review is now the scarce resource

The second pressure is the one maintainers talk about most. Generating a pull request, an issue or a vulnerability report now costs seconds. Reviewing one still costs a human's time. GitHub's director of open source programs, Ashley Wolf, put it plainly in [Welcome to the Eternal September of open source](https://github.blog/open-source/maintainers/welcome-to-the-eternal-september-of-open-source-heres-what-we-plan-to-do-for-maintainers/): "The cost to create has dropped but the cost to review has not."

The evidence piled up through 2025 and 2026:

- **curl** [ended its bug bounty on 31 January 2026](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/). The program had confirmed 87 vulnerabilities since 2019, but the confirmation rate fell from around 15% in earlier years to below 5% in 2025. Daniel Stenberg blamed "the mind-numbing AI slop, humans doing worse than ever and the apparent will to poke holes rather than to help."
- **tldraw** [began auto-closing external pull requests](https://github.com/tldraw/tldraw/issues/7695) in January 2026, citing a surge of contributions generated entirely by AI that misunderstood the codebase and came with little follow-up from their authors.
- **Godot**'s Rémi Verschelde called AI-generated PRs "increasingly draining and demoralizing" for maintainers, as [reported by DevClass](https://www.devclass.com/ai-ml/2026/02/19/github-itself-to-blame-for-ai-slop-prs-say-devs/4091420).
- **Jazzband**, a Python collective that maintained 84 projects downloaded more than 150 million times a month, [announced it was winding down](https://jazzband.co/news/2026/03/14/sunsetting-jazzband) in March 2026. Its open-membership model, it said, "was designed for a world where the worst case was someone accidentally merging the wrong PR." AI spam was one reason, alongside a single-maintainer bottleneck and a governance model that never found enough volunteers to share the load.

Then came the strangest incident of the year. In February 2026, matplotlib maintainer Scott Shambaugh closed a pull request from an autonomous AI agent. The agent responded by researching him and publishing a blog post accusing him of gatekeeping. [Shambaugh's own account](https://theshamblog.com/an-ai-agent-published-a-hit-piece-on-me/) is worth reading for one sentence: "I believe that ineffectual as it was, the reputational attack on me would be effective _today_ against the right person." Maintainers are the gatekeepers of the software supply chain. Pressure on them is a security problem, not just a morale problem.

## Pressure 3: licenses assume copying is expensive

The third pressure is quieter and may matter most in the long run. Copyleft licenses such as the GPL and LGPL work because reimplementing a substantial library from scratch is expensive, so it is usually easier to accept the license.

In March 2026, chardet 7.0 shipped as a ground-up rewrite, built with Claude Code over a few days, and relicensed from LGPL to MIT (later 0BSD). Its maintainer Dan Blanchard describes the process in [a detailed and candid account](https://dan-blanchard.github.io/blog/chardet-rewrite-controversy/): he wrote a specification, the agent started from an empty repository, and he was told not to base anything on the old code. He also documents that the agent did read old source files in three sessions, including 567 lines of the original detector. Similarity tools found very little overlap. The original author, Mark Pilgrim, objected that the project had no right to relicense, [as Phoronix reported](https://www.phoronix.com/news/Chardet-LLM-Rewrite-Relicense).

I am not going to rule on who is right; that is a question for lawyers, and there is no court decision yet. The point is what the case reveals. If an AI-assisted "clean room" can reproduce the behavior of a copyleft library cheaply, the reciprocity that copyleft relies on gets weaker. Permissive licenses lose less here, because they never asked for much in return.

## The counter-evidence

If the story stopped there, "dying" would be a fair word. It doesn't.

First, activity is at record levels. [GitHub's Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/), covering September 2024 to August 2025, counted 1.128 billion contributions to public and open source repositories (up 13%), 518.7 million merged pull requests (up 29%), and 255,000 first-time open source contributors in March 2025 alone, the largest month on record. Those numbers include plenty of noise, but they are not the numbers of an ecosystem people are leaving.

Second, the same AI that floods maintainers can help them. The clearest example is curl again. In October 2025, Stenberg described [a new breed of AI-assisted analyzers](https://daniel.haxx.se/blog/2025/10/10/a-new-breed-of-analyzers/): from one researcher's first list of findings, the team merged about 50 separate bug fixes, with "remarkably few" complete false positives. The researcher, Joshua Rogers, did not paste raw tool output; he validated the findings first. The difference between slop and help was not the tool. It was whether a human took responsibility for the result.

That is the same line I drew for teams in [Vibe Coding vs. AI-Assisted Engineering](/blog/vibe-coding-vs-ai-assisted-engineering/): what matters is whether someone reviewed the work and could explain it.

## How the model is evolving

Look at what projects actually did in 2026, and a new shape appears. Four changes stand out.

**1. Open source, curated contribution.** The license stays open; the door to contributing narrows. GitHub [shipped settings](https://github.blog/changelog/2026-02-13-new-repository-settings-for-configuring-pull-request-access/) on 13 February 2026 to disable pull requests or restrict them to collaborators, and its maintainer post lists further ideas such as requiring a linked issue before a PR. This is closer to how SQLite has always worked: open code, closed contribution. It was a niche model; it is becoming a common one.

**2. Disclosure and accountability instead of blanket bans.** Early reactions were bans: QEMU, Gentoo and NetBSD rejected LLM-generated contributions. The trend since then is toward rules that put responsibility on a named human. Ghostty's [AI policy](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md) requires that "all AI usage in any form must be disclosed" and that the human "must fully understand all code", adding: "It's the people, not the tools, that are the problem." The Linux kernel, Fedora and LLVM have converged on an [`Assisted-by:` commit trailer](https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard). In May 2026 a QEMU maintainer [proposed relaxing](https://www.theregister.com/ai-and-ml/2026/05/29/qemu-mulls-relaxing-ai-contribution-ban/5248638) the project's ban for documentation and small fixes. And on 29 August 2026 Debian [voted for responsible use](https://lwn.net/Articles/1091231/): the project "neither endorses nor prohibits" the tools, and "the use of a generative AI tool does not diminish the contributor's responsibility for the work they submit."

**3. Funding that does not depend on page views.** If attention no longer pays, someone else has to. Public money is one answer: Germany's Sovereign Tech Agency says it has [invested more than €41 million across 112 critical open source projects](https://www.sovereign.tech/news/maintain-a-thon-2026). It is a small sum against the value of the software involved, but it is funding tied to how critical a project is, not to how many people visit its docs.

**4. Maintainers using AI too.** Triage bots, automated checks against contribution guidelines and AI-assisted analyzers like the ones that helped curl turn the same asymmetry around. The project that can review faster absorbs the flood better.

| Layer             | What survives                                         | What changes                              | What is at risk                                  |
| ----------------- | ----------------------------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| Code and licenses | Permissive licenses, critical infrastructure          | Copyleft enforcement is harder to rely on | Reciprocity as an incentive to contribute back   |
| Business model    | Foundations, public funding, paid support and hosting | Fewer "docs funnel" businesses            | Small companies built on documentation traffic   |
| Contribution      | Core teams, trusted contributors                      | PRs gated, AI use disclosed               | The drive-by contribution, and the newcomer path |

## The risk nobody is pricing in

The last column of that table hides the risk I worry about most. Many of today's maintainers started with a typo fix, then a "good first issue", then commit access. Every gate that keeps slop out also makes that path harder for a human beginner. The matplotlib PR that triggered the attack was on an issue the project had reserved for new human contributors, precisely because that path matters.

If the door closes for agents and humans alike, projects will be safer this year and short of maintainers in ten. The projects that handle this well will be the ones that build a separate, explicit path for people: mentorship, vouching, issues assigned to named humans. That is more work for maintainers, which brings us back to funding.

## What I'd do

**As a user or a company that depends on open source:**

- Know your critical dependencies and who maintains them. The [AI-generated code review checklist](/blog/reviewing-securing-ai-generated-code-checklist/) starts with dependencies for a reason.
- If a project you rely on sells something, buy it. If it accepts sponsorship, sponsor it. Your AI assistant reading the docs does not pay the authors.

**As a contributor:**

- Read the project's contribution and AI policy before opening anything.
- Disclose AI use, even where it is not required. An `Assisted-by:` line costs nothing.
- Never submit what you cannot explain. If a maintainer asks a question, answer it yourself.

**As a maintainer:**

- Write an AI policy, even a short one. Silence invites the worst interpretation.
- Use GitHub's PR and issue restrictions without guilt. Your review time is the project's scarcest resource.
- Keep one door deliberately open for human newcomers, and say where it is.

## Frequently asked questions

### Is open source dying because of AI?

No. Contributions and new contributors are at record levels. What is in trouble is the way many maintainers were paid, through documentation traffic and engagement, and the open contribution model, which is being flooded with low-effort AI submissions.

### Should open source projects ban AI-generated code?

The trend is away from bans and toward accountability. Projects such as Debian and Ghostty allow AI assistance but require the human contributor to understand the code and take responsibility for it, and many ask for disclosure.

### Can AI be used to get around the GPL?

It is an open legal question. The chardet relicensing showed it is technically feasible to reimplement a library with AI from a specification, but its legitimacy is disputed and untested in court.

## Conclusion

Open source is not dying. It is losing the conditions that made it look effortless: attention that paid the bills, contributions that were mostly worth reviewing, and copying that was too expensive to bother with.

- The code layer is growing; don't confuse it with the business and social layers.
- The new rules are converging on one idea: a named human is responsible for every contribution.
- The real long-term risk is the newcomer pipeline, and it needs deliberate protection and funding.

The model that comes out of this will be less open to strangers and more explicit about who answers for what. That is a loss of something real, and probably the price of keeping the rest.
