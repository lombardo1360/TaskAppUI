import { tasksReducer, initialState } from './tasks.reducer';
import * as TaskActions from './tasks.actions';
import { Task, Priority } from '../../core/models/task.model';

describe('Tasks Reducer', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    isCompleted: false,
    priority: Priority.Medium,
    dueDate: '2025-12-31',
    createdAt: '2025-11-26',
    updatedAt: '2025-11-26'
  };

  it('should return the initial state', () => {
    const action = { type: 'Unknown' };
    const state = tasksReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it('should set loading to true on loadTasks', () => {
    const action = TaskActions.loadTasks();
    const state = tasksReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should load tasks successfully', () => {
    const tasks = [mockTask];
    const action = TaskActions.loadTasksSuccess({ tasks });
    const state = tasksReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ids.length).toBe(1);
    expect(state.entities[1]).toEqual(mockTask);
  });

  it('should handle load tasks failure', () => {
    const error = 'Error loading tasks';
    const action = TaskActions.loadTasksFailure({ error });
    const state = tasksReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('should create task successfully', () => {
    const action = TaskActions.createTaskSuccess({ task: mockTask });
    const state = tasksReducer(initialState, action);

    expect(state.ids).toContain(mockTask.id);
    expect(state.entities[mockTask.id]).toEqual(mockTask);
  });

  it('should update task successfully', () => {
    const loadAction = TaskActions.loadTasksSuccess({ tasks: [mockTask] });
    let state = tasksReducer(initialState, loadAction);

    const updatedTask = { ...mockTask, isCompleted: true };
    const updateAction = TaskActions.updateTaskSuccess({ task: updatedTask });
    state = tasksReducer(state, updateAction);

    expect(state.entities[mockTask.id]?.isCompleted).toBe(true);
  });

  it('should delete task successfully', () => {
    const loadAction = TaskActions.loadTasksSuccess({ tasks: [mockTask] });
    let state = tasksReducer(initialState, loadAction);

    const deleteAction = TaskActions.deleteTaskSuccess({ id: mockTask.id });
    state = tasksReducer(state, deleteAction);

    expect(state.ids).not.toContain(mockTask.id);
    expect(state.entities[mockTask.id]).toBeUndefined();
  });

  it('should set filter', () => {
    const action = TaskActions.setTaskFilter({ filter: 'completed' });
    const state = tasksReducer(initialState, action);

    expect(state.filter).toBe('completed');
  });
});
