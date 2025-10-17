import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  ping(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>('/api');
  }
}
