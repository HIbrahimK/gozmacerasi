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
      const child = await this.prisma.child.create({
        data: {
          parentId: 'parent_demo_1',
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
}
