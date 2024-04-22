import { Controller, Get } from '@nestjs/common';

@Controller()
export class ServerController {
  @Get('/server-info')
  getServerInfo(): string {
    return `Hostname: ${process.env.HOSTNAME}`;
  }
}
