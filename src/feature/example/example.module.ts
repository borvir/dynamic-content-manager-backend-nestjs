import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [], //külső, importált modulok vagy szervizek
  controllers: [ExampleController], //modulhoz tartozó kontrollerek
  providers: [ExampleService], //modulhoz tartozó szervizek
})
export class ExampleModule {}
