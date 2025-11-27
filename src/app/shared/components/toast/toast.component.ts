import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService, ToastMessage } from '../../services/modal.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" role="region" aria-live="polite" aria-atomic="true">
      <div *ngFor="let toast of toasts" 
           class="toast" 
           [class]="'toast-' + toast.type">
        <div class="toast-content">
          <svg *ngIf="toast.type === 'success'" class="toast-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M16.25 5L7.5 13.75L3.75 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg *ngIf="toast.type === 'error'" class="toast-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg *ngIf="toast.type === 'warning'" class="toast-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10 6V11M10 14H10.01M4 17H16L10 3L4 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg *ngIf="toast.type === 'info'" class="toast-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M10 9V14M10 6H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" 
                  (click)="removeToast(toast.id)" 
                  aria-label="Cerrar notificación">
            ×
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: var(--spacing-lg);
      right: var(--spacing-lg);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      pointer-events: none;
    }

    .toast {
      min-width: 300px;
      padding: var(--spacing-md);
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      pointer-events: all;
      animation: slideInRight 0.3s ease-out;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast.fade-out {
      animation: fadeOut 0.3s ease-out forwards;
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
        transform: translateX(20px);
      }
    }

    .toast-success {
      border-left: 4px solid var(--color-success);
    }

    .toast-error {
      border-left: 4px solid var(--color-danger);
    }

    .toast-warning {
      border-left: 4px solid var(--color-warning);
    }

    .toast-info {
      border-left: 4px solid var(--color-primary);
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .toast-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .toast-success .toast-icon {
      color: var(--color-success);
    }

    .toast-error .toast-icon {
      color: var(--color-danger);
    }

    .toast-warning .toast-icon {
      color: var(--color-warning);
    }

    .toast-info .toast-icon {
      color: var(--color-primary);
    }

    .toast-message {
      flex: 1;
      color: var(--color-text-primary);
      font-size: 0.875rem;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }

    .toast-close:hover {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation: none;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription?: Subscription;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.subscription = this.modalService.toast$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => this.removeToast(toast.id), 3000);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  removeToast(id: number) {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      const element = document.querySelectorAll('.toast')[index];
      element?.classList.add('fade-out');
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 300);
    }
  }
}
