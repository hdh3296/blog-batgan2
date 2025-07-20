// 유틸리티 함수들

// HTML 이스케이핑 (XSS 방지)
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 날짜 포맷팅
export function formatDate(dateString, locale = 'ko-KR') {
    try {
        return new Date(dateString).toLocaleDateString(locale);
    } catch (error) {
        console.error('날짜 포맷팅 오류:', error);
        return '날짜 오류';
    }
}

// 텍스트 자르기
export function truncateText(text, length = 150) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
}

// 에러 메시지 표시
export function showError(message, containerId = 'error-container') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="error-message" role="alert">
                <span>${escapeHtml(message)}</span>
                <button onclick="this.parentElement.remove()" aria-label="닫기">×</button>
            </div>
        `;
        container.style.display = 'block';
    }
}

// 성공 메시지 표시
export function showSuccess(message, containerId = 'success-container') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="success-message" role="alert">
                <span>${escapeHtml(message)}</span>
                <button onclick="this.parentElement.remove()" aria-label="닫기">×</button>
            </div>
        `;
        container.style.display = 'block';
        
        // 3초 후 자동으로 사라짐
        setTimeout(() => {
            container.style.display = 'none';
        }, 3000);
    }
}

// 로딩 상태 표시
export function showLoading(show = true, containerId = 'loading-container') {
    const container = document.getElementById(containerId);
    if (container) {
        if (show) {
            container.innerHTML = `
                <div class="loading-spinner" role="status">
                    <span class="spinner"></span>
                    <span class="loading-text">로딩 중...</span>
                </div>
            `;
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    }
}

// API 요청 래퍼 (에러 처리 포함)
export async function apiRequest(url, options = {}) {
    try {
        showLoading(true);
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { data, error: null };
        
    } catch (error) {
        console.error('API 요청 오류:', error);
        return { data: null, error: error.message };
    } finally {
        showLoading(false);
    }
}

// 디바운스 함수
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}