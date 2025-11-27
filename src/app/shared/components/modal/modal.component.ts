import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { ModalData, ModalResult } from '../../models/modal.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private subscription?: Subscription;
  private callback?: (result: ModalResult) => void;

  isVisible = false;
  modalData: ModalData | null = null;

  ngOnInit(): void {
    this.subscription = this.modalService.modal$.subscribe(({ data, callback }) => {
      this.modalData = data;
      this.callback = callback;
      this.isVisible = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  confirm(): void {
    this.callback?.({ confirmed: true });
    this.close();
  }

  cancel(): void {
    this.callback?.({ confirmed: false });
    this.close();
  }

  close(): void {
    this.isVisible = false;
    this.modalData = null;
  }

  getIconClass(): string {
    switch (this.modalData?.type) {
      case 'success':
        return 'icon-success';
      case 'error':
        return 'icon-error';
      case 'warning':
        return 'icon-warning';
      case 'confirm':
        return 'icon-confirm';
      default:
        return 'icon-info';
    }
  }
}
