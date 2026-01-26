/**
 * GitHub Blog Admin - Main Application
 * Handles authentication, post management, and GitHub API interactions
 */

class GitHubBlogAdmin {
    constructor() {
        // Repository configuration
        this.owner = 'Syrthax';
        this.repo = 'Loading-tips';
        this.postsPath = 'posts';
        
        // Security: Only allow this GitHub username
        this.allowedUser = 'Syrthax';
        
        // Token stored in memory (persisted to localStorage)
        this.accessToken = localStorage.getItem('github_token');
        
        this.currentUser = null;
        this.posts = [];
        this.currentPost = null;
        this.isNewPost = false;
        
        this.initElements();
        this.bindEvents();
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    initElements() {
        // Login screen
        this.loginScreen = document.getElementById('login-screen');
        this.adminInterface = document.getElementById('admin-interface');
        this.tokenField = document.getElementById('token-field');
        this.loginBtn = document.getElementById('login-btn');
        this.logoutBtn = document.getElementById('logout-btn');
        this.loginError = document.getElementById('login-error');
        
        // User info
        this.userAvatar = document.getElementById('user-avatar');
        this.userName = document.getElementById('user-name');
        
        // Posts management
        this.postsLoading = document.getElementById('posts-loading');
        this.postsList = document.getElementById('posts-list');
        this.newPostBtn = document.getElementById('new-post-btn');
        
        // Editor
        this.welcomeView = document.getElementById('welcome-view');
        this.editorView = document.getElementById('editor-view');
        this.editorMessages = document.getElementById('editor-messages');
        
        this.postForm = document.getElementById('post-form');
        this.postTitle = document.getElementById('post-title');
        this.postDate = document.getElementById('post-date');
        this.postContent = document.getElementById('post-content');
        
        this.saveBtn = document.getElementById('save-btn');
        this.deleteBtn = document.getElementById('delete-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
    }

    bindEvents() {
        this.loginBtn.addEventListener('click', () => this.loginWithToken());
        this.logoutBtn.addEventListener('click', () => this.logout());
        this.newPostBtn.addEventListener('click', () => this.createNewPost());
        this.saveBtn.addEventListener('click', () => this.savePost());
        this.deleteBtn.addEventListener('click', () => this.deletePost());
        this.cancelBtn.addEventListener('click', () => this.cancelEdit());
        
        // Enter key in token field
        this.tokenField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loginWithToken();
        });
    }

    async init() {
        if (this.accessToken) {
            await this.initializeAdmin();
        } else {
            this.showLogin();
        }
    }

    // ============================================
    // AUTHENTICATION
    // ============================================

    async loginWithToken() {
        const token = this.tokenField.value.trim();
        
        if (!token) {
            this.showLoginError('Please enter your GitHub Personal Access Token');
            return;
        }
        
        try {
            this.accessToken = token;
            await this.verifyUser();
            localStorage.setItem('github_token', token);
            this.showAdmin();
            await this.loadPosts();
        } catch (error) {
            console.error('Login error:', error);
            this.showLoginError('Login failed: ' + error.message);
            this.accessToken = null;
        }
    }

    async verifyUser() {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid token. Please check your Personal Access Token.');
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }

        this.currentUser = await response.json();
        
        // Security check
        if (this.currentUser.login !== this.allowedUser) {
            throw new Error(`Access denied. This admin panel is only for ${this.allowedUser}.`);
        }
        
        this.updateUserInfo();
    }

    updateUserInfo() {
        this.userAvatar.src = this.currentUser.avatar_url;
        this.userName.textContent = this.currentUser.name || this.currentUser.login;
    }

    async initializeAdmin() {
        try {
            await this.verifyUser();
            this.showAdmin();
            await this.loadPosts();
        } catch (error) {
            console.error('Admin initialization error:', error);
            this.showLoginError('Authentication failed: ' + error.message);
            this.logout();
        }
    }

    logout() {
        this.accessToken = null;
        this.currentUser = null;
        localStorage.removeItem('github_token');
        this.showLogin();
        this.clearMessages();
    }

    // ============================================
    // POSTS MANAGEMENT
    // ============================================

    async loadPosts() {
        this.postsLoading.style.display = 'block';
        this.postsList.innerHTML = '';
        
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.postsPath}`,
                {
                    headers: {
                        'Authorization': `token ${this.accessToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    this.posts = [];
                    this.renderPostsList();
                    return;
                }
                throw new Error(`Failed to load posts: ${response.status}`);
            }

            const files = await response.json();
            
            const postFiles = files.filter(file => 
                file.type === 'file' && file.name.endsWith('.md')
            );

            this.posts = await Promise.all(
                postFiles.map(async (file) => {
                    try {
                        // Fetch content via GitHub API (not raw URL) to avoid CDN caching
                        // The API returns base64-encoded content which is always fresh
                        const contentResponse = await fetch(
                            `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.postsPath}/${file.name}`,
                            {
                                headers: {
                                    'Authorization': `token ${this.accessToken}`,
                                    'Accept': 'application/vnd.github.v3+json',
                                    'Cache-Control': 'no-cache'
                                }
                            }
                        );
                        
                        if (!contentResponse.ok) {
                            throw new Error(`Failed to fetch ${file.name}`);
                        }
                        
                        const fileData = await contentResponse.json();
                        // Decode base64 content with proper UTF-8 handling
                        const base64 = fileData.content.replace(/\n/g, '');
                        const binaryString = atob(base64);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        const content = new TextDecoder('utf-8').decode(bytes);
                        
                        return {
                            filename: file.name,
                            sha: fileData.sha, // Use fresh SHA from this response
                            content: content,
                            ...this.parseMarkdownMeta(content)
                        };
                    } catch (error) {
                        console.warn(`Failed to load ${file.name}:`, error);
                        return null;
                    }
                })
            );
            
            this.posts = this.posts
                .filter(post => post !== null)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            this.renderPostsList();
            
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showMessage('error', 'Failed to load posts: ' + error.message);
        } finally {
            this.postsLoading.style.display = 'none';
        }
    }

    parseMarkdownMeta(content) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        let title = 'Untitled';
        let date = new Date().toISOString().split('T')[0];
        let bodyContent = content;

        if (match) {
            const frontmatter = match[1];
            bodyContent = match[2];
            
            const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
            const dateMatch = frontmatter.match(/^date:\s*(.+)$/m);
            
            if (titleMatch) title = titleMatch[1].trim().replace(/['"]/g, '');
            if (dateMatch) {
                // Use the raw date string directly to avoid timezone issues
                date = dateMatch[1].trim();
            }
        }

        return { title, date, bodyContent };
    }

    renderPostsList() {
        if (this.posts.length === 0) {
            this.postsList.innerHTML = '<li style="text-align: center; color: #6c757d;">No posts yet. Create your first post!</li>';
            return;
        }

        this.postsList.innerHTML = this.posts.map(post => `
            <li class="post-item" data-filename="${post.filename}" onclick="admin.editPost('${post.filename}')">
                <div>
                    <div class="post-title-text">${this.escapeHtml(post.title)}</div>
                    <div class="post-meta">${post.date}</div>
                </div>
            </li>
        `).join('');
    }

    highlightSelectedPost(filename) {
        document.querySelectorAll('.post-item').forEach(item => {
            item.classList.remove('selected');
        });
        if (filename) {
            const selectedItem = document.querySelector(`.post-item[data-filename="${filename}"]`);
            if (selectedItem) selectedItem.classList.add('selected');
        }
    }

    // ============================================
    // EDITOR
    // ============================================

    createNewPost() {
        this.isNewPost = true;
        this.currentPost = null;
        
        this.postTitle.value = '';
        this.postDate.value = new Date().toISOString().split('T')[0];
        this.postContent.value = '';
        
        this.showEditor();
        this.highlightSelectedPost(null);
    }

    editPost(filename) {
        const post = this.posts.find(p => p.filename === filename);
        if (!post) return;
        
        this.isNewPost = false;
        this.currentPost = post;
        
        this.postTitle.value = post.title;
        this.postDate.value = post.date;
        this.postContent.value = post.bodyContent;
        
        this.showEditor();
        this.highlightSelectedPost(filename);
    }

    async savePost() {
        const title = this.postTitle.value.trim();
        const date = this.postDate.value;
        const content = this.postContent.value.trim();
        
        if (!title || !date || !content) {
            this.showMessage('error', 'Please fill in all fields');
            return;
        }
        
        try {
            const filename = this.isNewPost 
                ? this.generateFilename(title, date)
                : this.currentPost.filename;
            
            const markdownContent = this.buildMarkdownContent(title, date, content);
            
            // Pass SHA for updates, null for new posts
            const sha = this.isNewPost ? null : this.currentPost.sha;
            await this.commitFile(filename, markdownContent, sha);
            
            this.showMessage('success', 'Post saved successfully!');
            await this.loadPosts();
            this.cancelEdit();
            
        } catch (error) {
            console.error('Error saving post:', error);
            this.showMessage('error', 'Failed to save post: ' + error.message);
        }
    }

    async deletePost() {
        if (this.isNewPost || !this.currentPost) return;
        
        if (!confirm(`Are you sure you want to delete "${this.currentPost.title}"?`)) {
            return;
        }
        
        try {
            await this.deleteFile(this.currentPost.filename, this.currentPost.sha);
            
            this.showMessage('success', 'Post deleted successfully!');
            await this.loadPosts();
            this.cancelEdit();
            
        } catch (error) {
            console.error('Error deleting post:', error);
            this.showMessage('error', 'Failed to delete post: ' + error.message);
        }
    }

    cancelEdit() {
        this.showWelcome();
        this.currentPost = null;
        this.isNewPost = false;
        this.clearMessages();
        this.highlightSelectedPost(null);
    }

    // ============================================
    // GITHUB API
    // ============================================

    async commitFile(filename, content, sha = null) {
        const path = `${this.postsPath}/${filename}`;
        const message = sha 
            ? `Update post: ${this.postTitle.value}`
            : `Add post: ${this.postTitle.value}`;
        
        const requestBody = {
            message: message,
            content: btoa(unescape(encodeURIComponent(content))),
            committer: {
                name: this.currentUser.name || this.currentUser.login,
                email: this.currentUser.email || `${this.currentUser.login}@users.noreply.github.com`
            }
        };
        
        if (sha) {
            requestBody.sha = sha;
        }
        
        const response = await fetch(
            `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `GitHub API error: ${response.status}`);
        }
    }

    async deleteFile(filename, sha) {
        if (!sha) {
            throw new Error('SHA is required for file deletion');
        }
        
        const path = `${this.postsPath}/${filename}`;
        const requestBody = {
            message: `Delete post: ${this.currentPost.title}`,
            sha: sha,
            committer: {
                name: this.currentUser.name || this.currentUser.login,
                email: this.currentUser.email || `${this.currentUser.login}@users.noreply.github.com`
            }
        };
        
        const response = await fetch(
            `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `token ${this.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `GitHub API error: ${response.status}`);
        }
    }

    // ============================================
    // UTILITIES
    // ============================================

    generateFilename(title, date) {
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return `${date}-${slug}.md`;
    }

    buildMarkdownContent(title, date, content) {
        return `---
title: "${title}"
date: ${date}
---

${content}`;
    }

    // ============================================
    // UI HELPERS
    // ============================================

    showLogin() {
        this.loginScreen.style.display = 'block';
        this.adminInterface.style.display = 'none';
    }

    showAdmin() {
        this.loginScreen.style.display = 'none';
        this.adminInterface.style.display = 'block';
    }

    showWelcome() {
        this.welcomeView.style.display = 'block';
        this.editorView.style.display = 'none';
    }

    showEditor() {
        this.welcomeView.style.display = 'none';
        this.editorView.style.display = 'block';
        this.deleteBtn.style.display = this.isNewPost ? 'none' : 'inline-block';
        this.clearMessages();
    }

    showLoginError(message) {
        this.loginError.textContent = message;
        this.loginError.style.display = 'block';
    }

    showMessage(type, message) {
        const className = type === 'error' ? 'error' : 'success';
        this.editorMessages.innerHTML = `<div class="${className}">${this.escapeHtml(message)}</div>`;
    }

    clearMessages() {
        this.editorMessages.innerHTML = '';
        this.loginError.style.display = 'none';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize admin interface
const admin = new GitHubBlogAdmin();
