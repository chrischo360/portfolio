---
slug: dev-environment
collection: work
order: 0
eyebrow: Personal · Developer tooling
title: "How I Work: Everything Is Text"
hero:
  src: /work/dev-environment/hero.png
  alt: Ghostty terminal with tmux showing agent status in the statusline and multiple panes
summary: A walkthrough of my terminal-first, keyboard-driven setup I use every day.
tags: []
---

# Principles
1. Everything is text
2. Everything is version-controlled
3. Everything needs to work natively with AI agents.

## Dotfiles Repo
Everything lives in my [`~/dotfiles`](https://github.com/chrischo360/dotfiles) repo. 
- One {% filelink src="https://raw.githubusercontent.com/chrischo360/dotfiles/main/install.sh" label="install.sh" lang="bash" /%} bootstraps a fresh machine
{% filelink src="https://raw.githubusercontent.com/chrischo360/dotfiles/main/tests/test-install.sh" label="test-install.sh" lang="bash" /%} builds a clean Ubuntu container, runs {% filelink src="https://raw.githubusercontent.com/chrischo360/dotfiles/main/install.sh" label="install.sh" lang="bash" /%} from scratch, and verifies the result. If a new symlink or dependency breaks the install, it fails in Docker instead of on a real machine.
- Every config file is symlinked from there. 
- When a setting changes, it changes in one place, in a file, with a commit.

### Package Management
I try to follow the same principles with package management
- [Homebrew](https://brew.sh) dependencies are declared in a {% filelink src="https://raw.githubusercontent.com/chrischo360/dotfiles/main/Brewfile.macos" label="Brewfile" lang="ruby" /%} — one file that captures every CLI tool and macOS app. 
- Runtime versions (Node, Python, etc.) are managed by [mise](https://mise.jdx.dev) and pinned in {% filelink src="https://raw.githubusercontent.com/chrischo360/dotfiles/main/.mise.toml" label=".mise.toml" lang="toml" /%}. 

### What I Gain (Other Than Being Fun)
1. I can get a new machine fully configured by running two commands.
2. I can experiment with my environment
3. I'm forced to learn how my tools work and I believe that knowledge compounds.

# My Workflow
## Window and session management

I use [AeroSpace](https://nikitabobko.github.io/AeroSpace/guide) for window layout and [tmux](https://github.com/tmux/tmux) for project sessions. 
Both are configured in plain text files — {% filelink src="https://raw.githubusercontent.com/chrischo360/dotfiles/main/aerospace/aerospace.toml" label="aerospace.toml" lang="toml" /%} and {% filelink src="https://raw.githubusercontent.com/chrischo360/dotfiles/main/tmux/tmux.conf" label="tmux.conf" lang="bash" /%}.

AeroSpace, an `i-3` like tiling window manager, makes moving between windows quick with my keyboard.

tmux handles the project layer. I switch between sessions/repos with [fzf](https://github.com/junegunn/fzf).

{% media type="video" src="/work/dev-environment/session-switching.mp4" caption="fzf session picker with live preview — jumping between projects without touching the mouse." /%}

{% media type="video" src="/work/dev-environment/window-management.mp4" caption="AeroSpace workspace switching across monitors, keyboard only." /%}

## Neovim

[Neovim](https://neovim.io) is my text editor. All configuration lives in Lua files under [`~/dotfiles/nvim/`](https://github.com/chrischo360/dotfiles/tree/main/nvim). 

{% media type="video" src="/work/dev-environment/vim-keys.mp4" caption="Same keys, different context — pane navigation in tmux, window focus in AeroSpace, moving in Neovim." /%}

## Agent Memory and Skills

I believe the agent you choose is less important than the infrastructure underneath them. Models improve and get replaced. The goal is a system I can route any agent through without rebuilding my workflow.

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

## Tmux

tmux does more than session management. A few specific pieces worth calling out:

The **session picker** (`Prefix + s`) is a custom binding that replaces tmux's default `choose-tree` with an fzf popup.

This also helps with remote SSH development. tmux sessions persist on the server so even when the connection drops you can ssh back in, reattach, and everything is exactly where you left it.

I also have a **statusline** showing active agent state — idle, running, or waiting for input.

I also have **notifications** fire when an agent session finishes. 


## Neovim Plugins

A few plugins I use:

**[Diffview](https://github.com/sindrets/diffview.nvim)** is a full-screen git diff interface. Side-by-side layout, file panel on the left, keybindings consistent with everything else in the setup. The part I reach for most is `DiffviewFileHistory` on a single file — the fastest way to trace how a piece of code changed and understand why it looks the way it does.

**[Telescope](https://github.com/nvim-telescope/telescope.nvim)** with the frecency extension (`<leader>ff`) ranks files by how often and how recently you've opened them.

**[Persisted](https://github.com/olimorris/persisted.nvim)** saves and restores your workspace — open files, splits, layout — per git branch.

**[Bufferin](https://github.com/wasabeef/bufferin.nvim)** (`<leader>b`) opens a buffer list — every open file, with icons and modified state.

## Scripts

[`~/dotfiles/scripts/`](https://github.com/chrischo360/dotfiles/tree/main/scripts) holds the one-off utilities I reuse: theme switching, dev environment startup, notes sync. Since they are shell scripts, agents can read and run them. If something breaks, it's easy to diagnose and fix.
