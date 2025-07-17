// PublicWebsite/src/app/services/blog.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

export interface PublicBlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  featuredImage?: string;
  publishedAt: string;
  tags: string;
  author: string;
  viewCount: number;
  readingTime: number;
  imageCount: number;
}

export interface PublicBlogPostDetail {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  featuredImage?: string;
  publishedAt: string;
  tags: string;
  author: string;
  viewCount: number;
  readingTime: number;
  blogImages: string[];
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly apiUrl = 'http://localhost:5193/api/blog';

  constructor(private http: HttpClient) {}

  // Get published blog posts for public display
  async getPublishedPosts(limit?: number): Promise<PublicBlogPost[]> {
    try {
      let params = new HttpParams();
      params = params.set('status', 'published');
      params = params.set('sortBy', 'publishedAt');
      params = params.set('sortOrder', 'desc');

      if (limit) {
        params = params.set('limit', limit.toString());
      }

      const response = await firstValueFrom(
        this.http.get<PublicBlogPost[]>(this.apiUrl, { params })
      );

      // Apply limit on frontend if backend doesn't support it
      return limit ? response.slice(0, limit) : response;
    } catch (error) {
      console.error('Error fetching published blog posts:', error);
      return [];
    }
  }

  // Get featured blog post (most recent published)
  async getFeaturedPost(): Promise<PublicBlogPost | null> {
    try {
      const posts = await this.getPublishedPosts(1);
      return posts.length > 0 ? posts[0] : null;
    } catch (error) {
      console.error('Error fetching featured blog post:', error);
      return null;
    }
  }

  // Get blog post by slug for detail view
  async getPostBySlug(slug: string): Promise<PublicBlogPostDetail | null> {
    try {
      // First get all published posts to find the one with matching slug
      const posts = await this.getPublishedPosts();
      const post = posts.find(p => p.slug === slug);

      if (!post) {
        return null;
      }

      // Then get the detailed version
      const response = await firstValueFrom(
        this.http.get<PublicBlogPostDetail>(`${this.apiUrl}/${post.id}`)
      );

      // Increment view count (optional - you might want to do this on backend)
      this.incrementViewCount(post.id);

      return response;
    } catch (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return null;
    }
  }

  // Get recent posts (excluding current post)
  async getRecentPosts(excludeId?: number, limit: number = 3): Promise<PublicBlogPost[]> {
    try {
      const allPosts = await this.getPublishedPosts();

      let filteredPosts = allPosts;
      if (excludeId) {
        filteredPosts = allPosts.filter(post => post.id !== excludeId);
      }

      return filteredPosts.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      return [];
    }
  }

  // Get posts by author
  async getPostsByAuthor(author: string): Promise<PublicBlogPost[]> {
    try {
      const allPosts = await this.getPublishedPosts();
      return allPosts.filter(post =>
        post.author.toLowerCase() === author.toLowerCase()
      );
    } catch (error) {
      console.error(`Error fetching posts by author ${author}:`, error);
      return [];
    }
  }

  // Get popular posts (by view count)
  async getPopularPosts(limit: number = 5): Promise<PublicBlogPost[]> {
    try {
      const allPosts = await this.getPublishedPosts();
      return allPosts
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching popular posts:', error);
      return [];
    }
  }

  // Get posts by tag
  async getPostsByTag(tag: string): Promise<PublicBlogPost[]> {
    try {
      const allPosts = await this.getPublishedPosts();

      return allPosts.filter(post => {
        const postTags = this.parseTags(post.tags);
        return postTags.some(postTag =>
          postTag.toLowerCase() === tag.toLowerCase()
        );
      });
    } catch (error) {
      console.error(`Error fetching posts with tag ${tag}:`, error);
      return [];
    }
  }

  // Get all unique tags
  async getAllTags(): Promise<string[]> {
    try {
      const allPosts = await this.getPublishedPosts();
      const allTags = allPosts
        .flatMap(post => this.parseTags(post.tags))
        .filter((tag, index, array) => array.indexOf(tag) === index)
        .sort();

      return allTags;
    } catch (error) {
      console.error('Error fetching all tags:', error);
      return [];
    }
  }

  // Search posts by title or content
  async searchPosts(query: string): Promise<PublicBlogPost[]> {
    try {
      const allPosts = await this.getPublishedPosts();
      const searchQuery = query.toLowerCase();

      return allPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.summary.toLowerCase().includes(searchQuery) ||
        this.parseTags(post.tags).some(tag =>
          tag.toLowerCase().includes(searchQuery)
        )
      );
    } catch (error) {
      console.error(`Error searching posts with query ${query}:`, error);
      return [];
    }
  }

  // Increment view count (optional method)
  private async incrementViewCount(postId: number): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/${postId}/view`, {})
      );
    } catch (error) {
      // Silently fail - this is not critical
      console.debug('Could not increment view count:', error);
    }
  }

  // Helper method to parse tags
  private parseTags(tags: string): string[] {
    return tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
  }

  // Helper method to calculate reading time (if not provided by backend)
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Helper method to format date
  formatDate(dateString: string, locale: string = 'ro-RO'): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Helper method to truncate text
  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
