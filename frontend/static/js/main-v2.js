// 개선된 메인 JavaScript 파일
import { postsAPI } from './api/posts.js';
import { PostCard, PostList } from './components/PostCard.js';
import { showError, showSuccess, escapeHtml } from './utils.js';
import { blogState } from './state/BlogState.js';

// 최근 게시글 로드
export async function loadRecentPosts() {
    blogState.setLoading(true);
    
    try {
        const data = await postsAPI.getAll({ limit: 5 });
        blogState.setPosts(data.items);
        
        const container = document.getElementById('recent-posts-container');
        
        if (!container) return;
        
        const postList = new PostList(data.items, {
            containerClass: 'recent-posts',
            showAuthor: false,
            truncateLength: 150
        });
        
        container.innerHTML = postList.render();
        
    } catch (error) {
        blogState.setError(error.message);
        showError(error.message);
        console.error('최근 게시글 로드 오류:', error);
    } finally {
        blogState.setLoading(false);
    }
}

// 게시글 상세 페이지
export async function loadPost(postId) {
    blogState.setLoading(true);
    
    try {
        const post = await postsAPI.getById(postId);
        blogState.setCurrentPost(post);
        
        // 제목 설정
        const titleElement = document.getElementById('post-title');
        if (titleElement) {
            titleElement.textContent = post.title;
            document.title = `${post.title} | 블로그`;
        }
        
        // 내용 설정 (XSS 방지)
        const contentElement = document.getElementById('post-content');
        if (contentElement) {
            // 실제로는 마크다운 파서나 안전한 HTML 파서를 사용해야 합니다
            contentElement.textContent = post.content;
        }
        
        // 메타데이터 설정
        const metaContainer = document.getElementById('post-meta');
        if (metaContainer) {
            metaContainer.innerHTML = `
                <span class="author">작성자: ${escapeHtml(post.author)}</span>
                <time datetime="${post.created_at}" aria-label="작성일">
                    ${new Date(post.created_at).toLocaleDateString('ko-KR')}
                </time>
            `;
        }
        
        showSuccess('게시글을 불러왔습니다');
        
    } catch (error) {
        blogState.setError(error.message);
        showError(error.message);
        console.error('게시글 로드 오류:', error);
    } finally {
        blogState.setLoading(false);
    }
}

// 모든 게시글 페이지
export async function loadAllPosts(page = 1, limit = 10) {
    blogState.setLoading(true);
    blogState.setCurrentPage(page);
    
    try {
        const skip = (page - 1) * limit;
        const data = await postsAPI.getAll({ limit, skip });
        
        blogState.setPosts(data.items);
        blogState.setPaginationData(data);
        
        const container = document.getElementById('posts-container');
        
        if (!container) return;
        
        const postList = new PostList(data.items, {
            containerClass: 'all-posts',
            showAuthor: true,
            truncateLength: 200,
            emptyMessage: '아직 게시글이 없습니다.'
        });
        
        container.innerHTML = postList.render();
        
        // 페이지네이션 추가
        renderPagination(data.count, page, limit);
        
    } catch (error) {
        blogState.setError(error.message);
        showError(error.message);
        console.error('게시글 목록 로드 오류:', error);
    } finally {
        blogState.setLoading(false);
    }
}

// 페이지네이션 렌더링
function renderPagination(totalCount, currentPage, limit) {
    const totalPages = Math.ceil(totalCount / limit);
    const paginationContainer = document.getElementById('pagination');
    
    if (!paginationContainer || totalPages <= 1) return;
    
    let paginationHTML = '<nav aria-label="페이지네이션"><ul class="pagination">';
    
    // 이전 페이지
    if (currentPage > 1) {
        paginationHTML += `
            <li>
                <a href="?page=${currentPage - 1}" aria-label="이전 페이지">
                    ← 이전
                </a>
            </li>
        `;
    }
    
    // 페이지 번호들
    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage;
        paginationHTML += `
            <li>
                <a href="?page=${i}" 
                   ${isActive ? 'aria-current="page" class="active"' : ''}
                   aria-label="페이지 ${i}">
                    ${i}
                </a>
            </li>
        `;
    }
    
    // 다음 페이지
    if (currentPage < totalPages) {
        paginationHTML += `
            <li>
                <a href="?page=${currentPage + 1}" aria-label="다음 페이지">
                    다음 →
                </a>
            </li>
        `;
    }
    
    paginationHTML += '</ul></nav>';
    paginationContainer.innerHTML = paginationHTML;
}

// 페이지 초기화
export function initializePage() {
    // 현재 페이지 감지
    const path = window.location.pathname;
    
    if (path === '/' || path === '/index.html') {
        loadRecentPosts();
    } else if (path === '/blog' || path === '/blog.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const page = parseInt(urlParams.get('page')) || 1;
        loadAllPosts(page);
    } else if (path.startsWith('/blog/')) {
        const postId = path.split('/').pop();
        if (postId) {
            loadPost(postId);
        }
    }
}

// 상태 구독 설정
function setupStateSubscription() {
    blogState.subscribe((state) => {
        // 로딩 상태 UI 업데이트
        const loadingContainer = document.getElementById('loading-container');
        if (loadingContainer) {
            if (state.loading) {
                loadingContainer.style.display = 'block';
                loadingContainer.innerHTML = `
                    <div class="loading-spinner" role="status">
                        <span class="spinner"></span>
                        <span class="loading-text">로딩 중...</span>
                    </div>
                `;
            } else {
                loadingContainer.style.display = 'none';
            }
        }
        
        // 디버깅을 위한 콘솔 로그
        if (window.location.hostname === 'localhost') {
            console.log('상태 업데이트:', state);
        }
    });
}

// DOM이 로드되면 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupStateSubscription();
        initializePage();
    });
} else {
    setupStateSubscription();
    initializePage();
}