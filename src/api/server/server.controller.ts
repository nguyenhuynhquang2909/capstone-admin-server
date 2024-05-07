import { Controller, Get } from '@nestjs/common';

@Controller()
export class ServerController {
  @Get('/server')
  getServerInfo(): string {
    return `Hostname: ${process.env.HOSTNAME}`;
  }
}
