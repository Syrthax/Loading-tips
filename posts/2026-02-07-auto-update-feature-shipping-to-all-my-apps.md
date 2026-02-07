---
title: "Auto Update feature shipping to all my apps"
date: 2026-02-07
---

## Why auto-update even mattered to me

I ship a lot of small apps   
Every time I fixed a bug or shipped an improvement, I had to do the most annoying thing possible:  
**manually ask people to update.**
“Hey, there’s a new version.”  
“Please download the latest version.”  
“Can you update once more, I fixed it.”

That works when you have two users.  
It completely breaks once you have more.
At some point I realised something obvious but uncomfortable:
If an app can’t update itself, it’s not really finished.
Every bug fix that doesn’t reach users might as well not exist.
Every improvement that stays in my repo is useless.

## Using GitHub as my update server
I already host everything on GitHub:
- source code
- releases
- version tags

So instead of building a backend just for updates, I decided to use:
- GitHub Releases as the source of truth
- semantic versioning (`v1.0`, `v1.1`, etc.)
- a lightweight version check inside the app

This also gives me a great opportunity to actually learn how apps checks for updates