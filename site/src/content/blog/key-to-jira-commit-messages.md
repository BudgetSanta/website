---
title: "The key 🔑 to easy commit messages"
pubDate: 2019-12-19
description: "An introductory post demonstrating headings, lists, links, and code fences with syntax highlighting."
tags: ["git", "bash", "jira", "regex"]
---

Are you bored of typing things? Do you enjoy automation? Do you always have to check on your current ticket's key for your commit message? Well have I got a present for you 🎁

## Introducing Git Hooks

> Hooks are programs you can place in a git repo's hooks directory to trigger actions at certain points in git’s execution

You can write code to help you write code ( and if you’re writing tests then you’d be writing tests to help your code help your code 🤪). By default your git hooks folder is in the `$REPO/.git/hooks` folder and due to this, isn’t apart of the repo’s version control so you can mess around with it without worrying about affecting your repo.

We’re going to be looking at the `prepare-commit-msg` hook which you might have guessed helps you prepare you commit messages.

## Commit Message

`prepare-commit-msg`

> This hook is invoked by [git-commit[1]](https://git-scm.com/docs/git-commit "https://git-scm.com/docs/git-commit") right after preparing the default log message, and before the editor is started.

So this is going to allow us to modify the commit message before it gets set in our repo log.

**Heres the present (script). Copy it and follow the two steps below to use it per repo)**

```sh
#!/bin/bash

ISSUE_KEY=$(git branch 2>/dev/null| \
 sed -nE "s/^\* ([A-Z]{2,}-[0-9]+).*$/\1 /p")
echo "$ISSUE_KEY$(cat $1)" > $1
```

Put the script into the following file

`$REPO/.git/hooks/prepare-commit-msg`

And to make sure it will run properly we’ll just make sure it has the right permissions

`chmod 755 prepare-commit-msg` (thats `rwxr-xr-x` for those playing at home) (different from `rawr XD`)

**Note: if the script exits with a non-zero exit status the git commit will abort**

The hash bang `#!/bin/bash` at the top of the script can be subbed out for any other language you have with a respective script if you like it more. For example `#!/usr/bin/env python` followed by your favourite python script. Git hooks will happily oblige.

----------

**Keen to learn more about what we just covered? 👇**

### Prepare Commit Message

_prepare-commit-msg_ docs: [https://git-scm.com/docs/githooks#_prepare_commit_msg](https://git-scm.com/docs/githooks#_prepare_commit_msg "https://git-scm.com/docs/githooks#_prepare_commit_msg")

The way we actually modify the message only actually happens on the last line where we prepend the issue key to the pre-exisiting message. The first parameter given to the hook (`$1`) is the file where our message currently is. The next two parameters are optional and not needed for this. Echoing the Issue key to the beginning of the file will let us see whatever key we get earlier in our message

**So we’re about to get all the repo branches and extract a Jira issue key if the current branch contains a valid Jira issues key  from the branch name before we pop it in the commit message**

#### Git Branch

Now onto the fun. Using `/dev/null` is like setting up email rules. I love them but misuse it and you can miss some important stuff. Trust me on this one now …. _THROW CAUTION TO THE WIND_ … We’re going to yeet that `stderr` output straight into the void.

```sh
$COMMAND 2>/dev/null
```

This is going to let you ignore those pesky errors. It feels good not to care right?? 🤨​ this is technically not necessary but helps when testing out the script outside of the a git repo as you can avoid the `fatal: not a git repository (or any of the parent directories): .git` message you’ll get. Don’t worry, this will end up failing the script anyway due to the absence of branches so this error skipping isn’t so bad but feel free to remove the `2>/dev/null` if you’re worried.

#### He sed she sed by the stream shore

Sed (**S**tream **Ed**itor) helps us weed out what we don’t need from the output we do. If you think it looks like gibberish don’t worry. It Is!! but so is latin and they still teach that so 🤷‍♂️.

To break it down quickly it consists of the command `sed` the flags `-nE` and the regex expression `s/^\* ([A-Z]{2,}-[0-9]+).*$/\1 /p`

##### Flags

`-n` _“suppress automatic printing of pattern space”_ **Don’t print anything out at the end**

`-E` _“use extended regular expressions”_ **I wanna use that** _**fancy**_ **regex**

##### Regex

Basic format of replacement regex is `s/find/replace/`

`^\*` The current checked out branch in git is highlighted by an asterisks and space at the beginning of the line. For example `* ABC-123-my-special-feature`

`[A-Z]{2,}` Two or more capitals for the project key (Constraint set by Jira)

`-[0-9]+` One or more digits for the issue number prefixed with a dash to seperate the key and number

( ) brackets to capture them all ([https://www.youtube.com/watch?v=wrCUQuJsDYI](https://www.youtube.com/watch?v=wrCUQuJsDYI "https://www.youtube.com/watch?v=wrCUQuJsDYI"))

`.*$` match anything else to the end of the line

We need to match the entire line so that the replace removes everything we don’t want (like the branch description after the key and number)

`\1` back reference to the stuff in the brackets (i choose you _**CAPTURE GROUP**_)

`p` this tells us to print out each line that matches the _find_ portion of our sed

##### To put all that together

We want to (by default) suppress output to ignore other branches. Sed will run on each line of stdin which will be every branch available locally (which can get pretty big sometimes) so we don’t want it to printout out anything unless it matches exactly what we want. We want to run it with extended regex to we can use the fancy `{2,}` which is a nice way of saying two or more but wasn’t introduced initially.

We match our right branch which looks like `* ABC-12345-branch-info-and-stuff` on the entire line but the brackets let us match on just the part we want `ABC-12345`. The replace section consists of `\1` which puts the contents of the first capture group `ABC-12345` as well as a static space. Since we found an exact match on this line the `p` at the end of the regex will let us output it! If we don’t find any matches, no output will come out at all.

This allows us to see the `$ISSUE_KEY` in the echo as optional if there are not matches leaving so side effects if no branch is found.

----------

_**Fun Fact!**_ The echo in the last line opens up a sub-shell to `cat` the contents of the file with the `$( $COMMAND )` syntax because of how I/O is handled. This can be done using inline editing in sed but I find this is a little easier to understand.

Imagine a file in your home directory called `all_my_secrets.txt` that had your diary in it 🤫

Can you guess what would happen if you were to run the following command

```sh
cat todays_new_secret.txt all_my_secrets.txt > all_my_secrets.txt
```

If you guessed that it would prepend `todays_new_secrets.txt` to `all_my_secrets.txt`, I wouldn’t blame you. Unfortunately for you though, you’ve just erased all of your secrets in your diary except for todays one 😱

The `> all_my_secrets.txt` part of your script will run before the output of the `cat` and as `>` is for overwriting files, a _**new**_ file called `all_my_secrets.txt` is created nice and fresh destroying all old data
___
💾 Join me next time on Jared turns two lines of code into an essay
