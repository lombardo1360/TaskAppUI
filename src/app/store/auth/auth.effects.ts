import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.error?.message || 'Error al iniciar sesión' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          this.authService.saveToken(response.token);
          this.authService.saveUser({ username: response.username, email: response.email });
        }),
        tap(() => {
          // Navegar en el siguiente tick para asegurar que localStorage se actualice
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 0);
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ data }) =>
        this.authService.register(data).pipe(
          map((response) => AuthActions.registerSuccess({ response })),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error.error?.message || 'Error al registrar usuario' }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ response }) => {
          this.authService.saveToken(response.token);
          this.authService.saveUser({ username: response.username, email: response.email });
        }),
        tap(() => {
          // Navegar en el siguiente tick para asegurar que localStorage se actualice
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 0);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }),
        map(() => AuthActions.logoutSuccess())
      )
  );
}
