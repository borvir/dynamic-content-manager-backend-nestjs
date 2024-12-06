import { Injectable } from '@nestjs/common';

@Injectable() //injektálható szerviz
export class ExampleService {
  getHello() {
    return 'Hello';
  }
}
