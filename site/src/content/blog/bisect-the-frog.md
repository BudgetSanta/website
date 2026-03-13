---
title: "Lets Bisect The Frog"
pubDate: 2024-11-27
description: "Ever thought to yourself, \"Oh the 2D spaghetti of my codebase is too difficult to navigate, i can't find anything!\"? I've got a tool for you!"
tags: ["git", "bash", "debugging", "productivity"]
---

*Ever thought to yourself, "Oh the 2D spaghetti of my codebase is too difficult to navigate, i can't find anything! I'll never be able to find where something was with the introduction of a 3rd dimension of time through all those commit 😢"? I've got a tool for you!*

> 📺 Consult your doctor to see if git-bisect is right for you. Do not take git-bisect if you are allergic to any of its ingredients. Common side effects include nausea, headaches and drowsiness.

## 🧑‍🔬 Git Bisect

This is a search tool that will identify a change you're looking for across the timeline of commits of a branch. It uses a quick and easy binary search to whittle down the commits that aren't helpful for your investigation. In a simplified way, you get Git to play a number guessing game of Higher or Lower.

Git needs a bit of information to start and then it walks you through your codebase over time asking you your thoughts on its current state. The uses for this can be a little varied and the instructions you can use can be adjusted for that but for now we'll stick with `good` and `bad` since they're pretty straight forward.

## 🚌 How it works

You start off with a known good commit where the problem you're looking to find wasn't happening. For example *"Oh I remember this was working fine last week, i'll get Monday's release commit"*. With Monday's commit hash in hand you would mark a **good** commit.

Then you need to identify a bad commit, one where the issue exists (even if you don't know where). Usually this can just be a recent/current commit or something like the latest deployed commit. With that recent problematic commit you would mark a **bad** commit.

With this information git will take you to a commit in the middle of these two identified **good** and **bad** commits. Here you'll need to figure out for yourself if *this* commit is good or bad. Usually this might involve compiling the code and running automated/manual testing or checking for the presence of something you need. Once you settle on good or bad, Git again finds its new middle commit and you repeat!

Finally once you mark the last one that git needs, it will identify for you the commit which is "The first bad commit". From there you can use this commit to see what it changed, how it might have affected something else, or have been affected by other changes around that time.

## 🔖 Example Run Through

**Identifying the commit introducing a bug**

🍂 Heres we leaf through some commits to find out what change introduced incorrect behaviour

```bash
git bisect start
```

```
status: waiting for both good and bad commits
```

```bash
git bisect bad # marking the current checked out commit as bad
```

```
status: waiting for good commit(s), bad commit known
```

``` bash
git bisect good 525764d1799e35a9f8a26bb2f27296ec5891bb7a # marking that commit hash as good
```

> ℹ️ Git decides what commit to move us to here and we begin our search

```bash
Bisecting: 20 revisions left to test after this (roughly 4 steps)
[562f51ae43212d202c44c98cd0fe68a329471191] [ABC-18468] - super robust and awesome feature (#8996)

# Our testing showed the bug is still here
$ git bisect bad
Bisecting: 9 revisions left to test after this (roughly 3 steps)
[2529b759fc09a2fb06b51bb4ae8bc1e7f3c6456d] ABC-18459: Fix boingo endpoint performance (#5951)

# Our testing showed the bug is still here
$ git bisect bad
Bisecting: 4 revisions left to test after this (roughly 2 steps)
[e117611d8ad7a30922fba8ff01e22d6de8185444] ABC-18311 Add blue colour to flashlight (#5937)

# Our testing showed the bug is still here
$ git bisect bad
Bisecting: 2 revisions left to test after this (roughly 1 step)
[89649d6121422bc5e58c3566beb9615c46bcb740] fix(ABC-18398): Stop screen wavy effect (#5931)

# Our testing showed the bug isn't here!
$ git bisect good
Bisecting: 0 revisions left to test after this (roughly 1 step)
[62e7ca4a9d1a263632915f2aa89a632e1517eef6] ABC-18265: Add cool screen wave effect! (#5836)

# Our testing showed the bug isn't here!
$ git bisect good
e117611d8ad7a30922fba8ff01e22d6de8185444 is the first bad commit
commit e117611d8ad7a30922fba8ff01e22d6de8185444
Author: Jared Steiner <jared.steiner@safetyculture.io>
Date:   Wed Nov 20 15:36:02 2024 +1100

    ABC-18243 Clean up all this confusing logic! (#8549)

    # What

    I found a bunch of confusing logic for this file zipping
    behaviour. I don't understand what it does and I can't see
    any tests for it. It must be unused!

    # Changes

    I'm removing definitely unused code which isn't even tested
    so it shouldn't be around anymore. Saying Adios that for
    sure dead code.

    # Testing

    Can't find any tests, don't know where the feature is used
    so I cant ¯\_(ツ)_/¯

.../backend/src/critical-file-helpers/zip/zip-tooling.py | 170 +------------------------------------
1 file changed, 1 insertion(+), 169 deletion(-)

# Once we have what we need, we can exit out of the bisect
$ git bisect reset
```

## 🖥️ Try it out

**Starting a bisect**

```bash
git bisect start
```

**Identify bad commit**

```bash
git bisect bad
```

**Identify good commit**

```bash
git bisect good HEAD~200  (200 commits ago)
```

**Loop**

> **Check for condition**
>
> Manual or automated checking (ie tests, visual verification, etc)
>
> **Step through a bisect**
>
> ```bash
> git bisect good/bad
> ```

**Exit once you're done**

```bash
git bisect reset
```

## 🤖 Automation

This is a fantastic tool for investigating an issue but theres a great deal of manual work required sometimes. It might even be the same repeatable actions for each time.

> *Build, run tests, mark good or bad from test results*

If you have, or are able to make, an executable for git bisect to run, it'll do all the hard work for you! All you have to do instead of marking `git bisect good` or `git bisect bad`, is just call `git bisect run <an_executable> [<arguments>]`

#### Have a Go Project?

*I want to find which commit in my branch broke my unit tests*

```bash
git bisect start
git bisect bad
git bisect good $(git merge-base HEAD main) # Marks the start of the branch as good
git bisect run go test
```

Git bisect will check out each new commit, runs `go test` which compiles and runs your tests, and then based on its success will move onto its next target all by itself!

> **The success of the tests to git are actually denoted by the command's exit code (`go test`).** `0` relays a successful command run (and a successful test suite run) which marks a `good` commit. Any other exit code will mark a failure in the run and subsequently mark a `bad` commit.

#### Have a complex setup?

*I have a few different services I need to spin up before I can run the E2E suite locally*

```bash
git bisect start
git bisect bad
git bisect good HEAD~45 # 45 commits ago
export MY_ENV_VAR=bananas; git bisect run ~/test_suite_setup_teardown.sh --do-thething=true
```

> ⚠️ Its probably easiest if the script you're running doesn't live inside the repo unless you're sure its available and unchanged across the range of commits you're spanning

## 🤓 Technical Notes

### Different nomenclature

Not every use case for bisect is for good vs bad code. Maybe you're looking for the commit message justification for when a convention was introduced. You could be trying to figure out which commit begun to degrade the performance of an endpoint/component. In these and many more cases, good or bad doesn't really describe the **before X happened**, **after X happened** naming you might want.

Luckily right out of the box bisect supports **old** and **new** which you can wholesale replace **good** and **bad** with (respectively). If that still doesn't suit your specific use case, you can have it your way. When you start a bisect, you can provide your good/bad or old/new aliases with

```
git bisect start [--term-good <good-term>] [--term-bad <bad-term>]
```

or

```
git bisect start [--term-old <term-old>] [--term-new <term-new>]
```

#### Tabs vs. Spaces

*When did we switch from tabs to spaces?*

```bash
git bisect start --term-old tabs --term-new spaces
```

#### Sorting

*When did sorting that list in memory begin to take so long?*

```bash
git bisect start --term-good fast --term-bad slow
```

> **Terminal state isn't different during a bisect.** After each speed test you could append a timing log so you could graph it over time. It might be more than one commit degrading speed over time. Would be a great candidate for automation 🤖

## Skipping

Say you're in the middle of a bisect when you're trying to run tests against your code but it won't compile. You see the build error and you know its nothing to do with the bug your after but its non trivial to fix it just so you can test it. You can skip it! You or git can nominate a close commit to test against instead.

```bash
...
$ git bisect skip
...
```

Git then nominates a nearby commit to test instead and you can get on with your day

> ⚠️ In the unfortunate case where the commit you've skipped is adjacent to the one you're looking for, Git won't be able to tell you which one exactly is the change you're looking for (as you never checked one of them)

### Consider a working tree

You might need to run git bisect on another branch but don't want to mess up your current changes. Look into using a separate working tree with [Be a Git Lumberjack](/blog/git-lumberjack).

### Dive into the Weeds

Still interested? Check out the `git-bisect` [documentation](https://git-scm.com/docs/git-bisect) — theres more I didn't cover 🪲
