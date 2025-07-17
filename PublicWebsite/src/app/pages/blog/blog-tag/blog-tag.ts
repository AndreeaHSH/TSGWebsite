// PublicWebsite/src/app/pages/blog/blog-tag/blog-tag.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BlogService, PublicBlogPost } from '../../../services/blog';

@Component({
  selector: 'app-blog-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-tag.html',
  styleUrls: ['./blog-tag.scss']
})
export class BlogTagComponent implements OnInit {
  currentTag = '';
  blogPosts: PublicBlogPost[] = [];
  allPosts: PublicBlogPost[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private titleService: Title
  ) {}

  async ngOnInit(): Promise<void> {
    // Get tag from route parameters
    this.route.params.subscribe(async params => {
      this.currentTag = params['tag'];
      if (this.currentTag) {
        this.titleService.setTitle(`${this.currentTag} - Blog TSG`);
        await this.loadPostsByTag();
      } else {
        this.router.navigate(['/blog']);
      }
    });
  }

  async loadPostsByTag(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      // Load all published posts
      this.allPosts = await this.blogService.getPublishedPosts();

      // Filter posts by current tag
      this.blogPosts = this.allPosts.filter(post =>
        this.parseTags(post.tags).some(tag =>
          tag.toLowerCase() === this.currentTag.toLowerCase()
        )
      );

    } catch (error) {
      console.error('Error loading posts by tag:', error);
      this.error = 'Nu am putut încărca articolele. Vă rugăm să încercați din nou.';
    } finally {
      this.isLoading = false;
    }
  }

  // Navigation methods
  goBackToBlog(): void {
    this.router.navigate(['/blog']);
  }

  navigateToPost(post: PublicBlogPost): void {
    if (post?.slug) {
      this.router.navigate(['/blog', post.slug]);
    }
  }

  navigateToTag(tag: string): void {
    this.router.navigate(['/blog/tag', tag]);
  }

  // Utility methods
  parseTags(tags: string): string[] {
    return tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getReadingTimeText(readingTime: number): string {
    return `${readingTime} min citire`;
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Track by functions
  trackByPost(index: number, post: PublicBlogPost): number {
    return post.id;
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }

  // Retry functionality
  async retryLoad(): Promise<void> {
    await this.loadPostsByTag();
  }
}
