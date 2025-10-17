import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Article } from '@hobbistas/models';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-ui-article-card',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './article-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCardComponent {
  @Input() article?: Article;
}
