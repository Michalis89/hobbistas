import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CategoryInfo } from '@hobbistas/models';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ui-category-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './category-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCardComponent {
  @Input() category?: CategoryInfo;
}
