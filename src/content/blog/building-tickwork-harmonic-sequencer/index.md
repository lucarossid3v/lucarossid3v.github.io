---
title: 'Building Tickwork: A Harmonic Step Sequencer, From Browser Prototype to Apple Native'
description: 'How I am building Tickwork, a key-aware MIDI step sequencer: a TypeScript web prototype used as an executable spec for a Swift and AUv3 port on iPad, iPhone and Mac.'
pubDate: 2026-11-22
tags:
  - tickwork
  - midi
  - typescript
  - swift
  - ai-assisted-development
draft: false
---

Most step sequencers make it easy to write a wrong note. You draw a pattern, change the key, and half of it sounds off. I wanted a sequencer where that cannot happen: you pick a key, write a chord progression, and every track plays inside the key and follows the chords.

That idea became Tickwork, an audio and MIDI sequencer I am building for the Apple ecosystem. It is not released yet. A limited web edition, [Tickwork Light](https://lucarossid3v.github.io/tickwork-light/), is online if you want to try the core idea in a browser. This post covers what Tickwork is, how it is built, and what I learned using the web prototype as the specification for the native app.

> [!TIP]
> **Try it now.** The web version, Tickwork Light, runs in your browser at [https://lucarossid3v.github.io/tickwork-light](https://lucarossid3v.github.io/tickwork-light). No installation needed. Use a Chromium-based browser such as Chrome or Edge for the best experience.

> **Key Takeaways**
>
> - Tickwork is a harmonic step sequencer: tracks follow the chord line and stay in the key.
> - A free, limited web version is usable online at [lucarossid3v.github.io/tickwork-light](https://lucarossid3v.github.io/tickwork-light).
> - It started as a TypeScript browser app and was ported to Swift as a standalone app and an AUv3 MIDI plugin for iPadOS, iOS and macOS.
> - The core of the engine is a pure, deterministic function, which makes live playback and `.mid` export agree and makes the port testable.
> - I build it with AI assistance, but with specs, tests and mutation checks, not by accepting whatever the model returns.

## What Tickwork is

Tickwork is inspired by the Teenage Engineering OP-Z. Its job is to send stable MIDI to a synthesizer or a DAW. The web edition also has an internal synth, so you can play without other gear.

The model is small:

- **Key.** A tonic and a mode (major, minor, dorian, phrygian and so on). Every note comes from the key.
- **Chord line.** Each pattern has a progression of up to 16 chords, each with its own length. All tracks play what is under the playhead of this line.
- **Tracks.** BASS, PAD, ARP and two LEADs, each with up to 16 steps, its own resolution (from four bars per step down to 1/32, plus triplets) and optional per-step parameters such as probability and ratchets.
- **Patterns, chains and songs.** Sixteen patterns, A to P. A chain is a looping sequence of patterns, and a song is a list of chains you can launch live.
- **Shift.** You can move the notes by a number of scale degrees, live or per chain entry, and they stay in the key. A "Keep in place" option leaves chosen tracks where they are.

The constraint is the feature. Because the harmony is shared, changing a chord or the key reshapes every track at once, and nothing leaves the scale.

## The web prototype

The first version is a browser app written in TypeScript with Vite, Tone.js and an AudioWorklet for the clock. The UI uses no framework: the view produces HTML from the state, and events are delegated at the root.

Two decisions from that version carry through the whole project.

**The engine is pure where it matters.** The function that decides which notes a step produces is deterministic, with its random seed stored in the project. Live playback and the Standard MIDI File export both call it, so they cannot drift apart. If you export a `.mid` and play it elsewhere, you hear what the sequencer played.

**The state has real undo.** The store keeps up to 100 changes, and recalling a project from the Set (a named list of projects) is just another undoable edit.

It also taught me the limits of the browser. Web MIDI only works fully in Chromium browsers. Safari has no Web MIDI, and the AudioWorklet that drives the clock needs a secure context, so using the app on an iPad over the local network needs HTTPS. These are the reasons the free web edition has no MIDI at all: it is audio only. The MIDI side is what I want the native app to do properly.

## Why go native

A sequencer that sends MIDI is only as good as its timing and its connections to the rest of a rig. On an iPad that means running as an AUv3 plugin inside hosts such as AUM, and exposing a virtual MIDI port to other apps. On a Mac it means the same plugin plus a standalone app.

The native version has three parts:

- **A core in pure Swift.** The package that holds harmony, model, editor and engine imports nothing from Apple beyond Foundation, so it can be tested on its own with `swift test`. The part that runs on the real-time thread is kept separate, and a test counts memory allocations over 100,000 render blocks and must find zero.
- **A shared SwiftUI interface**, used by both the app and the plugin.
- **An `aumi` plugin**, a MIDI-only Audio Unit, which sends MIDI and makes no sound. The standalone app can also run a small internal synth and a drum voice, but I kept them out of the plugin on purpose, and a check verifies that no audio symbols end up in the plugin bundle.

Before writing any native code, I wrote a technical assessment of the options: JUCE, Rust, or a C++ core with a Swift front end. That document marked every claim as verified from a source, general knowledge, my estimate, or not verified. It also proposed a first phase: a throwaway plugin that plays one note per beat, to test in AUM and Drambo before committing. I ended up with a pure-Swift core instead of the C++ one it recommended, but I would not have known that was safe without the throwaway plugin. It worked in Drambo on the Mac and in AUM on the iPad.

That phase also paid off in a less obvious way. Drambo on the Mac is an iOS app running in a wrapper, and it did not list my native macOS plugin. Building the app as Mac Catalyst made the plugin appear. The signing, the plist metadata and the plugin type were not the cause. I would not have guessed that, and I only found it because I tested early.

## The web app as an executable spec

The part I am most happy with is how the port was checked.

The web source was frozen as a reference inside the native repo. For each area, harmony, model, editor and engine, a script exported the web app's outputs as JSON vectors, and the Swift tests compared their own results against them. For sequences of edits, both sides computed a canonical hash of the state after every operation and compared hashes.

Agreement is not proof that the tests can fail, so I added mutation checks: deliberately break the Swift code and see whether a test notices. In the model area, 7 of 8 mutations were caught, and the eighth turned out to be equivalent to the original code. That is a more honest signal than a green test run.

The migration was declared finished on 19 November. After that I made a deliberate choice: **no parity with the web.** The native app evolves on its own, and the old vectors stay as regression tests for inherited behavior. When a new feature breaks one of them, I narrow that case and write the divergence down. The web edition stays a preview, and the native app is the product.

## What the native app adds

The features that justify the port are mostly about connecting to other gear:

- MIDI CC lanes, with shapes and a send-learn button for mapping to a synth parameter.
- Program buttons that send bank select and program change, or song select, on load or on demand.
- Per-track velocity shapes such as downbeat, backbeat and crescendo.
- Chain loop and play counts, so a chain can play a set number of times and then hand over to the next.

- A standalone-only internal synth and drum voice, with MIDI CC reaching them too, and recording to WAV with optional separate files per track.

None of these exist in Tickwork Light, which is why it is a preview and not the app.

## How I use AI on it

I work on Tickwork with Claude Code, and I do not treat that as a detail. I wrote about where I draw the line in [Vibe Coding vs. AI-Assisted Engineering](/blog/vibe-coding-vs-ai-assisted-engineering/), and Tickwork is where I try to follow my own rule: I should be able to explain every change.

What that looks like in practice:

- **A spec before code.** Each repo has a `spec.json` as the source of truth, and each project has a `CLAUDE.md` with the rules the assistant must not break, such as which function must stay pure and which limits are deliberate choices.
- **Tests as the contract.** The web project has dozens of test files. The native one has more than 700 test functions, plus vector, snapshot, real-time allocation and Audio Unit validation (`auval`) checks.
- **Git flow.** Features go on `feature/*` branches and are merged into `develop`, so each change is a reviewable diff.
- **Mutation checks for new features.** A test that cannot fail tells me nothing, so each new feature gets a deliberate break to confirm the test catches it.

The assistant is fast at writing code. It is the specs, the tests and the diffs that let me trust it. For a longer treatment of that review step, see the [checklist for reviewing AI-generated code](/blog/reviewing-securing-ai-generated-code-checklist/).

## Status and what is next

Tickwork is not released yet. It is in private testing, and it will arrive on TestFlight soon. I am not announcing a date until it is ready.

In the meantime, [Tickwork Light](https://lucarossid3v.github.io/tickwork-light/) is open in the browser with five tracks, the chord line and sixteen patterns. It has no installation and no MIDI. See the [project page](/projects/tickwork-light/) for the short version.

If you make music with MIDI gear and want to try the native app when it is ready, I would like to hear what rig you would use it with.
