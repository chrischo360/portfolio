---
slug: pi-codeblock-copy
collection: work
order: 1
eyebrow: Pi · Developer tooling
title: "pi-cc: Copy Code Blocks Without Fighting the Terminal"
summary: A Pi extension that detects code blocks in the latest assistant response and lets you copy the exact one you want, without wrapped lines and mangled line breaks.
hero:
  src: /work/pi-codeblock-copy/hero.png
  alt: pi-cc copy panel showing numbered code blocks above the Pi editor
tags: []
---

# pi-cc: Copy Code Blocks From Pi Without Fighting the Terminal

{% media type="video" src="/work/pi-codeblock-copy/demo.mp4" caption="pi-cc detecting code blocks after an assistant response and copying one with /cc 2" /%}

### Source Code
[https://github.com/chrischo360/pi-cc](https://github.com/chrischo360/pi-cc)
### What is Pi?

[Pi](https://pi.dev/) is a terminal-native AI coding agent — a minimal agent harness. Adapt Pi to your workflows, not the other way around.

### What problem does `pi-cc` solve?

When I tried copying bash scripts, kubectl or docker commands, out of the terminal, there were often broken line wraps, stray prompt characters, or prose from the surrounding response mixed in.

### How it works

`pi-cc` parses the latest assistant message, extracts fenced code blocks, and gives you a compact numbered panel to act on them.

- `/cc` — copy a block; shows a picker if there are multiple, or copies directly if there's one
- `/cc 2` — copy block 2 without the picker
- `/vc 2` — open block 2 in Pi's editor to review before copying
- Widget updates automatically after each assistant response and clears when there's nothing to copy

