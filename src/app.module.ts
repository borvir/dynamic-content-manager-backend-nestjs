import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './feature/tag/tag.module';
import { AuthModule } from './core/auth/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptionsFactory } from './config/typeorm-options.factory';
import { TextModule } from './feature/text/text.module';
import { ViewModule } from './feature/view/view.module';
import { FileModule } from './feature/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmOptionsFactory.createTypeOrmOptions()),
    ConfigModule.forRoot({ isGlobal: true }),
    TagModule,
    TextModule,
    AuthModule,
    ViewModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
