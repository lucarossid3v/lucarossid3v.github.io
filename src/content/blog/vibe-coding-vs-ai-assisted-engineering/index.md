---
title: 'Vibe Coding vs. AI-Assisted Engineering: Where I Draw the Line'
description: 'Vibe coding and AI-assisted development are not synonyms. A practical test based on review and explainability, plus a team policy for when each fits.'
pubDate: 2026-10-02
tags: ['ai', 'vibe-coding', 'software-engineering', 'code-review']
draft: false
---

Picture two developers opening the same AI coding tool on the same morning. One describes a feature, accepts whatever comes back, and ships it when it seems to work. The other reads the diff, runs the tests and rewrites the parts that don't convince. Both say they are "coding with AI". Only one of them is vibe coding.

Vibe coding and AI-assisted development often get used as synonyms, and that hides a real difference in risk. This post offers a test for telling them apart, an honest look at why the line is getting harder to see, and a policy you can apply to a team.

> **Key Takeaways**
>
> - The line is not the tool you use. It is whether you review the code and could explain it to someone else.
> - Skipping review is reasonable for throwaway work and risky for anything you will maintain.
> - The line is blurring. Simon Willison, who draws it carefully, says he no longer reviews every line his coding agents write.
> - Decide by consequence and lifespan, not by habit, and write the decision down as a team policy.

## Where the term came from, and how it drifted

Andrej Karpathy coined "vibe coding" on 6 February 2025, according to [Simon Willison's write-up](https://simonwillison.net/2025/Mar/19/vibe-coding/). Willison defines it narrowly: building software with an LLM without reviewing the code it writes.

That definition matters because the term did not stay narrow. By March 2025 it was already being applied to any code written with AI help, and Willison pushed back, arguing that using AI to help write code is not the same thing as not caring about the code that comes out.

In my reading, the stretched version of the term causes two kinds of confusion. Skeptics use it to dismiss all AI-assisted work as sloppy. Enthusiasts use it to defend sloppy work as modern practice. Neither helps.

## The line: do you review it, and could you explain it?

The most practical test I know also comes from [Willison's March 2025 post](https://simonwillison.net/2025/Mar/19/vibe-coding/). He won't commit code to his repository if he couldn't explain exactly what it does to somebody else. Under that rule, code an LLM wrote but that you reviewed, tested and understand is ordinary software development. Code you ran and never read is vibe coding.

I'd adopt that as the working definition, because it is checkable. It doesn't depend on which tool or model you use, or on how much of the code the AI typed. It depends on one thing: after the output appears, did you read it and take responsibility for it, or did you run it to see whether it breaks?

Two follow-up questions make the test more useful in practice:

1. **Can I explain this change to a colleague without opening the AI chat?**
2. **What breaks, and for whom, if I'm wrong?**

The first is about understanding. The second is about consequence. The right amount of review depends on both, and on how long the code will live.

<figure>
<svg viewBox="0 0 420 330" role="img" aria-labelledby="spectrum-title spectrum-desc" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-width:420px;color:inherit">
<title id="spectrum-title">Review depth from vibe coding to engineering</title>
<desc id="spectrum-desc">A vertical scale from vibe coding at the top to engineering at the bottom, with four stops: run it and check the output; skim the diff and run the tests; read every line and own the tests; never unreviewed, read line by line.</desc>
<g fill="currentColor" font-family="system-ui, sans-serif" font-size="19">
<line x1="30" y1="50" x2="30" y2="300" stroke="currentColor" stroke-width="3"/>
<circle cx="30" cy="66" r="9"/>
<circle cx="30" cy="140" r="9"/>
<circle cx="30" cy="214" r="9"/>
<circle cx="30" cy="288" r="9"/>
<text x="10" y="26" font-weight="bold">Vibe coding</text>
<text x="55" y="73">Run it, check the output</text>
<text x="55" y="147">Skim the diff, run the tests</text>
<text x="55" y="221">Read every line, own the tests</text>
<text x="55" y="295">Auth, payments, data: line by line</text>
<text x="10" y="325" font-weight="bold">Engineering</text>
</g>
</svg>
<figcaption>Review depth is a spectrum, from running the code and checking the output (top) to reading every line (bottom). The right stop depends on how long the code will live and what breaks if it is wrong.</figcaption>
</figure>

## Why the line is blurring

I'd be dishonest if I presented the line as sharp. In May 2026, Willison wrote that [vibe coding and agentic engineering are getting closer than he'd like](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/). By "agentic engineering" he means professionals applying their expertise while using coding agents to build production systems. His own words: "As the coding agents get more reliable, I'm not reviewing every line of code that they write anymore, even for my production level stuff."

That is a candid admission from someone who draws the distinction carefully. My reading is that when an agent is right most of the time, reading every line starts to feel like wasted effort, and the habit can erode. Willison also notes that the bottleneck has moved upstream, from typing code to design and planning, and that agents cannot be held accountable the way a colleague can.

So the useful question changes. It is no longer "do I review everything?" It becomes "where do I still insist on reviewing, and why there?"

## What the evidence says about trust and speed

Developers are using these tools in very large numbers, and many of them report doubts about accuracy. The [Stack Overflow 2025 Developer Survey](https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/), a self-reported survey with over 49,000 responses from 177 countries, found that:

- 84% of respondents use or plan to use AI tools in their development process, up from 76% in 2024.
- 46% said they don't trust the accuracy of AI tool output, up from 31% the year before.
- 45% named debugging AI-generated code as a time-consuming frustration.
- Nearly 77% said vibe coding is not part of their professional development work.

These are the latest published results I could verify. The 2025 edition is the most recent one with a primary source I could check.

<figure>
<svg viewBox="0 0 420 270" role="img" aria-labelledby="so-title so-desc" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-width:420px;color:inherit">
<title id="so-title">Stack Overflow 2025 survey: AI tool usage, distrust and debugging cost</title>
<desc id="so-desc">Horizontal bars: 84 percent use or plan to use AI tools, 46 percent do not trust the accuracy of the output, and 45 percent say debugging AI-generated code is time-consuming. Source: Stack Overflow 2025 Developer Survey.</desc>
<g font-family="system-ui, sans-serif" font-size="18" fill="currentColor">
<text x="10" y="26">Use or plan to use AI tools</text>
<rect x="10" y="36" width="294" height="24" rx="3" opacity="0.9"/>
<text x="312" y="56" font-weight="bold">84%</text>
<text x="10" y="100">Distrust the accuracy of output</text>
<rect x="10" y="110" width="161" height="24" rx="3" opacity="0.75"/>
<text x="179" y="130" font-weight="bold">46%</text>
<text x="10" y="174">Debugging AI code is time-consuming</text>
<rect x="10" y="184" width="158" height="24" rx="3" opacity="0.6"/>
<text x="176" y="204" font-weight="bold">45%</text>
<text x="10" y="248" font-size="14" opacity="0.85">Source: Stack Overflow 2025 Developer Survey</text>
</g>
</svg>
<figcaption>Three separate survey questions, with bar length proportional to the percentage (the full width is 100%).</figcaption>
</figure>

One more data point deserves care. In 2025, METR ran a randomized controlled trial with 16 experienced open-source developers across 246 tasks. [METR's randomized controlled trial](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) found that developers took 19% longer to complete issues when allowed to use AI tools, while believing afterwards that AI had sped them up by 20%. The tools were mainly Cursor Pro with Claude 3.5 and 3.7 Sonnet.

That result describes early-2025 tools, and METR itself now says these results are out of date and no longer reflect the current impact of AI models on open-source developer productivity. I include it for one reason only: it suggests, in one small study, that the feeling of being faster can differ from a measured result. That is an argument for checking the work, not for avoiding the tools.

## A decision matrix: when each approach is right

Combine the second question, consequence, with how long the code will live, and the answer becomes less ideological.

|                | **Low consequence if wrong**                                 | **High consequence if wrong**                                    |
| -------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Throwaway**  | Vibe coding is fine. Run it, check the output, delete it.    | Don't. Throwaway code that touches real data is still dangerous. |
| **Long-lived** | Skim the diff and run the tests. Spot-check the risky parts. | Engineering. Read every line and own the tests.                  |

The review depth I'd recommend for different kinds of work looks like this:

| Task type                                                                        | Review depth                                                                      |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Throwaway scripts, one-off data fixes, local prototypes                          | Run it and check the output. Reading every line is optional.                      |
| Boilerplate, scaffolding, repetitive CRUD, tests for existing code               | Skim the diff, run the tests, spot-check the risky parts.                         |
| Business logic, anything customer-facing                                         | Read every line. Write or review the tests yourself.                              |
| Authentication, permissions, payments, personal data, migrations, infrastructure | Never unreviewed. Read line by line, and have a second person look when possible. |

### A hypothetical: the tenant leak

Imagine an AI-written database query for a multi-tenant app. It works perfectly on test data, passes a quick manual check and gets merged unread. In production it quietly returns rows from other tenants, because the tenant filter was missing from one join. Nothing crashed, so nothing warned anyone. This is an illustration, not a story from a real project, but it shows why "it works" is a weak standard for code that touches data boundaries.

## What I'd recommend in practice

For a team, I'd turn the matrix into a short policy:

- Every merged change has a human author who can explain it in review.
- Pull requests say when AI wrote a significant part of the change.
- Security-sensitive areas require a reviewer who did not write the prompt.
- AI-written tests are checked for whether they can fail.
- Prototypes are labeled as prototypes. They are not promoted to production without a rewrite or a full review.

> [!TIP]
> A test the AI wrote can pass for the wrong reasons. Before trusting an AI-written test, break the code on purpose and check that the test fails. A test that cannot fail proves nothing.

None of this slows down throwaway work, which is where vibe coding fits best. It only makes the decision to skip review explicit, so that it is a choice and not a drift.

There is also a management angle. If an agent writes code that nobody reads and it fails, who is accountable? The answer has to be a person, named in advance. A policy that says so, and says where review is mandatory, is cheaper than working out the answer during an incident.

## Frequently asked questions

### Is vibe coding bad?

No. For prototypes, throwaway scripts and learning, it can be a quick way to build. The risk appears when unreviewed code becomes software someone has to maintain, secure or answer for.

### Can a non-developer vibe code a product?

A working prototype, often yes. A product people depend on is harder, because maintenance and security still require someone who can read the code and understand what it does.

### Does using an AI agent count as vibe coding?

Not by itself. Using an agent is a tool choice. Whether it is vibe coding or AI-assisted development depends on whether you review what it produces and could explain it.

## Conclusion

The distinction between vibe coding and AI-assisted engineering is not about tools or about how much the AI wrote. It is about whether a person reviewed the result and can answer for it.

- Ask two questions: can I explain this, and what breaks if I'm wrong?
- Match review depth to consequence and lifespan.
- Accept that the line is blurring, and make your team's version of it explicit.

I write about AI in practice on this blog.
