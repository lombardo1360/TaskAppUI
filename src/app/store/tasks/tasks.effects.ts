import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import * as TaskActions from './tasks.actions';
import { TaskService } from '../../core/services/task.service';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      exhaustMap(() =>
        this.taskService.getAllTasks().pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
          catchError((error) =>
            of(TaskActions.loadTasksFailure({ error: error.error?.message || 'Error al cargar tareas' }))
          )
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      exhaustMap(({ task }) =>
        this.taskService.createTask(task).pipe(
          map((task) => TaskActions.createTaskSuccess({ task })),
          catchError((error) =>
            of(TaskActions.createTaskFailure({ error: error.error?.message || 'Error al crear tarea' }))
          )
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      exhaustMap(({ id, task }) =>
        this.taskService.updateTask(id, task).pipe(
          map((task) => TaskActions.updateTaskSuccess({ task })),
          catchError((error) =>
            of(TaskActions.updateTaskFailure({ error: error.error?.message || 'Error al actualizar tarea' }))
          )
        )
      )
    )
  );

  toggleTaskStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.toggleTaskStatus),
      mergeMap(({ task }) => {
        const updatedTask = {
          title: task.title,
          description: task.description,
          isCompleted: !task.isCompleted,
          priority: task.priority,
          dueDate: task.dueDate
        };
        return this.taskService.updateTask(task.id, updatedTask).pipe(
          map((task) => TaskActions.updateTaskSuccess({ task })),
          catchError((error) =>
            of(TaskActions.updateTaskFailure({ error: error.error?.message || 'Error al actualizar tarea' }))
          )
        );
      })
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      exhaustMap(({ id }) =>
        this.taskService.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError((error) =>
            of(TaskActions.deleteTaskFailure({ error: error.error?.message || 'Error al eliminar tarea' }))
          )
        )
      )
    )
  );
}
