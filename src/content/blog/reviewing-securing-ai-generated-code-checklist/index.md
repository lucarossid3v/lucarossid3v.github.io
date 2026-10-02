---
title: 'Reviewing and Securing AI-Generated Code: A Practical Checklist'
description: 'A practical checklist for reviewing AI-generated code: dependencies, input handling, secrets, tests and CI gates, with the research behind each check.'
pubDate: 2026-10-02
tags: ['ai', 'security', 'code-review', 'software-engineering']
draft: false
---

AI-generated code usually runs. That is the trap. It runs, the happy-path test passes, and the diff looks tidy, so it gets approved. Security is a different question, and the research says the answer is often no.

This post is a checklist I would put in a pull request template for any change where an LLM wrote a meaningful part of the code. It is grouped by the way models tend to fail, and each group ends with something you can automate.

> **Key Takeaways**
>
> - Functional is not secure. Veracode's 2026 report puts the average security pass rate of AI-generated code at 56% across the 100+ models it has tracked.
> - Models fail in repeatable ways: invented dependencies, missing checks at trust boundaries, weak randomness, leftover secrets and tests that only mirror the implementation.
> - Review the failure modes, not just the diff, and let CI enforce the checks that do not need judgment.
> - Prompting for "secure code" can help. It does not replace scanning.

## Why AI-generated code needs a different review

Models optimize for code that looks right and runs. Nothing in that objective guarantees safe handling of hostile input.

The numbers back this up, with caveats about who produced them. Veracode, a security vendor, tested more than 100 models and reported in its [2026 GenAI Code Security Report](https://www.veracode.com/resources/analyst-reports/2026-genai-code-security-report/) that the average security pass rate across all the models it has tracked sits at 56%. Its [earlier report](https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/) found risky flaws in 45% of tests and noted that larger, newer models did not improve security.

An academic study looked at real code instead of benchmark tasks. Researchers analyzed 733 Copilot-generated snippets from GitHub projects and found security weaknesses in 29.5% of the Python snippets and 24.2% of the JavaScript ones, spread over 43 weakness categories ([Security Weaknesses of Copilot-Generated Code in GitHub Projects](https://arxiv.org/abs/2310.02059), accepted to ACM TOSEM, 2025). Treat all of these as indications rather than universal rates. Benchmarks, vendors and tool versions differ, and I would not quote any single percentage as "how insecure AI code is".

What I take from them is narrower and more useful: the failures cluster in familiar weakness classes. That makes them checkable.

## The checklist at a glance

1. Every new dependency exists, is the intended one, and is pinned.
2. Lockfile changes match what the code actually needs.
3. All external input is validated before use.
4. Output is encoded for its context, and queries are parameterized.
5. Authentication and authorization are enforced on the server for every route.
6. Randomness for tokens and secrets comes from a cryptographic source.
7. No secrets, placeholder keys or debug settings are left in.
8. Permissions, CORS and error messages are as narrow as they can be.
9. Failure paths have tests, not just the happy path.
10. APIs used are current and match the documentation.

The rest of the post explains each group.

## Checks 1-2: dependencies and the supply chain

A model can suggest a package that does not exist. If an attacker registers that name first, installing the suggestion runs their code. This is often called slopsquatting.

The scale is not hypothetical. A USENIX Security 2025 paper analyzed 576,000 code samples in two programming languages and found that 19.7% of the packages the models generated were hallucinated, with 205,474 unique invented names ([We Have a Package for You!](https://www.usenix.org/system/files/usenixsecurity25-spracklen.pdf)).

In review:

- Look at the lockfile diff, not only `package.json` or `requirements.txt`. Anything you do not recognize deserves a look.
- Confirm the package is the one you meant. Check the publisher, the repository link, the release history and the first-published date. A package created last week that "does exactly what I asked for" is a warning sign.
- Pin versions and commit the lockfile.

```bash
# npm: when was this package first published?
npm view some-package time.created repository.url

# Python: audit what is already installed
pip-audit
```

The habit that matters most is to check the registry before the first install. With agentic tools the install may happen automatically, which removes the human checkpoint that this attack otherwise depends on. If your agent can run `npm install`, make a registry-age or allowlist check part of CI rather than relying on someone noticing.

## Checks 3-6: trust boundaries

Most real vulnerabilities live where data crosses a boundary: the request, the database, the shell, the browser. Review those spots first, because that is where a model that has not seen your threat model is most likely to skip a step.

**Validate input.** Check type, length, range and format at the edge. A handler that accepts a dict and passes it deeper is a sign the model never considered hostile input.

**Parameterize queries and encode output.** The classic example is string-built SQL:

```python
# What an LLM sometimes produces
cur.execute(f"SELECT * FROM users WHERE email = '{email}'")

# What to ask for in review
cur.execute("SELECT * FROM users WHERE email = %s", (email,))
```

The same logic applies to shell commands (avoid `shell=True` with user data), HTML (encode for the context, or use a framework that does) and anything passed to `eval` or a template engine. The Copilot study highlighted code injection (CWE-94) and cross-site scripting (CWE-79) among its notable weaknesses.

**Enforce authorization on the server.** Look for the check on every route, not just a hidden button in the UI. Ask: can user A read user B's record by changing an ID?

**Use a cryptographic random source for anything secret.** The same study also highlighted insufficiently random values (CWE-330). Python's `random` is fine for shuffling a list and wrong for a password-reset token:

```python
import secrets

token = secrets.token_urlsafe(32)  # not random.choices(...)
```

## Checks 7-8: secrets, configuration and permissions

Generated code tends to include whatever makes the example work. In review, search the diff for:

- Hardcoded API keys, passwords or "changeme" placeholders that will reach production unchanged.
- `DEBUG = True`, verbose stack traces returned to clients and permissive CORS such as `*` with credentials.
- Broad file or cloud permissions granted to "make it work".
- Disabled TLS verification added to silence an error.

Automate this part. Run a secret scanner such as [gitleaks](https://github.com/gitleaks/gitleaks) in CI, and turn on your host's push protection so a leaked key is blocked before it lands in history.

## Checks 9-10: tests, logic and stale APIs

AI-written tests often restate the implementation. They pass because they test what the code does, not what it should do. Ask for at least one negative test at each trust boundary: malformed input, an unauthorized caller, an oversized payload, a timeout.

Then read the code for logic the model could not have known. Does the discount stack when it should not? Does the retry loop hammer a failing service? And check the APIs it calls against current documentation. Models can emit deprecated or removed functions that still look plausible.

## Make CI enforce it

Human review is for judgment. Everything repeatable should fail the build on its own:

| Check                                                        | Example tools                           |
| ------------------------------------------------------------ | --------------------------------------- |
| Static analysis for injection, weak crypto, unsafe functions | Semgrep, CodeQL, Bandit (Python)        |
| Known-vulnerable dependencies                                | `npm audit`, `pip-audit`                |
| Committed secrets                                            | gitleaks, host push protection          |
| New or very young packages                                   | a small script against the registry API |
| Required human approval                                      | branch protection on `main`             |

On prompts: telling the model to write secure code is worth doing and costs nothing, but it is not a control. Verify with the scanners above.

## A short version for your PR template

```markdown
### AI-assisted change checklist

- [ ] New dependencies verified on the registry and pinned
- [ ] Inputs validated; queries parameterized; output encoded
- [ ] Authz enforced server-side on each route touched
- [ ] Tokens use a cryptographic random source
- [ ] No secrets, placeholders or debug flags left in
- [ ] Negative tests exist for each trust boundary
- [ ] SAST, dependency audit and secret scan are green
- [ ] I can explain what every changed line does
```

The last line is the one that matters most. If you cannot explain a line, you have not reviewed it. I wrote more about that test in [Vibe Coding vs. AI-Assisted Engineering](/blog/vibe-coding-vs-ai-assisted-engineering/).

## Conclusion

AI makes code cheap to produce, and the review is now where the safety lives. The checklist is not long, and most of it can be automated once.

- Verify dependencies before the first install.
- Review trust boundaries line by line.
- Scan for secrets and permissive configuration.
- Require negative tests.
- Let CI enforce the repeatable checks.

Copy the checklist into your PR template, then adjust it to the failures your own team actually sees.
