import { Component, inject } from '@angular/core';
import { ToastService } from '../../../_services/toast-service';

@Component({
  selector: 'app-toast-container',
  imports: [],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
})
export class ToastContainer {
  toastService = inject(ToastService);

  remove(id: number) {
    this.toastService.remove(id);
  }
}
