---
title: "How Google's Stitch MCP server is a crazy thing"
date: 2026-02-20
---

# How Google’s Stitch MCP Server Changed How I Build UI

Honestly, I never expected UI generation to reach this level this fast.<br>
I’ve used AI for UI before, but most of the time it was either generic, inconsistent, or needed heavy manual fixing.<br>
But while building **iDo v2.4.0a**, I tried something different — I used **Google’s Stitch MCP server to guide the AI.**<br>
And the difference was honestly insane.<br><br>


## The Problem Before Stitch

Before this, my workflow was simple:<br>

I describe the UI → AI generates code → I fix inconsistencies → repeat.<br><br>

Even with the best models, there were problems:<br>

• spacing inconsistency<br>
• components behaving differently across screens<br>
• design not matching platform standards<br>
• broken hierarchy and visual balance<br><br>

AI was generating UI, but it wasn’t generating **system-level UI consistency.**<br><br>


## What Stitch MCP Actually Changed

Google Stitch gave me something very important — **structured UI attribution.**<br><br>

Instead of just generating UI visually, Stitch exported **HTML attribution files describing the UI structure.**<br>

This included:<br>

• layout hierarchy<br>
• component relationships<br>
• spacing logic<br>
• typography structure<br>
• interaction hints<br><br>

This file became the **source of truth for the AI.**<br><br>


## How I Used It in iDo v2.4.0a

My workflow became:<br><br>

1. Design UI using Google Stitch<br>
2. Export HTML attribution file<br>
3. Provide that file to the AI<br>
4. Instruct AI to follow it strictly<br>
5. Launch app and iterate in terminal feedback loop<br><br>

This changed everything.<br><br>

Instead of guessing UI, the AI was now **reconstructing UI from structured intent.**<br><br>


## Why This Felt Different From Normal AI UI Generation

Normally AI says:<br>

“Here is a UI based on your description.”<br><br>

With Stitch, it was more like:<br>

“Here is the UI rebuilt from your design system.”<br><br>

That difference is huge.<br><br>

Because now the AI wasn’t designing.<br>
It was implementing.<br><br>


## Real Impact on iDo

The new iDo mobile UI became:<br>

• more consistent<br>
• cleaner<br>
• better aligned<br>
• closer to production quality<br><br>

And most importantly:<br>

I didn’t fight the AI anymore.<br>
I guided it.<br><br>


## The Biggest Realization

I realised something important here.<br><br>

AI works best when you don’t ask it to imagine.<br>
AI works best when you give it structure.<br><br>

Stitch gave that structure.<br><br>


## The Future This Suggests

This made me realise something bigger.<br><br>

UI design → Structure → AI implementation<br><br>

Not<br>

Idea → AI magic → hope it works<br><br>


## Honest Truth

iDo v2.4.0a UI wouldn’t look like this without Stitch MCP.<br><br>

Not because AI is weak.<br>

But because AI needs direction.<br><br>


## Final Thought

Stitch didn’t replace design.<br>

It made AI respect design.<br><br>

And honestly, that’s when AI becomes powerful.<br>