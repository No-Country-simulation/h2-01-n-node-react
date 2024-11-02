import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { OTPService } from 'src/otp/otp.service';
import { OTP } from 'src/otp/otp.entity';
import { EmailService } from 'src/services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, OTP]),
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OTPService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
