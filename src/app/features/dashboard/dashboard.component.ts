import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthActions, TaskActions, selectUser, selectTaskStats } from '../../store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  user$ = this.store.select(selectUser);
  taskStats$ = this.store.select(selectTaskStats);

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  goToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  goToSummary(): void {
    this.router.navigate(['/tasks/summary']);
  }

  goToCalendar(): void {
    this.router.navigate(['/tasks/calendar']);
  }

  getCompletionPercentage(completed: number, total: number): number {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}
