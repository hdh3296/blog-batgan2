// 간단한 상태 관리 시스템

export class BlogState {
    constructor() {
        this.state = {
            posts: [],
            currentPost: null,
            loading: false,
            error: null,
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalCount: 0,
                limit: 10
            },
            filters: {
                publishedOnly: true,
                searchQuery: ''
            }
        };
        
        this.listeners = new Set();
        this.history = [];
        this.maxHistorySize = 10;
    }
    
    // 상태 구독
    subscribe(listener) {
        this.listeners.add(listener);
        // 현재 상태를 즉시 전달
        listener(this.state);
        
        // 구독 해제 함수 반환
        return () => this.listeners.delete(listener);
    }
    
    // 상태 업데이트
    setState(updates) {
        // 이전 상태 저장 (undo 기능을 위해)
        this.saveHistory();
        
        // 상태 업데이트
        this.state = { ...this.state, ...updates };
        
        // 구독자들에게 알림
        this.notify();
    }
    
    // 중첩된 상태 업데이트
    updateNestedState(path, value) {
        const keys = path.split('.');
        const newState = { ...this.state };
        
        let current = newState;
        for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        
        this.setState(newState);
    }
    
    // 상태 초기화
    resetState() {
        this.setState({
            posts: [],
            currentPost: null,
            loading: false,
            error: null,
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalCount: 0,
                limit: 10
            },
            filters: {
                publishedOnly: true,
                searchQuery: ''
            }
        });
    }
    
    // 구독자들에게 알림
    notify() {
        this.listeners.forEach(listener => {
            try {
                listener(this.state);
            } catch (error) {
                console.error('상태 알림 중 오류 발생:', error);
            }
        });
    }
    
    // 상태 히스토리 저장
    saveHistory() {
        this.history.push(JSON.parse(JSON.stringify(this.state)));
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
    }
    
    // 이전 상태로 복원
    undo() {
        if (this.history.length > 0) {
            const previousState = this.history.pop();
            this.state = previousState;
            this.notify();
        }
    }
    
    // 특정 상태 가져오기
    getState(path) {
        if (!path) return this.state;
        
        const keys = path.split('.');
        let current = this.state;
        
        for (const key of keys) {
            if (current[key] === undefined) return undefined;
            current = current[key];
        }
        
        return current;
    }
    
    // 페이지 관련 액션
    setCurrentPage(page) {
        this.updateNestedState('pagination.currentPage', page);
    }
    
    setPaginationData(data) {
        this.setState({
            pagination: {
                ...this.state.pagination,
                totalCount: data.count,
                totalPages: Math.ceil(data.count / this.state.pagination.limit)
            }
        });
    }
    
    // 포스트 관련 액션
    setPosts(posts) {
        this.setState({ posts, error: null });
    }
    
    setCurrentPost(post) {
        this.setState({ currentPost: post, error: null });
    }
    
    // 로딩 상태 관리
    setLoading(loading) {
        this.setState({ loading });
    }
    
    // 에러 상태 관리
    setError(error) {
        this.setState({ error, loading: false });
    }
    
    // 필터 관련 액션
    setSearchQuery(query) {
        this.updateNestedState('filters.searchQuery', query);
    }
    
    setPublishedOnly(publishedOnly) {
        this.updateNestedState('filters.publishedOnly', publishedOnly);
    }
}

// 싱글톤 인스턴스
export const blogState = new BlogState();

// 디버깅을 위한 전역 접근
if (typeof window !== 'undefined') {
    window.blogState = blogState;
}