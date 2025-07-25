// PublicWebsite/src/app/pages/blog/blog.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BlogService, PublicBlogPost } from '../../services/blog';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.html',
  styleUrls: ['./blog.scss']
})
export class BlogComponent implements OnInit {
  featuredPost: PublicBlogPost | null = null;
  blogPosts: PublicBlogPost[] = [];
  allTags: string[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadBlogData();
  }

  async loadBlogData(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      // Load featured post and other posts
      const [featured, posts] = await Promise.all([
        this.blogService.getFeaturedPost(),
        this.blogService.getPublishedPosts()
      ]);

      this.featuredPost = featured;
      this.blogPosts = posts?.filter(post => post.id !== featured?.id) || [];

      // Extract unique tags
      this.extractTags();

    } catch (error) {
      console.error('Error loading blog data:', error);
      this.error = 'Nu am putut încărca articolele. Vă rugăm să încercați din nou.';
    } finally {
      this.isLoading = false;
    }
  }

  private extractTags(): void {
    const allPostTags = [this.featuredPost, ...this.blogPosts]
      .filter(post => post && post.tags)
      .flatMap(post => this.parseTags(post!.tags));

    this.allTags = [...new Set(allPostTags)].sort();
  }

  // Navigate to blog detail page using slug
  navigateToPost(post: PublicBlogPost): void {
    if (post?.slug) {
      this.router.navigate(['/blog', post.slug]);
    }
  }

  // Navigate to tag filter page
  navigateToTag(tag: string): void {
    this.router.navigate(['/blog/tag', tag]);
  }

  // Parse tags from comma-separated string
  parseTags(tags: string): string[] {
    return tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get reading time text
  getReadingTimeText(readingTime: number): string {
    return `${readingTime} min citire`;
  }

  // Truncate text to specified length
  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Track by function for ngFor
  trackByPost(index: number, post: PublicBlogPost): number {
    return post.id;
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }

  // Retry loading data
  async retryLoad(): Promise<void> {
    await this.loadBlogData();
  }
}
