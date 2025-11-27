import { createReducer, on } from '@ngrx/store';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: { username: string; email: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    user: { username: response.username, email: response.email },
    token: response.token,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.registerSuccess, (state, { response }) => ({
    ...state,
    user: { username: response.username, email: response.email },
    token: response.token,
    loading: false,
    error: null
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true
  })),
  on(AuthActions.logoutSuccess, () => initialState),
  // Init
  on(AuthActions.initAuth, (state) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      return {
        ...state,
        user,
        token
      };
    }
    return state;
  })
);
