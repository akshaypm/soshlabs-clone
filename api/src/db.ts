import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

export interface DatabasePing {
  ping(): Promise<void>;
}

export class PrismaDatabase implements DatabasePing {
  constructor(private readonly prisma: PrismaClient) {}

  static connect(databaseUrl: string): PrismaClient {
    const adapter = new PrismaPg({ connectionString: databaseUrl });
    return new PrismaClient({ adapter });
  }

  async ping(): Promise<void> {
    await this.prisma.$queryRaw`SELECT 1`;
  }
}
