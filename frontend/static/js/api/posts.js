// Posts API 모듈
import { apiRequest } from '../utils.js';

export class PostsAPI {
    constructor(baseURL = '/api/v1') {
        this.baseURL = baseURL;
    }
    
    // 게시글 목록 가져오기
    async getAll(options = {}) {
        const { limit = 10, skip = 0, publishedOnly = true } = options;
        const url = `${this.baseURL}/posts/?limit=${limit}&skip=${skip}&published_only=${publishedOnly}`;
        
        const { data, error } = await apiRequest(url);
        
        if (error) {
            throw new Error(`게시글 목록을 불러올 수 없습니다: ${error}`);
        }
        
        return data;
    }
    
    // 특정 게시글 가져오기
    async getById(id) {
        if (!id) {
            throw new Error('게시글 ID가 필요합니다');
        }
        
        const url = `${this.baseURL}/posts/${id}`;
        const { data, error } = await apiRequest(url);
        
        if (error) {
            if (error.includes('404')) {
                throw new Error('게시글을 찾을 수 없습니다');
            }
            throw new Error(`게시글을 불러올 수 없습니다: ${error}`);
        }
        
        return data;
    }
    
    // 게시글 생성
    async create(postData) {
        const url = `${this.baseURL}/posts/`;
        const { data, error } = await apiRequest(url, {
            method: 'POST',
            body: JSON.stringify(postData),
        });
        
        if (error) {
            throw new Error(`게시글을 생성할 수 없습니다: ${error}`);
        }
        
        return data;
    }
    
    // 게시글 업데이트
    async update(id, postData) {
        if (!id) {
            throw new Error('게시글 ID가 필요합니다');
        }
        
        const url = `${this.baseURL}/posts/${id}`;
        const { data, error } = await apiRequest(url, {
            method: 'PUT',
            body: JSON.stringify(postData),
        });
        
        if (error) {
            throw new Error(`게시글을 수정할 수 없습니다: ${error}`);
        }
        
        return data;
    }
    
    // 게시글 삭제
    async delete(id) {
        if (!id) {
            throw new Error('게시글 ID가 필요합니다');
        }
        
        const url = `${this.baseURL}/posts/${id}`;
        const { data, error } = await apiRequest(url, {
            method: 'DELETE',
        });
        
        if (error) {
            throw new Error(`게시글을 삭제할 수 없습니다: ${error}`);
        }
        
        return data;
    }
}

// 싱글톤 인스턴스
export const postsAPI = new PostsAPI();