import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { tasksReducer, TasksState } from './tasks/tasks.reducer';

export interface AppState {
  auth: AuthState;
  tasks: TasksState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  tasks: tasksReducer
};

// Re-export everything for easier imports
export * as AuthActions from './auth/auth.actions';
export * as TaskActions from './tasks/tasks.actions';
export * from './auth/auth.selectors';
export * from './tasks/tasks.selectors';
