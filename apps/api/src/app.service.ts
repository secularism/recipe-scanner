import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getOverview() {
    return {
      service: "recipe-scanner-api",
      status: "ok",
      version: "0.1.0",
    };
  }
}
