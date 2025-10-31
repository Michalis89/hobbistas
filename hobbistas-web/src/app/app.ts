import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '@hobbistas/data-access';

import { HeaderComponent } from '@hobbistas/ui';

@Component({
  imports: [RouterModule, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly api = inject(ApiService);
  last?: unknown;

  ping() {
    this.api.ping().subscribe({
      next: (res) => (this.last = res),
      error: (e) => (this.last = e),
    });
  }
}
