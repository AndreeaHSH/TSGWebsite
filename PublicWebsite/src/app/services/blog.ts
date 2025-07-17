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
        // Note: You might need to add pagination to your backend API
        // For now, we'll get all and slice on frontend
      }

      const response = await firstValueFrom(
        this.http.get<PublicBlogPost[]>(this.apiUrl, { params })
      );

      // Apply limit on frontend if specified
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

      return response;
    } catch (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return null;
    }
  }

  // Get recent posts (excluding current post)
  async getRecentPosts(excludeId?: number, limit: number = 3): Promise<PublicBlogPost[]> {
    try {
      const posts = await this.getPublishedPosts();

      let filteredPosts = posts;
      if (excludeId) {
        filteredPosts = posts.filter(post => post.id !== excludeId);
      }

      return filteredPosts.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent blog posts:', error);
      return [];
    }
  }

  // Get posts by tag
  async getPostsByTag(tag: string): Promise<PublicBlogPost[]> {
    try {
      let params = new HttpParams();
      params = params.set('status', 'published');
      params = params.set('search', tag); // Backend searches in tags too
      params = params.set('sortBy', 'publishedAt');
      params = params.set('sortOrder', 'desc');

      const response = await firstValueFrom(
        this.http.get<PublicBlogPost[]>(this.apiUrl, { params })
      );

      // Additional filtering to ensure the tag is actually in the post's tags
      return response.filter(post =>
        this.parseTags(post.tags).some(postTag =>
          postTag.toLowerCase() === tag.toLowerCase()
        )
      );
    } catch (error) {
      console.error(`Error fetching posts by tag ${tag}:`, error);
      return [];
    }
  }

  // Get all unique tags from published posts
  async getAllTags(): Promise<string[]> {
    try {
      const posts = await this.getPublishedPosts();
      const allTags = new Set<string>();

      posts.forEach(post => {
        this.parseTags(post.tags).forEach(tag => {
          allTags.add(tag);
        });
      });

      return Array.from(allTags).sort();
    } catch (error) {
      console.error('Error fetching all tags:', error);
      return [];
    }
  }

  // Utility method to parse tags from string
  parseTags(tagsString: string): string[] {
    if (!tagsString) return [];
    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  // Utility method to format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Utility method to format reading time
  getReadingTimeText(minutes: number): string {
    if (minutes === 1) return '1 min citire';
    return `${minutes} min citire`;
  }

  // Utility method to truncate text
  truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  // Utility method to create excerpt from content
  createExcerpt(content: string, maxLength: number = 200): string {
    // Remove HTML tags if any
    const textContent = content.replace(/<[^>]*>/g, '');
    return this.truncateText(textContent, maxLength);
  }

  // Utility method to get primary image or placeholder
  getPrimaryImage(post: PublicBlogPost): string {
    return post.featuredImage || '/assets/images/blog-placeholder.jpg';
  }

  // Generate blog post URL
  generatePostUrl(slug: string): string {
    return `/blog/${slug}`;
  }

  // Check if post has images
  hasImages(post: PublicBlogPost): boolean {
    return post.imageCount > 0;
  }

  // Get image count text
  getImageCountText(imageCount: number): string {
    if (imageCount === 0) return '';
    if (imageCount === 1) return '1 imagine';
    return `${imageCount} imagini`;
  }
}
