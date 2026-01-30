import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Comment } from '../../../../shared/models/comment.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [CommonModule, DatePipe, MatIconModule],
  templateUrl: './comment-item.html',
  styleUrl: './comment-item.scss',
})
export class CommentItem {
  @Input({ required: true }) comment!: Comment;
}
