import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  private confirmService = inject(ConfirmDialogService);
  
  isOpen = this.confirmService.isOpen$;
  data = this.confirmService.dialogData$;

  confirm() {
    this.confirmService.close(true);
  }

  cancel() {
    this.confirmService.close(false);
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      danger: 'warning',
      warning: 'error_outline',
      info: 'info',
    };
    return icons[type] || 'help_outline';
  }
}
