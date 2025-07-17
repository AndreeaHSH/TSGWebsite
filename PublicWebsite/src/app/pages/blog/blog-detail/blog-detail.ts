// PublicWebsite/src/app/pages/blog/blog-detail/blog-detail.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService, PublicBlogPostDetail, PublicBlogPost } from '../../../services/blog';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.html',
  styleUrls: ['./blog-detail.scss']
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  blogPost: PublicBlogPostDetail | null = null;
  relatedPosts: PublicBlogPost[] = [];
  isLoading = true;
  error: string | null = null;
  slug = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  async ngOnInit(): Promise<void> {
    // Get slug from route parameters
    this.route.params.subscribe(async params => {
      this.slug = params['slug'];
      if (this.slug) {
        await this.loadBlogPost();
      } else {
        this.router.navigate(['/blog']);
      }
    });
  }

  ngOnDestroy(): void {
    // Reset meta tags when leaving the component
    this.titleService.setTitle('TSG - Transilvania Star Group');
    this.metaService.removeTag('name="description"');
    this.metaService.removeTag('property="og:title"');
    this.metaService.removeTag('property="og:description"');
    this.metaService.removeTag('property="og:image"');
  }

  async loadBlogPost(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const [post, recentPosts] = await Promise.all([
        this.blogService.getPostBySlug(this.slug),
        this.blogService.getRecentPosts(undefined, 4)
      ]);

      if (!post) {
        this.error = 'Postarea nu a fost găsită.';
        return;
      }

      this.blogPost = post;

      // Get related posts excluding current post
      this.relatedPosts = await this.blogService.getRecentPosts(post.id, 3);

      // Update page title and meta tags
      this.updateMetaTags(post);

    } catch (error) {
      console.error('Error loading blog post:', error);
      this.error = 'Nu am putut încărca postarea. Vă rugăm să încercați din nou.';
    } finally {
      this.isLoading = false;
    }
  }

  private updateMetaTags(post: PublicBlogPostDetail): void {
    // Update page title
    this.titleService.setTitle(`${post.title} - TSG Blog`);

    // Update meta description
    this.metaService.updateTag({
      name: 'description',
      content: post.summary || post.title
    });

    // Update Open Graph tags
    this.metaService.updateTag({
      property: 'og:title',
      content: post.title
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: post.summary || post.title
    });

    if (post.featuredImage) {
      this.metaService.updateTag({
        property: 'og:image',
        content: post.featuredImage
      });
    }
  }

  // Navigation methods
  goBackToBlog(): void {
    this.router.navigate(['/blog']);
  }

  navigateToRelatedPost(post: PublicBlogPost): void {
    if (post?.slug) {
      this.router.navigate(['/blog', post.slug]);
    }
  }

  navigateToTag(tag: string): void {
    this.router.navigate(['/blog/tag', tag]);
  }

  // Utility methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  parseTags(tags: string): string[] {
    return tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
  }

  getReadingTimeText(readingTime: number): string {
    return `${readingTime} min citire`;
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Share functionality
  shareOnFacebook(): void {
    if (this.blogPost) {
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(this.blogPost.title);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, '_blank');
    }
  }

  shareOnTwitter(): void {
    if (this.blogPost) {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`${this.blogPost.title} - ${this.blogPost.summary}`);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    }
  }

  shareOnLinkedIn(): void {
    if (this.blogPost) {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      // You could show a toast notification here
      console.log('Link copied to clipboard');
    });
  }

  // Print functionality
  printPost(): void {
    window.print();
  }

  // Track by functions for ngFor
  trackByRelatedPost(index: number, post: PublicBlogPost): number {
    return post.id;
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }

  trackByImage(index: number, image: string): string {
    return image;
  }

  // Retry functionality
  async retryLoad(): Promise<void> {
    await this.loadBlogPost();
  }
}
