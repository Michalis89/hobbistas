import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-base-200 py-12">
      <div class="container mx-auto px-4 max-w-4xl">
        <h1 class="text-4xl font-bold mb-8">⚙️ Ρυθμίσεις</h1>

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
          <button class="btn btn-primary" (click)="saveSettings()">
            💾 Αποθήκευση
          </button>
          <button class="btn btn-outline" (click)="resetSettings()">
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
    </div>
  `,
})
export class SettingsComponent {
  settings = {
    username: 'Μιχάλης Καρκάνης',
    email: 'michalis@hobbistas.gr',
    bio: 'Passionate gamer και developer',
    theme: 'core',
    notifications: { comments: true, followers: true, newsletter: false },
    privacy: { publicProfile: true, showEmail: false },
  };

  saveSettings() {
    alert('Οι ρυθμίσεις αποθηκεύτηκαν!');
  }

  resetSettings() {
    if (confirm('Επαναφορά στις προεπιλεγμένες ρυθμίσεις;')) {
      // Reset logic
    }
  }

  deleteAccount() {
    if (confirm('ΠΡΟΣΟΧΗ: Αυτή η ενέργεια είναι μόνιμη. Συνεχίζεις;')) {
      alert('Λογαριασμός διαγράφηκε');
    }
  }
}
