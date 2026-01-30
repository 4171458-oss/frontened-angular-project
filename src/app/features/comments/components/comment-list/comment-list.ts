import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsService } from '../../services/comments';
import { Comment } from '../../../../shared/models/comment.model';
import { CommentItem } from '../comment-item/comment-item';
import { CommentForm } from '../comment-form/comment-form';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, CommentItem, CommentForm],
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.scss',
})
export class CommentList implements OnInit {
  @Input({ required: true }) taskId!: number;
  
  private commentsService = inject(CommentsService);
  comments = signal<Comment[]>([]);
  isLoading = signal<boolean>(false);
  isCreating = signal<boolean>(false);

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.isLoading.set(true);
    this.commentsService.getComments(this.taskId).subscribe({
      next: (data) => {
        this.comments.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onCommentSubmit(body: string) {
    this.isCreating.set(true);
    this.commentsService.createComment({ taskId: this.taskId, body }).subscribe({
      next: (newComment) => {
        this.comments.update(list => [...list, newComment]);
        this.isCreating.set(false);
      },
      error: () => {
        this.isCreating.set(false);
        alert('Failed to post comment');
      }
    });
  }
}
