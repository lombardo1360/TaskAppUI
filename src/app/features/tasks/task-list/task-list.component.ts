import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { 
  TaskActions,
  AuthActions,
  selectFilteredTasks, 
  selectTasksLoading, 
  selectTaskFilter,
  selectTaskStats,
  selectUser
} from '../../../store';
import { Task, Priority, TaskFilter, CreateTaskRequest } from '../../../core/models/task.model';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private modalService = inject(ModalService);
  private subscription = new Subscription();

  tasks$ = this.store.select(selectFilteredTasks);
  loading$ = this.store.select(selectTasksLoading);
  currentFilter$ = this.store.select(selectTaskFilter);
  taskStats$ = this.store.select(selectTaskStats);
  user$ = this.store.select(selectUser);

  taskForm!: FormGroup;
  showCreateForm = false;
  editingTask: Task | null = null;
  Priority = Priority;

  ngOnInit(): void {
    this.initForm();
    this.store.dispatch(TaskActions.loadTasks());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: [Priority.Medium, Validators.required],
      dueDate: [today]
    });
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  setFilter(filter: TaskFilter): void {
    this.store.dispatch(TaskActions.setTaskFilter({ filter }));
  }

  async onCheckboxClick(event: Event, task: Task): Promise<void> {
    event.preventDefault();
    
    const newStatus = !task.isCompleted;
    const message = newStatus 
      ? `¿Marcar "${task.title}" como completada?` 
      : `¿Marcar "${task.title}" como pendiente?`;
    
    const result = await this.modalService.showConfirm(message);
    
    if (result.confirmed) {
      this.store.dispatch(TaskActions.toggleTaskStatus({ task }));
      const successMessage = newStatus 
        ? 'Tarea marcada como completada' 
        : 'Tarea marcada como pendiente';
      this.modalService.showSuccess(successMessage);
    }
  }

  async toggleTaskStatus(task: Task): Promise<void> {
    const newStatus = !task.isCompleted;
    const message = newStatus 
      ? `¿Marcar "${task.title}" como completada?` 
      : `¿Marcar "${task.title}" como pendiente?`;
    
    const result = await this.modalService.showConfirm(message);
    
    if (result.confirmed) {
      this.store.dispatch(TaskActions.toggleTaskStatus({ task }));
      const successMessage = newStatus 
        ? 'Tarea marcada como completada' 
        : 'Tarea marcada como pendiente';
      this.modalService.showSuccess(successMessage);
    }
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.editingTask = null;
    this.initForm();
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.editingTask = null;
    this.initForm();
  }

  async onSubmit(): Promise<void> {
    if (this.taskForm.valid) {
      const taskData: CreateTaskRequest = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description || undefined,
        priority: this.taskForm.value.priority,
        dueDate: this.taskForm.value.dueDate || undefined
      };

      if (this.editingTask) {
        this.store.dispatch(TaskActions.updateTask({ 
          id: this.editingTask.id, 
          task: taskData 
        }));
        await this.modalService.showSuccess('Tarea actualizada exitosamente');
      } else {
        this.store.dispatch(TaskActions.createTask({ task: taskData }));
        await this.modalService.showSuccess('Tarea creada exitosamente');
      }

      this.closeForm();
    }
  }

  editTask(task: Task): void {
    this.editingTask = task;
    this.showCreateForm = true;
    
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
  }

  async deleteTask(task: Task): Promise<void> {
    const result = await this.modalService.showConfirm(
      `¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`,
      'Confirmar eliminación'
    );

    if (result.confirmed) {
      this.store.dispatch(TaskActions.deleteTask({ id: task.id }));
      await this.modalService.showSuccess('Tarea eliminada exitosamente');
    }
  }

  getPriorityClass(priority: Priority): string {
    switch (priority) {
      case Priority.High:
        return 'priority-high';
      case Priority.Medium:
        return 'priority-medium';
      case Priority.Low:
        return 'priority-low';
      default:
        return '';
    }
  }

  getPriorityLabel(priority: Priority): string {
    switch (priority) {
      case Priority.High:
        return 'Alta';
      case Priority.Medium:
        return 'Media';
      case Priority.Low:
        return 'Baja';
      default:
        return '';
    }
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.isCompleted) return false;
    return new Date(task.dueDate) < new Date();
  }
}
