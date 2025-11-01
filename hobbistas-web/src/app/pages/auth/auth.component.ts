import { Component, signal, inject, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@hobbistas/data-access';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // State
  activeTab = signal<'login' | 'signup'>('login');
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  isDev = signal(isDevMode());

  // Forms
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor() {
    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Initialize signup form
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  /**
   * Switch tabs
   */
  setTab(tab: 'login' | 'signup'): void {
    this.activeTab.set(tab);
    this.errorMessage.set(null);
    this.loginForm.reset();
    this.signupForm.reset();
  }

  /**
   * Handle login
   */
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        console.log('✅ Login successful, redirecting...');
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Αποτυχία σύνδεσης. Ελέγξτε τα στοιχεία σας.',
        );
      },
    });
  }

  /**
   * Handle signup
   */
  onSignup(): void {
    if (this.signupForm.invalid) {
      this.markFormGroupTouched(this.signupForm);
      return;
    }

    // Check if passwords match
    const password = this.signupForm.value.password;
    const confirmPassword = this.signupForm.value.confirmPassword;

    if (password !== confirmPassword) {
      this.errorMessage.set('Οι κωδικοί δεν ταιριάζουν');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const registerData = {
      email: this.signupForm.value.email,
      username: this.signupForm.value.username,
      displayName: this.signupForm.value.displayName,
      password: this.signupForm.value.password,
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        console.log('✅ Signup successful, redirecting...');
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('❌ Signup error:', err);
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message ||
            'Αποτυχία εγγραφής. Δοκιμάστε με διαφορετικό email ή username.',
        );
      },
    });
  }

  /**
   * Dev auto-login with test credentials
   * Only available in development mode
   */
  devLogin(): void {
    if (!isDevMode()) {
      console.warn('Dev login is only available in development mode');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    // Test credentials - make sure these exist in your database
    const testCredentials = {
      email: 'test@hobbistas.com',
      password: 'Test123!',
    };

    console.log('🔧 DEV: Auto-logging in with test credentials...');

    this.authService.login(testCredentials).subscribe({
      next: () => {
        console.log('✅ DEV: Auto-login successful');
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('❌ DEV: Auto-login failed:', err);
        this.loading.set(false);
        this.errorMessage.set(
          'Dev auto-login failed. Make sure test user exists (test@hobbistas.com)',
        );
      },
    });
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    for (const key of Object.keys(formGroup.controls)) {
      const control = formGroup.get(key);
      control?.markAsTouched();
    }
  }

  /**
   * Get error message for a form field
   */
  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);

    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Αυτό το πεδίο είναι υποχρεωτικό';
    }

    if (control.errors['email']) {
      return 'Μη έγκυρη διεύθυνση email';
    }

    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Πρέπει να έχει τουλάχιστον ${minLength} χαρακτήρες`;
    }

    return '';
  }
}
