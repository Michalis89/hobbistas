import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '@hobbistas/models';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ui-user-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input() user?: User;
  @Input() showStats = true;
  @Input() compact = false;
}
