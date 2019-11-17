import Parser from 'rss-parser';
import request from './request';
import qs from 'query-string';

export default {
  setAutoLoginUrl(url: string) {
    return request(`/api/auto_login`, {
      method: 'POST',
      body: {
        payload: {
          url,
        },
      },
    });
  },
  getAutoLoginUrl() {
    return request(`/api/auto_login`);
  },
  deleteAutoLoginUrl() {
    return request(`/api/auto_login`, {
      method: 'DELETE',
    });
  },
  fetchUser() {
    return request('/api/user');
  },
  async fetchFeed(rssUrl: string) {
    const res = await fetch(rssUrl, {
      credentials: 'include',
    });
    if (res.status !== 200) {
      throw Object.assign(new Error(), {
        status: res.status,
      });
    }
    const text = await res.text();
    const parser = new Parser();
    const result = await parser.parseString(text);
    return result;
  },
  fetchPosts() {
    return request('/api/posts');
  },
  createVote(vote: any) {
    const path = '/api/votes';
    return request(path, {
      method: 'POST',
      body: {
        payload: vote,
      },
    });
  },
  deleteVote(vote: any) {
    const path = `/api/votes`;
    return request(path, {
      method: 'DELETE',
      body: {
        payload: vote,
      },
    });
  },
};