// API �t� URL
const API_BASE = '/api/v1';

// \� 줸 \�
async function loadRecentPosts() {
    try {
        const response = await fetch(`${API_BASE}/posts/?limit=5`);
        const data = await response.json();
        
        const container = document.getElementById('recent-posts-container');
        container.innerHTML = data.items.map(post => `
            <article class="post-card">
                <h4><a href="/blog/${post.id}">${post.title}</a></h4>
                <p>${post.content.substring(0, 150)}...</p>
                <time>${new Date(post.created_at).toLocaleDateString('ko-KR')}</time>
            </article>
        `).join('');
    } catch (error) {
        console.error('줸 \� �(:', error);
    }
}

// \� �8 �t��
async function loadPost(postId) {
    try {
        const response = await fetch(`${API_BASE}/posts/${postId}`);
        const post = await response.json();
        
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-content').innerHTML = post.content;
        document.getElementById('post-date').textContent = 
            new Date(post.created_at).toLocaleDateString('ko-KR');
    } catch (error) {
        console.error('줸 \� �(:', error);
    }
}

// \� �] �t��
async function loadAllPosts() {
    try {
        const response = await fetch(`${API_BASE}/posts/`);
        const data = await response.json();
        
        const container = document.getElementById('posts-container');
        container.innerHTML = data.items.map(post => `
            <article class="post-item">
                <h3><a href="/blog/${post.id}">${post.title}</a></h3>
                <div class="post-meta">
                    <span>�1�: ${post.author}</span>
                    <time>${new Date(post.created_at).toLocaleDateString('ko-KR')}</time>
                </div>
                <p>${post.content.substring(0, 200)}...</p>
                <a href="/blog/${post.id}" class="read-more">T }0 �</a>
            </article>
        `).join('');
    } catch (error) {
        console.error('줸 �] \� �(:', error);
    }
}