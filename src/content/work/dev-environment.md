---
slug: dev-environment
collection: work
order: 2
eyebrow: Personal · Developer tooling
title: My Dev Env
hero:
  src: /work/dev-environment/hero.png
  alt: Ghostty terminal with tmux showing agent status in the statusline and multiple panes
tags: []
---

## Principles
1. Everything is text
2. Everything is version-controlled
3. Everything needs to work natively with AI agents.

LLMs have mastered text. I find agents are much more powerful when they can read your config, modify a script, and run a shell command alongside you. The closer your environment is to the terminal and plain text, the more context an agent has.


### Dotfiles Repo
Everything lives in my [`~/dotfiles`](https://github.com/chrischo360/dotfiles) repo. 
- One [`install.sh`](https://github.com/chrischo360/dotfiles/blob/main/install.sh) bootstraps a fresh machine
[`./tests/test-install.sh`](https://github.com/chrischo360/dotfiles/blob/main/tests/test-install.sh) builds a clean Ubuntu container, runs [`install.sh`](https://github.com/chrischo360/dotfiles/blob/main/install.sh) from scratch, and verifies the result. If a new symlink or dependency breaks the install, it fails in Docker instead of on a real machine.
- Every config file is symlinked from there. 
- When a setting changes, it changes in one place, in a file, with a commit.

### Package Management
I try to follow the same principles with package management
- [Homebrew](https://brew.sh) dependencies are declared in a [`Brewfile`](https://github.com/chrischo360/dotfiles/blob/main/Brewfile.macos) — one file that captures every CLI tool and macOS app. 
- Runtime versions (Node, Python, etc.) are managed by [mise](https://mise.jdx.dev) and pinned in [`.mise.toml`](https://github.com/chrischo360/dotfiles/blob/main/.mise.toml). 

### What I Gain (Other Than Being Fun)
1. I can get a new machine fully configured by running two commands.
2. I can experiment with my environment
3. I'm forced to learn how my tools work and I believe that knowledge compounds.

# My Workflow
## Window and session management

I use [AeroSpace](https://nikitabobko.github.io/AeroSpace/guide) for window layout and [tmux](https://github.com/tmux/tmux) for project sessions. 
Both are configured in plain text files — [`aerospace.toml`](https://github.com/chrischo360/dotfiles/blob/main/aerospace/aerospace.toml) and [`tmux.conf`](https://github.com/chrischo360/dotfiles/blob/main/tmux/tmux.conf).

AeroSpace tiles windows automatically and deterministically. Spaces are workspaces, each has a layout, and you move between them with the keyboard.

tmux handles the project layer. I switch between sessions/repos with [fzf](https://github.com/junegunn/fzf).

{% media type="video" src="/work/dev-environment/session-switching.mp4" caption="fzf session picker with live preview — jumping between projects without touching the mouse." /%}

{% media type="video" src="/work/dev-environment/window-management.mp4" caption="AeroSpace workspace switching across monitors, keyboard only." /%}

## Neovim

[Neovim](https://neovim.io) is the editor. All configuration lives in Lua files under [`~/dotfiles/nvim/`](https://github.com/chrischo360/dotfiles/tree/main/nvim). 

{% media type="video" src="/work/dev-environment/vim-keys.mp4" caption="Same keys, different context — pane navigation in tmux, window focus in AeroSpace, moving in Neovim." /%}

## Agent setup

I beleive the agent you choose is less important than the infrastructure underneath them. Models improve and get replaced. The goal is a system I can route any agent through without rebuilding my workflow.

I switch between three agents
1. [Claude Code](https://claude.ai/code)
2. [Pi](https://github.com/earendil-works/pi)
3. [Devin](https://devin.ai).

All three pull from the same [`~/dotfiles/agent/`](https://github.com/chrischo360/dotfiles/tree/main/agent) directory. 

```text
~/dotfiles/agent/
  commands/   ← slash commands shared across agents
  hooks/      ← lifecycle hooks
  skills/     ← reusable task instructions
```

[commands](https://github.com/chrischo360/dotfiles/tree/main/agent/commands) · [hooks](https://github.com/chrischo360/dotfiles/tree/main/agent/hooks) · [skills](https://github.com/chrischo360/dotfiles/tree/main/agent/skills)

## Tmux configuration

tmux does more than session management. A few specific pieces worth calling out:

The **session picker** (`Prefix + s`) is a custom binding that replaces tmux's default `choose-tree` with an fzf popup — filtered to unattached sessions only, with a live capture preview of what's running inside. One keystroke to jump anywhere.

This also makes remote SSH work feel local. tmux sessions persist on the server so even when the connection drops you can ssh back in, reattach, and everything is exactly where you left it.

I have a **statusline** showing active agent state — idle, running, or waiting for input.

I also have **Notifications** fire when an agent session finishes. 

{% media type="video" src="/work/dev-environment/statusline.mp4" caption="Pi, Claude, and Devin state — idle, running, waiting — visible in the tmux status bar." /%}

{% media type="video" src="/work/dev-environment/notifications.mp4" caption="Agent finishes, notification fires." /%}

## Neovim plugins

A few plugins worth calling out specifically:

**[Diffview](https://github.com/sindrets/diffview.nvim)** is a full-screen git diff interface. Side-by-side layout, file panel on the left, keybindings consistent with everything else in the setup. The part I reach for most is `DiffviewFileHistory` on a single file — the fastest way to trace how a piece of code changed and understand why it looks the way it does.

**[Telescope](https://github.com/nvim-telescope/telescope.nvim)** with the frecency extension (`<leader>ff`) ranks files by how often and how recently you've opened them.

**[Persisted](https://github.com/olimorris/persisted.nvim)** saves and restores your workspace — open files, splits, layout — per git branch.

**[Bufferin](https://github.com/wasabeef/bufferin.nvim)** (`<leader>b`) opens a buffer list — every open file, with icons and modified state.

## Scripts

[`~/dotfiles/scripts/`](https://github.com/chrischo360/dotfiles/tree/main/scripts) holds the one-off utilities I reuse: theme switching, dev environment startup, notes sync. Since they are shell scripts, agents can read and run them. If something breaks, it's easy to diagnose and fix.

## A side effect: understanding your machine

Building this way forces you to learn how things actually work. When your LSP stops giving completions, you know how to check which server is attached to the buffer and why it might have failed. When you need to find something across a codebase, you reach for `grep` or `fzf` in the shell rather than a GUI search. You stop treating your tools as black boxes.

I believe that knowledge compounds. The more you understand what's happening under the hood, the faster you can debug, extend, and adapt — and the more useful you become as a collaborator to an agent doing the same.
