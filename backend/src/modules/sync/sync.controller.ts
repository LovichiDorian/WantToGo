import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { SyncService } from './sync.service';
import { BulkSyncRequestDto, BulkSyncResponse } from './sync.dto';

// TODO: Replace with actual user ID from auth middleware
const TEMP_USER_ID = 'default-user-id';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  /**
   * Process a batch of offline actions
   * This endpoint is called by the Background Sync API or manual sync
   */
  @Post('bulk')
  async bulkSync(@Body() dto: BulkSyncRequestDto): Promise<BulkSyncResponse> {
    return this.syncService.processBulkSync(TEMP_USER_ID, dto);
  }

  /**
   * Get all changes since a given timestamp
   * Used for delta sync after initial load
   */
  @Get('changes')
  async getChanges(@Query('since') since?: string) {
    const sinceDate = since ? new Date(since) : new Date(0);
    return this.syncService.getChangesSince(TEMP_USER_ID, sinceDate);
  }
}
