import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthActions, selectAuthLoading, selectAuthError } from '../../../store';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private modalService = inject(ModalService);
  private subscription = new Subscription();

  loginForm!: FormGroup;
  loading$ = this.store.select(selectAuthLoading);
  isRegisterMode = false;

  ngOnInit(): void {
    this.initForm();
    
    this.subscription.add(
      this.store.select(selectAuthError).subscribe(error => {
        if (error) {
          this.modalService.showError(error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    if (this.isRegisterMode) {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    } else {
      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
    }
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.initForm();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      if (this.isRegisterMode) {
        this.store.dispatch(AuthActions.register({ data: this.loginForm.value }));
      } else {
        this.store.dispatch(AuthActions.login({ credentials: this.loginForm.value }));
      }
    } else {
      this.modalService.showError('Por favor, completa todos los campos correctamente');
    }
  }

  get usernameError(): string {
    const control = this.loginForm.get('username');
    if (control?.hasError('required')) return 'El usuario es requerido';
    if (control?.hasError('minlength')) return 'Mínimo 3 caracteres';
    return '';
  }

  get emailError(): string {
    const control = this.loginForm.get('email');
    if (control?.hasError('required')) return 'El email es requerido';
    if (control?.hasError('email')) return 'Email inválido';
    return '';
  }

  get passwordError(): string {
    const control = this.loginForm.get('password');
    if (control?.hasError('required')) return 'La contraseña es requerida';
    if (control?.hasError('minlength')) return 'Mínimo 6 caracteres';
    return '';
  }
}
