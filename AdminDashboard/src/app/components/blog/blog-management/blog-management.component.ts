// AdminDashboard/src/app/components/blog/blog-management/blog-management.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService, BlogPost, BlogFilters } from '../../../services/blog/blog.service';

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-management.component.html',
  styleUrls: ['./blog-management.component.scss']
})
export class BlogManagementComponent implements OnInit {
  // State signals
  blogPosts = signal<BlogPost[]>([]);
  filteredPosts = signal<BlogPost[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Filter and search state
  filters: BlogFilters = {
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };

  // UI state
  isDeleteConfirmOpen = signal(false);
  postToDelete = signal<BlogPost | null>(null);
  isDeleting = signal(false);
  publishingPosts = signal<Set<number>>(new Set());

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  async loadBlogPosts(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const posts = await this.blogService.getAllPosts(this.filters);
      this.blogPosts.set(posts);
      this.filteredPosts.set(posts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      this.error.set('Nu am putut încărca postările de blog. Vă rugăm să încercați din nou.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onFilterChange(): Promise<void> {
    await this.loadBlogPosts();
  }

  navigateToEdit(postId: number): void {
    this.router.navigate(['/blog/edit', postId]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/blog/create']);
  }

  openDeleteConfirmation(post: BlogPost): void {
    this.postToDelete.set(post);
    this.isDeleteConfirmOpen.set(true);
  }

  closeDeleteConfirmation(): void {
    this.isDeleteConfirmOpen.set(false);
    this.postToDelete.set(null);
  }

  async confirmDelete(): Promise<void> {
    const post = this.postToDelete();
    if (!post) return;

    this.isDeleting.set(true);

    try {
      await this.blogService.deletePost(post.id);
      await this.loadBlogPosts(); // Reload the list
      this.closeDeleteConfirmation();
    } catch (error) {
      console.error('Error deleting post:', error);
      this.error.set('Nu am putut șterge postarea. Vă rugăm să încercați din nou.');
    } finally {
      this.isDeleting.set(false);
    }
  }

  async togglePublishStatus(post: BlogPost): Promise<void> {
    // Add post ID to publishing set to show loading state
    const currentPublishing = this.publishingPosts();
    currentPublishing.add(post.id);
    this.publishingPosts.set(new Set(currentPublishing));

    try {
      await this.blogService.togglePublishStatus(post.id);
      await this.loadBlogPosts(); // Reload to get updated data
    } catch (error) {
      console.error('Error updating publish status:', error);
      this.error.set('Nu am putut actualiza statusul postării. Vă rugăm să încercați din nou.');
    } finally {
      // Remove post ID from publishing set
      const updatedPublishing = this.publishingPosts();
      updatedPublishing.delete(post.id);
      this.publishingPosts.set(new Set(updatedPublishing));
    }
  }

  // TrackBy functions for performance
  trackByPost(index: number, item: BlogPost): number {
    return item.id;
  }

  trackByTag(index: number, item: string): string {
    return item;
  }

  formatDate(dateString: string): string {
    return this.blogService.formatDate(dateString);
  }

  getTags(tagsString: string): string[] {
    return this.blogService.parseTags(tagsString);
  }

  getStatusColor(post: BlogPost): string {
    return this.blogService.getStatusColor(post.isPublished);
  }

  getStatusText(post: BlogPost): string {
    return this.blogService.getStatusText(post.isPublished);
  }

  isPublishing(postId: number): boolean {
    return this.publishingPosts().has(postId);
  }

  getImageCountText(imageCount: number): string {
    if (imageCount === 0) return 'Fără imagini';
    if (imageCount === 1) return '1 imagine';
    return `${imageCount} imagini`;
  }

  // Utility method for truncating summary
  truncateSummary(summary: string, maxLength: number = 150): string {
    if (summary.length <= maxLength) return summary;
    return summary.substring(0, maxLength) + '...';
  }

  // Get reading time display text
  getReadingTimeText(minutes: number): string {
    if (minutes === 1) return '1 min citire';
    return `${minutes} min citire`;
  }

  // Get view count display text
  getViewCountText(viewCount: number): string {
    if (viewCount === 0) return 'Fără vizualizări';
    if (viewCount === 1) return '1 vizualizare';
    return `${viewCount} vizualizări`;
  }

  // Handle retry after error
  async retryLoad(): Promise<void> {
    this.error.set(null);
    await this.loadBlogPosts();
  }

  // Clear search and filters
  clearFilters(): void {
    this.filters = {
      search: '',
      status: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    this.onFilterChange();
  }

  // Check if filters are applied
  hasActiveFilters(): boolean {
    return !!(this.filters.search ||
             this.filters.status !== 'all' ||
             this.filters.sortBy !== 'createdAt' ||
             this.filters.sortOrder !== 'desc');
  }

  // Get results summary text
  getResultsSummaryText(): string {
    const total = this.blogPosts().length;
    const filtered = this.filteredPosts().length;

    if (total === filtered) {
      if (total === 0) return 'Nu există postări';
      if (total === 1) return '1 postare găsită';
      return `${total} postări găsite`;
    }

    return `${filtered} din ${total} postări găsite`;
  }

  // Get empty state message based on filters
  getEmptyStateMessage(): string {
    if (this.hasActiveFilters()) {
      return 'Nu am găsit postări care să corespundă filtrelor selectate.';
    }
    return 'Nu există încă postări în blog. Creează prima postare!';
  }

  // Get empty state title
  getEmptyStateTitle(): string {
    if (this.hasActiveFilters()) {
      return 'Nu s-au găsit rezultate';
    }
    return 'Nu există postări';
  }

  // Check if should show create button in empty state
  shouldShowCreateInEmptyState(): boolean {
    return !this.hasActiveFilters();
  }
}
