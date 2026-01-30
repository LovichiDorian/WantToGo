import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { BulkSyncRequestDto, BulkSyncResponse } from './sync.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { id: string; email: string };
}

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  /**
   * Process a batch of offline actions
   * This endpoint is called by the Background Sync API or manual sync
   */
  @Post('bulk')
  async bulkSync(
    @Body() dto: BulkSyncRequestDto,
    @Request() req: RequestWithUser,
  ): Promise<BulkSyncResponse> {
    return this.syncService.processBulkSync(req.user.id, dto);
  }

  /**
   * Get all changes since a given timestamp
   * Used for delta sync after initial load
   */
  @Get('changes')
  async getChanges(
    @Query('since') since: string | undefined,
    @Request() req: RequestWithUser,
  ) {
    const sinceDate = since ? new Date(since) : new Date(0);
    return this.syncService.getChangesSince(req.user.id, sinceDate);
  }
}
