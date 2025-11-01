import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './placeholder.html',
  styleUrl: './placeholder.scss',
})
export class PlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly dataSig = toSignal(this.route.data, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialValue: {} as any,
  });
  private readonly metaSig = computed(
    () => this.dataSig()?.['meta'] ?? this.dataSig(),
  );

  readonly title = computed(() => this.metaSig()?.title ?? 'Σελίδα');
  readonly category = computed(() => this.metaSig()?.category);

  readonly rest = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('rest'))),
    { initialValue: null },
  );
}
