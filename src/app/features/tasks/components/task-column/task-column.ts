import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../shared/models';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, DragDropModule],
  templateUrl: './task-column.html',
  styleUrl: './task-column.scss',
})
export class TaskColumn {
  @Input() title: string = '';
  @Input() tasks: Task[] = [];
  @Input() statusClass: string = ''; 
  @Input() listId: string = '';
  @Input() connectedLists: string[] = [];

  @Output() taskClick = new EventEmitter<Task>();
  @Output() taskDrop = new EventEmitter<CdkDragDrop<Task[]>>();
  @Output() addTask = new EventEmitter<void>();

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    this.taskDrop.emit(event);
  }
}
