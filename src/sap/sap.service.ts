import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';

// Strongly-typed contract for SAP user data
export interface UserData {
  nome: string;
  email: string;
}

@Injectable()
export class SapService {
  // Static API key constant to simulate external auth
  private static readonly SAP_API_KEY = 'API_KEY_SECRETA_SAP_12345';

  constructor(private readonly prisma: PrismaService) {}

  // Simulated single-user consultation with API key validation and request tracing
  async consultUserData(sapKey: string, requestId: string, userId: string): Promise<UserData> {
    // Security simulation: API Key validation
    if (sapKey !== SapService.SAP_API_KEY) {
      throw new Error('Invalid SAP API key.');
    }

    // Trace simulation: log requestId and userId
    console.log(`[SAP][consultUserData] requestId=${requestId} userId=${userId}`);

    // Business simulation: fetch from database and adapt to SAP UserData shape
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (!user) {
      // Not found simulation
      throw new Error('User not found in SAP system.');
    }

    return { nome: user.name, email: user.email };
  }

  // Simulated list consultation with API key validation and request tracing
  async consultAllUsers(sapKey: string, requestId: string): Promise<UserData[]> {
    // Security simulation: API Key validation
    if (sapKey !== SapService.SAP_API_KEY) {
      throw new Error('Invalid SAP API key.');
    }

    // Trace simulation: log requestId
    console.log(`[SAP][consultAllUsers] requestId=${requestId}`);

    // Business simulation: fetch list from database and adapt to SAP UserData shape
    const users = await this.prisma.user.findMany({
      select: { name: true, email: true },
    });

    return users.map((u) => ({ nome: u.name, email: u.email }));
  }
}
