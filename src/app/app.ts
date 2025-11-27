import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ModalComponent } from './shared/components/modal/modal.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthActions } from './store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private store = inject(Store);
  protected readonly title = signal('TodoAppFrontend');
  protected readonly currentYear = signal(new Date().getFullYear());

  ngOnInit(): void {
    // Initialize auth state from localStorage
    this.store.dispatch(AuthActions.initAuth());
  }
}
