import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DoctorService } from './doctor.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('doctor')
@UseGuards(JwtAuthGuard)
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly prisma: PrismaService,
  ) {}

  private async getDoctorId(): Promise<string> {
    const doctor = await this.prisma.doctor.findFirst({
      orderBy: { createdAt: 'asc' },
    });
    if (!doctor) throw new Error('No doctor profile found');
    return doctor.id;
  }

  @Get('patients')
  async getPatients() {
    const doctorId = await this.getDoctorId();
    return this.doctorService.getPatients(doctorId);
  }

  @Get('patients/:id')
  async getPatientDetail(@Param('id') id: string) {
    const doctorId = await this.getDoctorId();
    return this.doctorService.getPatientDetail(doctorId, id);
  }

  @Get('prescriptions')
  async listPrescriptions() {
    const doctorId = await this.getDoctorId();
    return this.doctorService.listPrescriptions(doctorId);
  }

  @Post('prescriptions')
  async createPrescription(@Body() dto: CreatePrescriptionDto) {
    const doctorId = await this.getDoctorId();
    return this.doctorService.createPrescription(doctorId, dto);
  }
}
