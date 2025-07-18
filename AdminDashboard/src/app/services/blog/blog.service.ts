// AdminDashboard/src/app/services/blog/blog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

// Interfaces matching backend DTOs
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  featuredImage?: string;
  isPublished: boolean;
  createdAt: string;
  publishedAt?: string;
  tags: string;
  author: string;
  viewCount: number;
  readingTime: number;
  imageCount: number;
}

export interface BlogPostDetail {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  featuredImage?: string;
  isPublished: boolean;
  createdAt: string;
  publishedAt?: string;
  tags: string;
  author: string;
  viewCount: number;
  readingTime: number;
  blogImages: string[];
}

export interface BlogPostCreate {
  title: string;
  slug?: string;
  content: string;
  summary?: string;
  author?: string;
  tags?: string;
  isPublished: boolean;
  featuredImageFile?: File;
  blogImageFiles?: File[];
  imageAltTexts?: string[];
}

export interface BlogPostUpdate {
  title?: string;
  slug?: string;
  content?: string;
  summary?: string;
  author?: string;
  tags?: string;
  isPublished?: boolean;
  featuredImageFile?: File;
  blogImageFiles?: File[];
  imageAltTexts?: string[];
  imageIdsToDelete?: number[];
}

export interface BlogFilters {
  search?: string;
  status?: 'all' | 'published' | 'draft';
  sortBy?: 'title' | 'createdAt' | 'publishedAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

export interface ImageUploadResponse {
  id: number;
  url: string;
  altText: string;
  order: number;
  isPrimary: boolean;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  postsThisMonth: number;
  averageReadingTime: number;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly apiUrl = 'http://localhost:5193/api/blog';

  constructor(private http: HttpClient) {}

  // Get all blog posts with optional filtering
  async getAllPosts(filters?: BlogFilters): Promise<BlogPost[]> {
    try {
      let params = new HttpParams();

      if (filters?.search) {
        params = params.set('search', filters.search);
      }
      if (filters?.status && filters.status !== 'all') {
        params = params.set('status', filters.status);
      }
      if (filters?.sortBy) {
        params = params.set('sortBy', filters.sortBy);
      }
      if (filters?.sortOrder) {
        params = params.set('sortOrder', filters.sortOrder);
      }

      const response = await firstValueFrom(
        this.http.get<BlogPost[]>(this.apiUrl, { params })
      );

      return response;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw new Error('Failed to fetch blog posts');
    }
  }

  // Get specific blog post by ID
  async getPost(id: number): Promise<BlogPostDetail> {
    try {
      const response = await firstValueFrom(
        this.http.get<BlogPostDetail>(`${this.apiUrl}/${id}`)
      );

      return response;
    } catch (error) {
      console.error(`Error fetching blog post ${id}:`, error);
      throw new Error(`Failed to fetch blog post with ID ${id}`);
    }
  }

  // Create new blog post
  async createPost(postData: BlogPostCreate): Promise<BlogPostDetail> {
    try {
      const formData = this.buildFormData(postData);

      const response = await firstValueFrom(
        this.http.post<BlogPostDetail>(this.apiUrl, formData)
      );

      return response;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw new Error('Failed to create blog post');
    }
  }

  // Update existing blog post
  async updatePost(id: number, postData: BlogPostUpdate): Promise<void> {
    try {
      const formData = this.buildFormData(postData);

      await firstValueFrom(
        this.http.put(`${this.apiUrl}/${id}`, formData)
      );
    } catch (error) {
      console.error(`Error updating blog post ${id}:`, error);
      throw new Error(`Failed to update blog post with ID ${id}`);
    }
  }

  // Delete blog post
  async deletePost(id: number): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/${id}`)
      );
    } catch (error) {
      console.error(`Error deleting blog post ${id}:`, error);
      throw new Error(`Failed to delete blog post with ID ${id}`);
    }
  }

  // Toggle publish status
  async togglePublishStatus(id: number): Promise<{ isPublished: boolean; publishedAt?: string }> {
    try {
      const response = await firstValueFrom(
        this.http.put<{ isPublished: boolean; publishedAt?: string }>(`${this.apiUrl}/${id}/publish`, {})
      );

      return response;
    } catch (error) {
      console.error(`Error toggling publish status for blog post ${id}:`, error);
      throw new Error(`Failed to toggle publish status for blog post with ID ${id}`);
    }
  }

  // Upload multiple images (for future multi-image support)
  async uploadImages(postId: number, files: File[], altTexts?: string[]): Promise<ImageUploadResponse[]> {
    try {
      const formData = new FormData();

      files.forEach((file, index) => {
        formData.append('blogImageFiles', file);
        if (altTexts && altTexts[index]) {
          formData.append('imageAltTexts', altTexts[index]);
        }
      });

      const response = await firstValueFrom(
        this.http.post<ImageUploadResponse[]>(`${this.apiUrl}/${postId}/images`, formData)
      );

      return response;
    } catch (error) {
      console.error(`Error uploading images for blog post ${postId}:`, error);
      throw new Error(`Failed to upload images for blog post with ID ${postId}`);
    }
  }

  // Delete specific image
  async deleteImage(postId: number, imageId: number): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/${postId}/images/${imageId}`)
      );
    } catch (error) {
      console.error(`Error deleting image ${imageId} from blog post ${postId}:`, error);
      throw new Error(`Failed to delete image ${imageId} from blog post ${postId}`);
    }
  }

  // Get blog statistics (for reports)
  async getBlogStats(): Promise<BlogStats> {
    try {
      const response = await firstValueFrom(
        this.http.get<BlogStats>(`${this.apiUrl}/stats`)
      );

      return response;
    } catch (error) {
      console.error('Error fetching blog statistics:', error);
      throw new Error('Failed to fetch blog statistics');
    }
  }

  // Helper method to build FormData from post data
  private buildFormData(postData: BlogPostCreate | BlogPostUpdate): FormData {
    const formData = new FormData();

    // Add text fields
    Object.entries(postData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'featuredImageFile' &&
          key !== 'blogImageFiles' && key !== 'imageAltTexts' && key !== 'imageIdsToDelete') {
        formData.append(key, value.toString());
      }
    });

    // Add featured image file
    if ('featuredImageFile' in postData && postData.featuredImageFile) {
      formData.append('featuredImageFile', postData.featuredImageFile);
    }

    // Add multiple blog image files
    if ('blogImageFiles' in postData && postData.blogImageFiles) {
      postData.blogImageFiles.forEach((file, index) => {
        formData.append('blogImageFiles', file);
      });
    }

    // Add image alt texts
    if ('imageAltTexts' in postData && postData.imageAltTexts) {
      postData.imageAltTexts.forEach((altText, index) => {
        formData.append('imageAltTexts', altText);
      });
    }

    // Add image IDs to delete (for updates)
    if ('imageIdsToDelete' in postData && postData.imageIdsToDelete) {
      postData.imageIdsToDelete.forEach((id, index) => {
        formData.append('imageIdsToDelete', id.toString());
      });
    }

    return formData;
  }

  // Utility method to generate slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[ăâ]/g, 'a')
      .replace(/[î]/g, 'i')
      .replace(/[șş]/g, 's')
      .replace(/[țţ]/g, 't')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-+|-+$/g, '');
  }

  // Utility method to parse tags from string
  parseTags(tagsString: string): string[] {
    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  // Utility method to format tags to string
  formatTags(tags: string[]): string {
    return tags.join(', ');
  }

  // Utility method to calculate reading time
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  // Utility method to format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Utility method to get status display text
  getStatusText(isPublished: boolean): string {
    return isPublished ? 'Publicat' : 'Ciornă';
  }

  // Utility method to get status color
  getStatusColor(isPublished: boolean): string {
    return isPublished ? '#28a745' : '#ffc107';
  }

  // Validate image file
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipul de fișier nu este acceptat. Folosește JPG, PNG, GIF sau WebP.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Fișierul este prea mare. Dimensiunea maximă este 5MB.'
      };
    }

    return { isValid: true };
  }

  // Validate multiple images
  validateMultipleImages(files: File[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const maxImages = 5;

    if (files.length > maxImages) {
      errors.push(`Poți încărca maxim ${maxImages} imagini.`);
    }

    files.forEach((file, index) => {
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        errors.push(`Imaginea ${index + 1}: ${validation.error}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
