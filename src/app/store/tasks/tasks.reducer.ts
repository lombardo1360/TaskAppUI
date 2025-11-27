import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Task, TaskFilter } from '../../core/models/task.model';
import * as TaskActions from './tasks.actions';

export interface TasksState extends EntityState<Task> {
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
}

export const adapter: EntityAdapter<Task> = createEntityAdapter<Task>();

export const initialState: TasksState = adapter.getInitialState({
  loading: false,
  error: null,
  filter: 'all' as TaskFilter
});

export const tasksReducer = createReducer(
  initialState,
  // Load Tasks
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) =>
    adapter.setAll(tasks, { ...state, loading: false, error: null })
  ),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Create Task
  on(TaskActions.createTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.createTaskSuccess, (state, { task }) =>
    adapter.addOne(task, { ...state, loading: false, error: null })
  ),
  on(TaskActions.createTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Update Task
  on(TaskActions.updateTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.updateTaskSuccess, (state, { task }) =>
    adapter.updateOne({ id: task.id, changes: task }, { ...state, loading: false, error: null })
  ),
  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Delete Task
  on(TaskActions.deleteTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.deleteTaskSuccess, (state, { id }) =>
    adapter.removeOne(id, { ...state, loading: false, error: null })
  ),
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Toggle Task Status
  on(TaskActions.toggleTaskStatus, (state) => ({
    ...state,
    loading: true
  })),
  // Filter
  on(TaskActions.setTaskFilter, (state, { filter }) => ({
    ...state,
    filter
  }))
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
