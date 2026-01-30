import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/services/api-client';
import { Comment } from '../../../shared/models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly api = inject(ApiClient);

  getComments(taskId: number): Observable<Comment[]> {
    return this.api.get<Comment[]>('comments', { 
      params: { taskId: taskId.toString() } 
    });
  }

  createComment(payload: { taskId: number; body: string }): Observable<Comment> {
    return this.api.post<Comment>('comments', payload);
  }
}
