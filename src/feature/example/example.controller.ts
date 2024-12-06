import { Controller, Get } from '@nestjs/common';
import { ExampleService } from './example.service';

@Controller('example') //kontroller elérési útja
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {} //szerviz injektálása

  @Get() // HTTP GET kérés: /example
  getHello(): string {
    return this.exampleService.getHello(); //szerviz funkcióinak használata
  }
}
