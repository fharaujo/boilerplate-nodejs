import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@infrastructure/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SapService, UserData } from '../../sap/sap.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private prisma: PrismaService,
    private readonly sapService: SapService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    this.logger.log(`Created new user: ${user.email}`);

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Check if user exists

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    this.logger.log(`Updated user: ${user.email}`);

    return user;
  }

  async remove(id: string) {
    await this.findOne(id); // Check if user exists

    await this.prisma.user.delete({
      where: { id },
    });

    this.logger.log(`Deleted user: ${id}`);

    return { message: 'User deleted successfully' };
  }

  private generateRequestId(): string {
    return `req_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
  }

  async findOneFromSap(userId: string, sapKey: string): Promise<UserData> {
    const requestId = this.generateRequestId();
    try {
      if (!sapKey) {
        throw new UnauthorizedException('Missing SAP key header');
      }
      return await this.sapService.consultUserData(sapKey, requestId, userId);
    } catch (err: any) {
      const message = err?.message || '';
      if (message.includes('User not found')) {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException(`SAP integration failed. RequestId=${requestId}`);
    }
  }

  async findAllFromSap(sapKey: string): Promise<UserData[]> {
    const requestId = this.generateRequestId();
    try {
      if (!sapKey) {
        throw new UnauthorizedException('Missing SAP key header');
      }
      return await this.sapService.consultAllUsers(sapKey, requestId);
    } catch (err: any) {
      throw new InternalServerErrorException(`SAP integration failed. RequestId=${requestId}`);
    }
  }
}
