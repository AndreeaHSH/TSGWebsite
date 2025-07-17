// AdminDashboard/src/app/components/blog/blog-editor/blog-editor.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogService, BlogPostDetail, BlogPostCreate, BlogPostUpdate } from '../../../services/blog/blog.service';

interface ImageFile {
  file: File;
  preview: string;
  altText: string;
  id?: number;
  isPrimary: boolean;
}

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss']
})
export class BlogEditorComponent implements OnInit {
  // Mode detection
  isEditMode = signal(false);
  postId = signal<number | null>(null);

  // Form data
  formData = signal({
    title: '',
    slug: '',
    content: '',
    summary: '',
    author: 'TSG Admin',
    tags: '',
    isPublished: false
  });

  // Image handling
  images = signal<ImageFile[]>([]);
  maxImages = 5;
  dragOver = signal(false);

  // UI state
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  autoSaveEnabled = signal(true);
  lastSaved = signal<Date | null>(null);
  hasUnsavedChanges = signal(false);

  // Validation
  validationErrors = signal<{ [key: string]: string }>({});

  constructor(
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.postId.set(parseInt(id, 10));
      this.loadPost();
    } else {
      // Generate initial slug from title
      this.generateSlugFromTitle();
    }

    // Set up auto-save (every 30 seconds)
    if (this.autoSaveEnabled()) {
      setInterval(() => {
        if (this.hasUnsavedChanges() && this.isEditMode()) {
          this.autoSave();
        }
      }, 30000);
    }
  }

  async loadPost(): Promise<void> {
    const id = this.postId();
    if (!id) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const post = await this.blogService.getPost(id);

      this.formData.set({
        title: post.title,
        slug: post.slug,
        content: post.content,
        summary: post.summary,
        author: post.author,
        tags: post.tags,
        isPublished: post.isPublished
      });

      // Load existing images
      if (post.blogImages && post.blogImages.length > 0) {
        const imageFiles: ImageFile[] = post.blogImages.map((url, index) => ({
          file: new File([], ''), // Placeholder file for existing images
          preview: url,
          altText: `Image ${index + 1}`,
          id: index + 1, // Placeholder ID
          isPrimary: index === 0 // First image is primary
        }));
        this.images.set(imageFiles);
      }

      this.hasUnsavedChanges.set(false);
    } catch (error) {
      console.error('Error loading post:', error);
      this.error.set('Nu am putut încărca postarea. Vă rugăm să încercați din nou.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onTitleChange(): void {
    this.hasUnsavedChanges.set(true);
    if (!this.isEditMode()) {
      this.generateSlugFromTitle();
    }
    this.validateField('title');
  }

  onSlugChange(): void {
    this.hasUnsavedChanges.set(true);
    this.validateField('slug');
  }

  onContentChange(): void {
    this.hasUnsavedChanges.set(true);
    this.validateField('content');
  }

  onSummaryChange(): void {
    this.hasUnsavedChanges.set(true);
  }

  onAuthorChange(): void {
    this.hasUnsavedChanges.set(true);
  }

  onTagsChange(): void {
    this.hasUnsavedChanges.set(true);
  }

  generateSlugFromTitle(): void {
    const title = this.formData().title;
    if (title) {
      const slug = this.blogService.generateSlug(title);
      this.formData.update(data => ({ ...data, slug }));
    }
  }

  validateField(field: string): void {
    const errors = { ...this.validationErrors() };
    const data = this.formData();

    switch (field) {
      case 'title':
        if (!data.title.trim()) {
          errors[field] = 'Titlul este obligatoriu';
        } else if (data.title.length > 200) {
          errors[field] = 'Titlul nu poate avea mai mult de 200 de caractere';
        } else {
          delete errors[field];
        }
        break;

      case 'slug':
        if (!data.slug.trim()) {
          errors[field] = 'Slug-ul este obligatoriu';
        } else if (data.slug.length > 250) {
          errors[field] = 'Slug-ul nu poate avea mai mult de 250 de caractere';
        } else {
          delete errors[field];
        }
        break;

      case 'content':
        if (!data.content.trim()) {
          errors[field] = 'Conținutul este obligatoriu';
        } else {
          delete errors[field];
        }
        break;
    }

    this.validationErrors.set(errors);
  }

  validateForm(): boolean {
    this.validateField('title');
    this.validateField('slug');
    this.validateField('content');

    return Object.keys(this.validationErrors()).length === 0;
  }

  // Image handling methods
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);

    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  handleFiles(files: File[]): void {
    const currentImages = this.images();
    const remainingSlots = this.maxImages - currentImages.length;

    if (files.length > remainingSlots) {
      this.error.set(`Poți adăuga maxim ${remainingSlots} imagini în plus. Total maxim: ${this.maxImages} imagini.`);
      return;
    }

    // Validate files
    const validation = this.blogService.validateMultipleImages(files);
    if (!validation.isValid) {
      this.error.set(validation.errors.join('\n'));
      return;
    }

    // Process files
    const newImages: ImageFile[] = [];
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        newImages.push({
          file,
          preview,
          altText: `${file.name}`,
          isPrimary: currentImages.length === 0 && index === 0 // First image of empty list is primary
        });

        // Update images when all files are processed
        if (newImages.length === files.length) {
          this.images.update(current => [...current, ...newImages]);
          this.hasUnsavedChanges.set(true);
          this.error.set(null);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    const currentImages = this.images();
    const removedImage = currentImages[index];

    // If removing primary image, make next image primary
    if (removedImage.isPrimary && currentImages.length > 1) {
      const nextIndex = index === 0 ? 1 : 0;
      currentImages[nextIndex].isPrimary = true;
    }

    currentImages.splice(index, 1);
    this.images.set([...currentImages]);
    this.hasUnsavedChanges.set(true);
  }

  setPrimaryImage(index: number): void {
    const currentImages = this.images();
    currentImages.forEach((img, i) => {
      img.isPrimary = i === index;
    });
    this.images.set([...currentImages]);
    this.hasUnsavedChanges.set(true);
  }

  updateImageAltText(index: number, altText: string): void {
    const currentImages = this.images();
    currentImages[index].altText = altText;
    this.images.set([...currentImages]);
    this.hasUnsavedChanges.set(true);
  }

  // Drag and drop reordering
  onImageDragStart(event: DragEvent, index: number): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', index.toString());
    }
  }

  onImageDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onImageDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    const dragIndex = parseInt(event.dataTransfer?.getData('text/plain') || '-1');

    if (dragIndex !== -1 && dragIndex !== dropIndex) {
      const currentImages = this.images();
      const draggedImage = currentImages[dragIndex];

      // Remove from old position
      currentImages.splice(dragIndex, 1);

      // Insert at new position
      const adjustedDropIndex = dragIndex < dropIndex ? dropIndex - 1 : dropIndex;
      currentImages.splice(adjustedDropIndex, 0, draggedImage);

      this.images.set([...currentImages]);
      this.hasUnsavedChanges.set(true);
    }
  }

  // Save methods
  async saveDraft(): Promise<void> {
    await this.save(false);
  }

  async saveAndPublish(): Promise<void> {
    await this.save(true);
  }

  async save(publish: boolean): Promise<void> {
    if (!this.validateForm()) {
      this.error.set('Vă rugăm să corectați erorile din formular.');
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    try {
      const data = this.formData();
      const images = this.images();

      if (this.isEditMode()) {
        const updateData: BlogPostUpdate = {
          ...data,
          isPublished: publish,
          blogImageFiles: images.filter(img => img.file.size > 0).map(img => img.file),
          imageAltTexts: images.filter(img => img.file.size > 0).map(img => img.altText)
        };

        // Set primary image if we have images
        const primaryImage = images.find(img => img.isPrimary);
        if (primaryImage && primaryImage.file.size > 0) {
          updateData.featuredImageFile = primaryImage.file;
        }

        await this.blogService.updatePost(this.postId()!, updateData);
      } else {
        const createData: BlogPostCreate = {
          ...data,
          isPublished: publish,
          blogImageFiles: images.map(img => img.file),
          imageAltTexts: images.map(img => img.altText)
        };

        // Set primary image if we have images
        const primaryImage = images.find(img => img.isPrimary);
        if (primaryImage) {
          createData.featuredImageFile = primaryImage.file;
        }

        const result = await this.blogService.createPost(createData);

        // Switch to edit mode after creation
        this.isEditMode.set(true);
        this.postId.set(result.id);
        // Use Location service instead of router.replaceState
        window.history.replaceState(null, '', `/blog/edit/${result.id}`);
      }

      this.hasUnsavedChanges.set(false);
      this.lastSaved.set(new Date());

      // Navigate back to list after successful save
      this.router.navigate(['/blog']);

    } catch (error) {
      console.error('Error saving post:', error);
      this.error.set('Nu am putut salva postarea. Vă rugăm să încercați din nou.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async autoSave(): Promise<void> {
    if (!this.validateForm() || this.isSaving()) return;

    try {
      const data = this.formData();
      const updateData: BlogPostUpdate = { ...data };

      await this.blogService.updatePost(this.postId()!, updateData);
      this.hasUnsavedChanges.set(false);
      this.lastSaved.set(new Date());
    } catch (error) {
      console.warn('Auto-save failed:', error);
    }
  }

  cancel(): void {
    if (this.hasUnsavedChanges()) {
      if (confirm('Ai modificări nesalvate. Ești sigur că vrei să ieși?')) {
        this.router.navigate(['/blog']);
      }
    } else {
      this.router.navigate(['/blog']);
    }
  }

  // TrackBy function for images
  trackByImage(index: number, item: ImageFile): string {
    return item.preview;
  }

  // TrackBy function for tags
  trackByTag(index: number, item: string): string {
    return item;
  }

  // Utility methods
  getReadingTime(): number {
    return this.blogService.calculateReadingTime(this.formData().content);
  }

  getWordCount(): number {
    return this.formData().content.split(/\s+/).filter(word => word.length > 0).length;
  }

  getCharacterCount(): number {
    return this.formData().content.length;
  }

  getTags(): string[] {
    return this.blogService.parseTags(this.formData().tags);
  }

  getLastSavedText(): string {
    const lastSaved = this.lastSaved();
    if (!lastSaved) return '';

    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Salvat acum';
    if (diffMins === 1) return 'Salvat acum 1 minut';
    if (diffMins < 60) return `Salvat acum ${diffMins} minute`;

    return `Salvat la ${lastSaved.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}`;
  }

  getImageCountText(): string {
    const count = this.images().length;
    return `${count}/${this.maxImages} imagini`;
  }
}
