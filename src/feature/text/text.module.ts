import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { Text } from './entities/text.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Text])],
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}
