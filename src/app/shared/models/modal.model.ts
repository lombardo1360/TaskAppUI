export interface ModalData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  confirmText?: string;
  cancelText?: string;
}

export interface ModalResult {
  confirmed: boolean;
  data?: any;
}
