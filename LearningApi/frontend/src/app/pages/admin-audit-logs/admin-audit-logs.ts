import { DatePipe } from '@angular/common';
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdminAuditLog } from '../../core/models/admin-audit-logs';
import { AdminAuditLogService } from '../../core/services/admin-audit-log.service';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { SkeletonTableComponent } from '../../core/components/skeleton-table/skeleton-table';

@Component({
  selector: 'app-admin-audit-logs',
  imports: [DatePipe, PageHeaderComponent, SkeletonTableComponent],
  templateUrl: './admin-audit-logs.html',
})
export class AdminAuditLogs implements OnInit {
  readonly logs = signal<AdminAuditLog[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  private readonly auditService = inject(AdminAuditLogService);
  readonly totalCount = toSignal(this.auditService.totalCount$, { initialValue: 0 });
  readonly query = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));
  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading.set(true);
    this.error.set('');

    this.auditService.fetchLogs(this.page(), this.pageSize(), this.query()).subscribe({
      next: (logs) => {
        this.logs.set(logs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load audit logs.');
        this.loading.set(false);
      },
    });
  }
  setQuery(value: string): void {
    this.query.set(value);
    this.page.set(1);
    this.loadLogs();
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadLogs();
    }
  }

  prevPage(): void {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadLogs();
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber !== this.page() && pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.page.set(pageNumber);
      this.loadLogs();
    }
  }
}
