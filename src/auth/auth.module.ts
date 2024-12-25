import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret:'2afb7a1434b7b141e0e398c4b6c1fa250b87170c9e29c88848ad29de2dd5ebcbfaaa328b47e57c715771c3686d29a43fd7a90febf2af73b70189ce46a264deec',
      signOptions:{
        algorithm:'HS512',
        expiresIn:'1d'
      }
    }),
    PassportModule.register({
      defaultStrategy:'jwt'
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
