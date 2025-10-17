import { Module } from '@nestjs/common';
import { SapService } from './sap.service';

@Module({
  providers: [SapService],
  exports: [SapService],
})
export class SapModule {}
