---
title: "Be a Git Lumberjack"
pubDate: 2024-08-05
description: "Hate stashing changes when switching branches? Don't want to wait another 15 minutes for all your builds again when switching back and forth between branches? Need to make a hotfix but don't have time to fix a merge conflict? Git Worktrees may be right for you."
tags: ["git", "bash", "worktrees", "productivity"]
---

*Hate stashing changes when switching branches? Don't want to wait another 15 minutes for all your builds again when switching back and forth between branches? Need to make a hotfix but don't have time to fix a merge conflict? Git Worktrees may be right for you.*

> 📺 Please read the PDS and consider if this product is right for you. Information provided is general in nature and does not take into account your personal financial situation or needs

## Working Trees in Git

### Overview

Git working trees is a simple and powerful way to keep multiple working trees up simultaneously without cloning the repo a second time.

> **Its another copy of the repo for any other branch you need.**

With git working trees you can "checkout" another branch from the repo while maintaining the current working state of the branch you're already on in separate directory. This way you can keep two states uncommitted, built, running or open in different editor windows at the same time!

#### Directory Structure

| **repo** `~/code/my-repo` | **separate working tree** `~/code/my-repo-hotfix` |
|:---|:---|
| *regular repository checked out to whatever branch you're working on* | separate instance of the repo containing all contents checked out to any **other** branch. |

### Example Use Cases

#### Testing Main

📝 Your app's stability might be shaky at best and you find yourself a port of call for ensuring that main is working or broken as expected?

```bash
#!/usr/bin/env bash

cd "~/my-repo"
git worktree add -B main ~/my-repo-worktrees/main # `-B` for exsting branches
cd "../my-repo-worktrees/main"
git pull

# Build and test without changing anything in ~/my-repo !
```

#### Speedy Hotfix

👷 You need to release a quick hotfix and don't have time to deal with sorting out issues with your current local but don't want to lose the last weeks worth of work you haven't committed yet!

```bash
#!/usr/bin/env bash

cd "~/my-repo"
git worktree add -b hotfix-undo-schema-change ~/my-repo-worktrees/hotfix-schema # `-b` for new branches
cd "~/my-repo-worktrees/hotfix-schema"
git fetch
git reset --hard origin/main

# Create you hotfix changes and go fix prod without changing anything in ~/my-repo !
```

**Any so many more...**

## 🖥️ Try it out

**Create a working tree for a new branch**

```bash
git worktree add -b <new-branch-name> <worktree-directory>
```

**Create a working tree for an existing branch**

```bash
git worktree add -B <existing-branch-name> <worktree-directory>
```

**List out your working trees**

```bash
git worktree list
```

**Remove a working tree**

```bash
git worktree remove <worktree-directory>
```

**Move a working tree**

```bash
git worktree move <existing-worktree-directory> <new-worktree-directory>
```

## 🤓 Technical Notes

### Nesting is not recommended

You can provide a working tree directory that is inside the original repository location but this could get a little complicated. Since its an entirely separate copy of the repo, to avoid collisions and complications during changes, commits, and the like, its advised to keep it in a separate directory. Git will happily keep track of the locations of your working trees with `git worktree list`.

### Sharing is caring

Your working tree shares everything except per-worktree files such as `HEAD`, `index`, etc. This means that githooks and the like come along for free and operate on the specific working tree you run the git command in. Don't worry about setting up those linting scripts just so you can have some organisation.

### A .git File?

Each working tree, since linked to the original git repo, gets a `~/my-working-tree/.git` file which contains information about the original directory and all the information it needs about itself in that original directory.

### Git is naughty?

No! Git can be dirty though. If you've git a "dirty" state in one of your working trees like uncommitted changes, git will not let you remove the working tree as a safety (unless you specify `--force`)

### \*Insert Spiderman Pointing\*

Apart from the port you start your application on, theres nothing really stopping you from running your application more than once! Be careful doing this though as it can have unintended side effects. Your local API might not like having more than one client! Buyer Beware, Your Milage May Vary ⚠️
