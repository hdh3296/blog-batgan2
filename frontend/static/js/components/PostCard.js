// PostCard 컴포넌트
import { escapeHtml, formatDate, truncateText } from '../utils.js';

export class PostCard {
    constructor(post, options = {}) {
        this.post = post;
        this.options = {
            truncateLength: 150,
            showAuthor: true,
            dateLocale: 'ko-KR',
            ...options
        };
    }
    
    render() {
        const { id, title, content, created_at, author } = this.post;
        const { truncateLength, showAuthor, dateLocale } = this.options;
        
        return `
            <article class="post-card" role="article" aria-labelledby="post-${id}">
                <h4 id="post-${id}">
                    <a href="/blog/${id}" aria-label="${escapeHtml(title)} 읽기">
                        ${escapeHtml(title)}
                    </a>
                </h4>
                <div class="post-meta">
                    ${showAuthor ? `<span class="author">작성자: ${escapeHtml(author)}</span>` : ''}
                    <time datetime="${created_at}" aria-label="작성일">
                        ${formatDate(created_at, dateLocale)}
                    </time>
                </div>
                <p class="post-excerpt" aria-label="요약">
                    ${escapeHtml(truncateText(content, truncateLength))}
                </p>
                <a href="/blog/${id}" class="read-more" aria-label="${escapeHtml(title)} 전체 읽기">
                    더 읽기 →
                </a>
            </article>
        `;
    }
}

// PostList 컴포넌트
export class PostList {
    constructor(posts = [], options = {}) {
        this.posts = posts;
        this.options = {
            containerClass: 'posts-list',
            emptyMessage: '게시글이 없습니다.',
            ...options
        };
    }
    
    render() {
        const { containerClass, emptyMessage } = this.options;
        
        if (this.posts.length === 0) {
            return `
                <div class="${containerClass} empty">
                    <p>${escapeHtml(emptyMessage)}</p>
                </div>
            `;
        }
        
        const postCards = this.posts.map(post => 
            new PostCard(post, this.options).render()
        ).join('');
        
        return `
            <div class="${containerClass}" role="feed" aria-label="게시글 목록">
                ${postCards}
            </div>
        `;
    }
}