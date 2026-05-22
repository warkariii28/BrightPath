import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type HeaderSection = 'dashboard' | 'students' | 'courses' | 'enrollments';

@Component({
  selector: 'app-page-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './page-header.html'
})
export class PageHeaderComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly statusLabel = input.required<string>();
  readonly statusTitle = input.required<string>();
  readonly statusDescription = input.required<string>();
  readonly activeSection = input.required<HeaderSection>();
  readonly showAdminAction = input(false);
  readonly primaryActionLabel = input('');
  readonly primaryActionLink = input<string | unknown[]>('');
}
