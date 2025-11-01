import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@hobbistas/data-access';
import { UpdateProfileData } from '@hobbistas/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-base-200 py-12">
      <div class="container mx-auto px-4 max-w-4xl">
        <h1 class="text-4xl font-bold mb-8">⚙️ Ρυθμίσεις</h1>

        <!-- Avatar Settings -->
        <div class="card bg-base-100 shadow-lg mb-6">
          <div class="card-body">
            <h2 class="card-title">Φωτογραφία Προφίλ</h2>
            <div class="flex items-center gap-6">
              <div class="avatar">
                <div
                  class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
                >
                  <img
                    [src]="
                      avatarPreview() ||
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                    "
                    alt="Avatar preview"
                  />
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm opacity-70 mb-2">
                  Επίλεξε μια εικόνα μέχρι 5MB (JPG, PNG, GIF)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  (change)="onAvatarSelected($event)"
                  class="file-input file-input-bordered file-input-primary w-full max-w-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Settings -->
        <div class="card bg-base-100 shadow-lg mb-6">
          <div class="card-body">
            <h2 class="card-title">Προφίλ</h2>
            <div class="form-control">
              <label class="label"
                ><span class="label-text">Όνομα Χρήστη</span></label
              >
              <input
                type="text"
                [(ngModel)]="settings.username"
                class="input input-bordered"
              />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Email</span></label>
              <input
                type="email"
                [(ngModel)]="settings.email"
                class="input input-bordered"
              />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Bio</span></label>
              <textarea
                [(ngModel)]="settings.bio"
                class="textarea textarea-bordered h-24"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Theme Settings -->
        <div class="card bg-base-100 shadow-lg mb-6">
          <div class="card-body">
            <h2 class="card-title">Εμφάνιση</h2>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Core Theme</span>
                <input
                  type="radio"
                  name="theme"
                  value="core"
                  [(ngModel)]="settings.theme"
                  class="radio radio-primary"
                />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Gaming Theme (Dark)</span>
                <input
                  type="radio"
                  name="theme"
                  value="gaming"
                  [(ngModel)]="settings.theme"
                  class="radio radio-primary"
                />
              </label>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="card bg-base-100 shadow-lg mb-6">
          <div class="card-body">
            <h2 class="card-title">Ειδοποιήσεις</h2>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Email για νέα σχόλια</span>
                <input
                  type="checkbox"
                  [(ngModel)]="settings.notifications.comments"
                  class="toggle toggle-primary"
                />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Email για νέους followers</span>
                <input
                  type="checkbox"
                  [(ngModel)]="settings.notifications.followers"
                  class="toggle toggle-primary"
                />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Newsletter</span>
                <input
                  type="checkbox"
                  [(ngModel)]="settings.notifications.newsletter"
                  class="toggle toggle-primary"
                />
              </label>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="card bg-base-100 shadow-lg mb-6">
          <div class="card-body">
            <h2 class="card-title">Απόρρητο</h2>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Δημόσιο προφίλ</span>
                <input
                  type="checkbox"
                  [(ngModel)]="settings.privacy.publicProfile"
                  class="toggle toggle-primary"
                />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Εμφάνιση email</span>
                <input
                  type="checkbox"
                  [(ngModel)]="settings.privacy.showEmail"
                  class="toggle toggle-primary"
                />
              </label>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex gap-4">
          <button
            class="btn btn-primary"
            (click)="saveSettings()"
            [disabled]="isSaving()"
          >
            @if (isSaving()) {
              <span class="loading loading-spinner loading-sm"></span>
              Αποθήκευση...
            } @else {
              💾 Αποθήκευση
            }
          </button>
          <button
            class="btn btn-outline"
            (click)="resetSettings()"
            [disabled]="isSaving()"
          >
            Επαναφορά
          </button>
        </div>

        <!-- Danger Zone -->
        <div class="card bg-error text-error-content shadow-lg mt-12">
          <div class="card-body">
            <h2 class="card-title">⚠️ Επικίνδυνη Ζώνη</h2>
            <p>Μόνιμη διαγραφή λογαριασμού και όλων των δεδομένων σου.</p>
            <button
              class="btn btn-error btn-outline w-fit"
              (click)="deleteAccount()"
            >
              Διαγραφή Λογαριασμού
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Account Modal -->
      @if (showDeleteModal()) {
        <div class="modal modal-open">
          <div class="modal-box">
            <h3 class="font-bold text-lg text-error">
              ⚠️ Διαγραφή Λογαριασμού
            </h3>
            <p class="py-4">
              Αυτή η ενέργεια είναι <strong>μόνιμη</strong> και δεν μπορεί να
              αναιρεθεί. Όλα τα δεδομένα σου, τα άρθρα, και οι αλληλεπιδράσεις
              σου θα διαγραφούν οριστικά.
            </p>
            <div class="form-control">
              <label class="label" for="deleteConfirm">
                <span class="label-text"
                  >Γράψε <strong>DELETE</strong> για επιβεβαίωση:</span
                >
              </label>
              <input
                id="deleteConfirm"
                type="text"
                [(ngModel)]="deleteConfirmText"
                placeholder="DELETE"
                class="input input-bordered"
                (keyup.enter)="confirmDelete()"
              />
            </div>
            <div class="modal-action">
              <button class="btn btn-ghost" (click)="cancelDelete()">
                Ακύρωση
              </button>
              <button
                class="btn btn-error"
                (click)="confirmDelete()"
                [disabled]="deleteConfirmText() !== 'DELETE'"
              >
                Οριστική Διαγραφή
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);

  // Get current user
  currentUser = this.authService.currentUser;

  settings = {
    username: '',
    email: '',
    bio: 'Passionate gamer και developer',
    theme: 'core',
    notifications: { comments: true, followers: true, newsletter: false },
    privacy: { publicProfile: true, showEmail: false },
  };

  // Avatar preview
  avatarPreview = signal<string | null>(null);
  selectedAvatarFile: File | null = null;

  // Loading state
  isSaving = signal(false);

  ngOnInit(): void {
    // Load user data into settings
    if (this.currentUser()) {
      this.settings.username = this.currentUser()!.displayName;
      this.settings.email = this.currentUser()!.email;
      // Set initial avatar preview
      if (this.currentUser()!.avatarUrl) {
        this.avatarPreview.set(this.currentUser()!.avatarUrl || null);
      }
    }
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Παρακαλώ επίλεξε μια εικόna');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Η εικόνα πρέπει να είναι μικρότερη από 5MB');
        return;
      }

      this.selectedAvatarFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  saveSettings() {
    this.isSaving.set(true);

    const profileData: UpdateProfileData = {
      displayName: this.settings.username,
      bio: this.settings.bio,
    };

    console.log('🔄 Saving profile...', {
      profileData,
      hasAvatar: !!this.selectedAvatarFile,
      avatarSize: this.selectedAvatarFile?.size,
    });

    this.authService
      .updateProfile(profileData, this.selectedAvatarFile || undefined)
      .subscribe({
        next: (updatedUser) => {
          console.log('✅ Profile updated successfully', updatedUser);
          this.isSaving.set(false);
          alert('Οι ρυθμίσεις αποθηκεύτηκαν!');
          // Clear selected file after successful upload
          this.selectedAvatarFile = null;
        },
        error: (error) => {
          console.error('❌ Failed to update profile - Full error:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error details:', error.error);
          this.isSaving.set(false);

          let errorMessage = 'Σφάλμα κατά την αποθήκευση των ρυθμίσεων.';
          if (error.status === 413) {
            errorMessage =
              'Η εικόνα είναι πολύ μεγάλη. Δοκίμασε μια μικρότερη εικόνα.';
          } else if (error.error?.message) {
            errorMessage = `Σφάλμα: ${error.error.message}`;
          }

          alert(errorMessage + ' Δοκίμασε ξανά.');
        },
      });
  }

  resetSettings() {
    if (confirm('Επαναφορά στις προεπιλεγμένες ρυθμίσεις;')) {
      // Reset logic
    }
  }

  showDeleteModal = signal(false);
  deleteConfirmText = signal('');

  deleteAccount() {
    this.showDeleteModal.set(true);
  }

  confirmDelete() {
    if (this.deleteConfirmText() !== 'DELETE') {
      alert('Παρακαλώ γράψε "DELETE" για επιβεβαίωση');
      return;
    }

    // TODO: Implement actual delete account API call
    console.log('🗑️ Account deletion requested');
    this.showDeleteModal.set(false);
    this.deleteConfirmText.set('');

    alert(
      '⚠️ Η διαγραφή λογαριασμού θα υλοποιηθεί σύντομα.\nΓια τώρα αυτό είναι ένα placeholder.',
    );
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.deleteConfirmText.set('');
  }
}
