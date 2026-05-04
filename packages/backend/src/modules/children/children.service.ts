import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChildDto } from './dto/create-child.dto';
import { ChildProfile } from './children.types';

type PrismaChildRecord = {
  id: string;
  name: string;
  diagnosis: string | null;
  dailyLimit: number;
  createdAt: Date;
};

@Injectable()
export class ChildrenService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly children: ChildProfile[] = [
    {
      id: 'child_demo_1',
      fullName: 'Demo Child',
      diagnosis: 'Amblyopia',
      dailyLimitMinutes: 20,
      createdAt: new Date().toISOString(),
    },
  ];

  async list(): Promise<ChildProfile[]> {
    try {
      const children = await this.prisma.child.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return children.map((child: PrismaChildRecord) => ({
        id: child.id,
        fullName: child.name,
        diagnosis: child.diagnosis ?? undefined,
        dailyLimitMinutes: child.dailyLimit,
        createdAt: child.createdAt.toISOString(),
      }));
    } catch {
      return this.children;
    }
  }

  async create(dto: CreateChildDto): Promise<ChildProfile> {
    try {
      const parentId = await this.ensureDefaultParentId();
      const child = await this.prisma.child.create({
        data: {
          parentId,
          name: dto.fullName,
          age: 6,
          diagnosis: dto.diagnosis,
          dailyLimit: dto.dailyLimitMinutes ?? 20,
        },
      });

      return {
        id: child.id,
        fullName: child.name,
        diagnosis: child.diagnosis ?? undefined,
        dailyLimitMinutes: child.dailyLimit,
        createdAt: child.createdAt.toISOString(),
      };
    } catch {
      const child: ChildProfile = {
        id: `child_${Date.now()}`,
        fullName: dto.fullName,
        diagnosis: dto.diagnosis,
        dailyLimitMinutes: dto.dailyLimitMinutes ?? 20,
        createdAt: new Date().toISOString(),
      };

      this.children.unshift(child);
      return child;
    }
  }

  private async ensureDefaultParentId(): Promise<string> {
    const existingParent = await this.prisma.parent.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    if (existingParent) {
      return existingParent.id;
    }

    const demoUser = await this.prisma.user.upsert({
      where: { email: 'parent@gozmacerasi.dev' },
      update: {
        name: 'Demo Parent',
        role: 'PARENT',
      },
      create: {
        email: 'parent@gozmacerasi.dev',
        name: 'Demo Parent',
        role: 'PARENT',
      },
    });

    const demoParent = await this.prisma.parent.upsert({
      where: { userId: demoUser.id },
      update: {},
      create: {
        userId: demoUser.id,
      },
    });

    return demoParent.id;
  }
}
