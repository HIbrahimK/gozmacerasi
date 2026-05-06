import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParentService } from './parent.service';
import { CreateChildByParentDto } from './dto/create-child.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('parent')
@UseGuards(JwtAuthGuard)
export class ParentController {
  constructor(
    private readonly parentService: ParentService,
    private readonly prisma: PrismaService,
  ) {}

  private async getParentId(): Promise<string> {
    const parent = await this.prisma.parent.findFirst({
      orderBy: { createdAt: 'asc' },
    });
    if (!parent) throw new Error('No parent profile found');
    return parent.id;
  }

  @Get('dashboard')
  async getDashboard() {
    const parentId = await this.getParentId();
    return this.parentService.getDashboard(parentId);
  }

  @Get('children')
  async listChildren() {
    const parentId = await this.getParentId();
    return this.parentService.listChildren(parentId);
  }

  @Post('children')
  async createChild(@Body() dto: CreateChildByParentDto) {
    const parentId = await this.getParentId();
    return this.parentService.createChild(parentId, dto);
  }

  @Get('children/:id/progress')
  async getChildProgress(@Param('id') id: string) {
    const parentId = await this.getParentId();
    return this.parentService.getChildProgress(parentId, id);
  }
}
