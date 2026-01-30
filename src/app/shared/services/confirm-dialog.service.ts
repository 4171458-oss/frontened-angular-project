import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private isOpen = signal(false);
  private dialogData = signal<ConfirmDialogData | null>(null);
  private resultSubject = new Subject<boolean>();

  readonly isOpen$ = this.isOpen.asReadonly();
  readonly dialogData$ = this.dialogData.asReadonly();

  confirm(data: ConfirmDialogData): Observable<boolean> {
    this.dialogData.set({
      ...data,
      confirmText: data.confirmText || 'Confirm',
      cancelText: data.cancelText || 'Cancel',
      type: data.type || 'danger',
    });
    this.isOpen.set(true);
    return this.resultSubject.asObservable();
  }

  close(result: boolean) {
    this.isOpen.set(false);
    this.resultSubject.next(result);
    this.dialogData.set(null);
  }
}
