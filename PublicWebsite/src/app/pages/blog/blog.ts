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
      // Load featured post and other posts in parallel
      const [featuredPost, allPosts, tags] = await Promise.all([
        this.blogService.getFeaturedPost(),
        this.blogService.getPublishedPosts(),
        this.blogService.getAllTags()
      ]);

      this.featuredPost = featuredPost;

      // Remove featured post from regular posts list
      this.blogPosts = featuredPost
        ? allPosts.filter(post => post.id !== featuredPost.id).slice(0, 6)
        : allPosts.slice(0, 6);

      this.allTags = tags.slice(0, 10); // Show top 10 tags

    } catch (error) {
      console.error('Error loading blog data:', error);
      this.error = 'Nu am putut încărca postările de blog. Vă rugăm să încercați din nou.';
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

  // Utility methods for templates
  formatDate(dateString: string): string {
    return this.blogService.formatDate(dateString);
  }

  getReadingTimeText(minutes: number): string {
    return this.blogService.getReadingTimeText(minutes);
  }

  truncateText(text: string, maxLength: number = 150): string {
    return this.blogService.truncateText(text, maxLength);
  }

  createExcerpt(content: string): string {
    return this.blogService.createExcerpt(content, 200);
  }

  getPrimaryImage(post: PublicBlogPost): string {
    return this.blogService.getPrimaryImage(post);
  }

  parseTags(tagsString: string): string[] {
    return this.blogService.parseTags(tagsString);
  }

  hasImages(post: PublicBlogPost): boolean {
    return this.blogService.hasImages(post);
  }

  getImageCountText(imageCount: number): string {
    return this.blogService.getImageCountText(imageCount);
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

  // Handle retry on error
  async retryLoad(): Promise<void> {
    await this.loadBlogData();
  }
}
