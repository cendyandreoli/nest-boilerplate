import { Module } from '@nestjs/common';

// import { DatabaseModule } from '@infra/database/database.module';
import { LoggerModule } from '@infra/logger/logger.module';

@Module({
  imports: [
    // DatabaseModule,
    LoggerModule,
  ],
})
export class InfraModule { }
