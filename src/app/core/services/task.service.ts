import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/Task`);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/Task/${id}`);
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/Task`, task);
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/Task/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Task/${id}`);
  }
}
