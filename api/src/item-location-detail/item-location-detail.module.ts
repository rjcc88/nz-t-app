import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { RefreshTokenStrategy } from '../auth/strategy/refreshtoken.strategy';
import { TransformInterceptor } from '../lib/interceptor/transform.interceptor';
import { PrismaModule } from '../lib/prisma/prisma.module';
import { RoleService } from '../role/role.service';
import { UsersModule } from '../users/users.module';
import { ItemLocationDetailController } from './item-location-detail.controller';
import { ItemLocationDetailService } from './item-location-detail.service';

@Module({
  controllers: [ItemLocationDetailController],
  providers: [ItemLocationDetailService,
    JwtStrategy,
    RefreshTokenStrategy,
    TransformInterceptor,
    RoleService],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
    UsersModule,
  ]
})
export class ItemLocationDetailModule { }
