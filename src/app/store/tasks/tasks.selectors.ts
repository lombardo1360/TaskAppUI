import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState, selectAll } from './tasks.reducer';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectAllTasks = createSelector(selectTasksState, selectAll);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (state) => state.loading
);

export const selectTasksError = createSelector(
  selectTasksState,
  (state) => state.error
);

export const selectTaskFilter = createSelector(
  selectTasksState,
  (state) => state.filter
);

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectTaskFilter,
  (tasks, filter) => {
    switch (filter) {
      case 'completed':
        return tasks.filter((task) => task.isCompleted);
      case 'pending':
        return tasks.filter((task) => !task.isCompleted);
      default:
        return tasks;
    }
  }
);

export const selectTaskStats = createSelector(selectAllTasks, (tasks) => ({
  total: tasks.length,
  completed: tasks.filter((task) => task.isCompleted).length,
  pending: tasks.filter((task) => !task.isCompleted).length
}));
