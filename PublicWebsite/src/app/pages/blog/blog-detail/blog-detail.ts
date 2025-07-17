// PublicWebsite/src/app/pages/blog/blog-detail/blog-detail.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService, PublicBlogPostDetail, PublicBlogPost } from '../../../services/blog';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.html',
  styleUrls: ['./blog-detail.scss']
})
export class BlogDetailComponent implements OnInit {
  blogPost: PublicBlogPostDetail | null = null;
  relatedPosts: PublicBlogPost[] = [];
  isLoading = true;
  error: string | null = null;
  slug = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {}

  async ngOnInit(): Promise<void> {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    if (this.slug) {
      await this.loadBlogPost();
    } else {
      this.router.navigate(['/blog']);
    }
  }

  async loadBlogPost(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const [post, relatedPosts] = await Promise.all([
        this.blogService.getPostBySlug(this.slug),
        this.blogService.getRecentPosts(undefined, 3)
      ]);

      if (!post) {
        this.error = 'Postarea nu a fost găsită.';
        return;
      }

      this.blogPost = post;

      // Get related posts excluding current post
      this.relatedPosts = await this.blogService.getRecentPosts(post.id, 3);

    } catch (error) {
      console.error('Error loading blog post:', error);
      this.error = 'Nu am putut încărca postarea. Vă rugăm să încercați din nou.';
    } finally {
      this.isLoading = false;
    }
  }

  // Navigation methods
  navigateToPost(post: PublicBlogPost): void {
    this.router.navigate(['/blog', post.slug]);
  }

  navigateToTag(tag: string): void {
    this.router.navigate(['/blog/tag', tag]);
  }

  goBackToBlog(): void {
    this.router.navigate(['/blog']);
  }

  // Utility methods
  formatDate(dateString: string): string {
    return this.blogService.formatDate(dateString);
  }

  getReadingTimeText(minutes: number): string {
    return this.blogService.getReadingTimeText(minutes);
  }

  parseTags(tagsString: string): string[] {
    return this.blogService.parseTags(tagsString);
  }

  getPrimaryImage(post: PublicBlogPost | PublicBlogPostDetail): string {
    return this.blogService.getPrimaryImage(post as PublicBlogPost);
  }

  // Handle image loading errors
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/blog-placeholder.jpg';
  }

  // Track by function for performance
  trackByPostId(index: number, post: PublicBlogPost): number {
    return post.id;
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }

  trackByImage(index: number, image: string): string {
    return image;
  }

  // Handle retry on error
  async retryLoad(): Promise<void> {
    await this.loadBlogPost();
  }

  // Share functionality (future enhancement)
  sharePost(): void {
    if (navigator.share && this.blogPost) {
      navigator.share({
        title: this.blogPost.title,
        text: this.blogPost.summary,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link-ul a fost copiat în clipboard!');
    }
  }

  // Print functionality
  printPost(): void {
    window.print();
  }
}
