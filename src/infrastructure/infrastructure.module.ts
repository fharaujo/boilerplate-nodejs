import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

import { PrismaService } from './database/prisma.service';
import { RedisService } from './cache/redis.service';
import { RabbitMQService } from './messaging/rabbitmq.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB', 0),
        }),
        ttl: 60 * 1000, // 60 seconds default
      }),
    }),
  ],
  providers: [PrismaService, RedisService, RabbitMQService],
  exports: [PrismaService, RedisService, RabbitMQService],
})
export class InfrastructureModule {}
