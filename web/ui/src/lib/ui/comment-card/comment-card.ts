import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Comment } from '@hobbistas/models';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'lib-ui-comment-card',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: './comment-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentCardComponent {
  @Input() comment?: Comment;
  @Input() showReplies = true;
  @Output() like = new EventEmitter<string>();
  @Output() reply = new EventEmitter<string>();

  onLike() {
    if (this.comment?.id) {
      this.like.emit(this.comment.id);
    }
  }

  onReply() {
    if (this.comment?.id) {
      this.reply.emit(this.comment.id);
    }
  }
}
