import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private supabaseService: SupabaseService) {}

  @Public()
  @Get()
  async findAll() {
    const { data } = await this.supabaseService
      .getClient()
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    return data;
  }
}
