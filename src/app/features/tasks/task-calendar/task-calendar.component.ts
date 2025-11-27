import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TaskActions, selectAllTasks } from '../../../store';
import { Task, Priority } from '../../../core/models/task.model';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-task-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.css']
})
export class TaskCalendarComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private subscription = new Subscription();

  currentDate = new Date();
  calendarDays: CalendarDay[] = [];
  selectedDay: CalendarDay | null = null;
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  allTasks: Task[] = [];

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());

    this.subscription.add(
      this.store.select(selectAllTasks).subscribe(tasks => {
        this.allTasks = tasks;
        this.generateCalendar();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayIndex = firstDay.getDay();
    const lastDateOfMonth = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();
    
    this.calendarDays = [];
    
    // Previous month days
    for (let i = firstDayIndex; i > 0; i--) {
      const date = new Date(year, month - 1, prevLastDate - i + 1);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        tasks: this.getTasksForDate(date)
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const date = new Date(year, month, i);
      this.calendarDays.push({
        date,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        tasks: this.getTasksForDate(date)
      });
    }
    
    // Next month days
    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        tasks: this.getTasksForDate(date)
      });
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  getTasksForDate(date: Date): Task[] {
    return this.allTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  today(): void {
    this.currentDate = new Date();
    this.generateCalendar();
  }

  selectDay(day: CalendarDay): void {
    this.selectedDay = day;
  }

  getPriorityIcon(priority: Priority): string {
    switch (priority) {
      case Priority.High: return '🔴';
      case Priority.Medium: return '🟡';
      case Priority.Low: return '🟢';
      default: return '⚪';
    }
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.isCompleted) return false;
    return new Date(task.dueDate) < new Date();
  }

  getMonthName(): string {
    return this.currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }

  goToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  goToSummary(): void {
    this.router.navigate(['/tasks/summary']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  trackByDate(index: number, day: CalendarDay): string {
    return day.date.toISOString();
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}
