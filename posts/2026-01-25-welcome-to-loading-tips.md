---
title: "Welcome to Loading Tips"
date: 2026-01-25
---

# Welcome to Loading Tips

This is your first blog post! This post demonstrates the markdown format and shows how the blog system works.

## Features

- **GitHub-backed**: All posts are stored as markdown files in your GitHub repository
- **Secure admin**: OAuth authentication with user validation
- **Fast loading**: Static site hosted on GitHub Pages
- **Markdown support**: Full markdown formatting with frontmatter

## How it works

1. **Public site** (`index.html`) reads posts from the GitHub API
2. **Admin panel** (`admin.html`) lets you create and edit posts
3. **GitHub Actions** handles secure authentication and post management

## Writing Posts

Posts are written in markdown with YAML frontmatter:

```markdown
---
title: "Your Post Title"
date: 2026-01-25
---

Your content goes here...
```

## Security

- OAuth authentication ensures only authorized users can edit
- Client secrets are safely stored in GitHub Actions
- Public site has no write access to prevent unauthorized changes

Enjoy your new blog system! 🚀