import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ModalData, ModalResult } from '../models/modal.model';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new Subject<{ data: ModalData; callback: (result: ModalResult) => void }>();
  modal$ = this.modalSubject.asObservable();

  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();
  private toastId = 0;

  open(data: ModalData): Promise<ModalResult> {
    return new Promise((resolve) => {
      this.modalSubject.next({
        data,
        callback: (result: ModalResult) => resolve(result)
      });
    });
  }

  showSuccess(message: string, title?: string): void {
    this.toastSubject.next({
      id: this.toastId++,
      message,
      type: 'success'
    });
  }

  showError(message: string, title: string = 'Error'): Promise<ModalResult> {
    return this.open({
      title,
      message,
      type: 'error',
      confirmText: 'Aceptar'
    });
  }

  showConfirm(message: string, title: string = 'Confirmar'): Promise<ModalResult> {
    return this.open({
      title,
      message,
      type: 'confirm',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar'
    });
  }

  showInfo(message: string, title: string = 'Información'): Promise<ModalResult> {
    return this.open({
      title,
      message,
      type: 'info',
      confirmText: 'Aceptar'
    });
  }
}
