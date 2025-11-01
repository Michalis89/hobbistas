import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('interactions')
@UseGuards(JwtAuthGuard)
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post('articles/:id/like')
  likeArticle(@Param('id') articleId: string, @GetUser('id') userId: string) {
    return this.interactionsService.likeArticle(userId, articleId);
  }

  @Delete('articles/:id/like')
  unlikeArticle(@Param('id') articleId: string, @GetUser('id') userId: string) {
    return this.interactionsService.unlikeArticle(userId, articleId);
  }

  @Post('articles/:id/bookmark')
  bookmarkArticle(
    @Param('id') articleId: string,
    @GetUser('id') userId: string,
  ) {
    return this.interactionsService.bookmarkArticle(userId, articleId);
  }

  @Delete('articles/:id/bookmark')
  unbookmarkArticle(
    @Param('id') articleId: string,
    @GetUser('id') userId: string,
  ) {
    return this.interactionsService.unbookmarkArticle(userId, articleId);
  }

  @Get('bookmarks')
  getBookmarks(@GetUser('id') userId: string) {
    return this.interactionsService.getUserBookmarks(userId);
  }

  @Post('users/:id/follow')
  followUser(@Param('id') followingId: string, @GetUser('id') userId: string) {
    return this.interactionsService.followUser(userId, followingId);
  }

  @Delete('users/:id/follow')
  unfollowUser(
    @Param('id') followingId: string,
    @GetUser('id') userId: string,
  ) {
    return this.interactionsService.unfollowUser(userId, followingId);
  }
}
