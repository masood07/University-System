import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'danger' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private nextId = 1;

  show(type: ToastType, title: string, message: string, autoCloseMs = 3500) {
    const toast: ToastMessage = {
      id: this.nextId++,
      type,
      title,
      message,
    };

    this.toasts.update((list) => [...list, toast]);

    if (autoCloseMs > 0) {
      setTimeout(() => this.remove(toast.id), autoCloseMs);
    }
  }

  success(message: string, title = 'Success') {
    this.show('success', title, message);
  }

  error(message: string, title = 'Error') {
    this.show('danger', title, message, 4500);
  }

  info(message: string, title = 'Info') {
    this.show('info', title, message);
  }

  remove(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
