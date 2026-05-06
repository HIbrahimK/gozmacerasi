import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminStats, AdminUser, AdminUserDetail } from './admin.types';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<AdminStats> {
    const [
      totalUsers,
      totalChildren,
      totalDoctors,
      totalGames,
      totalSessions,
      totalPremiumCodes,
      activePremiumCodes,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.child.count(),
      this.prisma.doctor.count(),
      this.prisma.game.count(),
      this.prisma.gameSession.count(),
      this.prisma.premiumCode.count(),
      this.prisma.premiumCode.count({ where: { activated: true } }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = await this.prisma.gameSession.count({
      where: { startedAt: { gte: today } },
    });

    return {
      totalUsers,
      totalChildren,
      totalDoctors,
      totalGames,
      totalSessions,
      totalPremiumCodes,
      activePremiumCodes,
      todaySessions,
    };
  }

  async listUsers(role?: string, search?: string): Promise<AdminUser[]> {
    const where: Record<string, unknown> = {};

    if (role) {
      where.role = role.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return users.map(
      (user: { id: string; email: string; name: string | null; role: string; createdAt: Date }) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      }),
    );
  }

  async getUserById(id: string): Promise<AdminUserDetail | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        parent: {
          include: { children: true },
        },
        doctor: {
          include: { children: true },
        },
        admin: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      parentProfile: user.parent
        ? {
            id: user.parent.id,
            phone: user.parent.phone,
            childrenCount: user.parent.children.length,
          }
        : null,
      doctorProfile: user.doctor
        ? {
            id: user.doctor.id,
            specialization: user.doctor.specialization,
            licenseNumber: user.doctor.licenseNumber,
            verified: user.doctor.verified,
            patientsCount: user.doctor.children.length,
          }
        : null,
      adminProfile: user.admin ? { id: user.admin.id } : null,
    };
  }

  async createUser(dto: CreateUserDto): Promise<AdminUser> {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: passwordHash,
        role: (dto.role as 'PARENT' | 'DOCTOR' | 'ADMIN' | 'CHILD') ?? 'PARENT',
      },
    });

    if (user.role === 'PARENT') {
      await this.prisma.parent.create({
        data: { userId: user.id },
      });
    } else if (user.role === 'DOCTOR') {
      await this.prisma.doctor.create({
        data: { userId: user.id },
      });
    } else if (user.role === 'ADMIN') {
      await this.prisma.admin.create({
        data: { userId: user.id },
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<AdminUser> {
    const data: Record<string, unknown> = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.password !== undefined) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
