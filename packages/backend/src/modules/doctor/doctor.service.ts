import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePrescriptionDto,
  DoctorPatient,
  DoctorPatientDetail,
  DoctorPrescription,
  DoctorSession,
} from './doctor.types';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async getPatients(doctorId: string): Promise<DoctorPatient[]> {
    const children = await this.prisma.child.findMany({
      where: { doctorId },
      include: {
        gameSessions: {
          orderBy: { startedAt: 'desc' },
          take: 100,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return children.map(
      (child: {
        id: string;
        name: string;
        age: number;
        diagnosis: string | null;
        baselineVA: string | null;
        dailyLimit: number;
        gameSessions: Array<{
          accuracy: { toNumber: () => number } | null;
          startedAt: Date;
        }>;
      }) => {
        const sessions = child.gameSessions;
        const accuracyValues = sessions
          .map((s) => (s.accuracy ? s.accuracy.toNumber() * 100 : 0))
          .filter((v) => v > 0);

        return {
          id: child.id,
          name: child.name,
          age: child.age,
          diagnosis: child.diagnosis,
          baselineVA: child.baselineVA,
          dailyLimit: child.dailyLimit,
          totalSessions: sessions.length,
          avgAccuracy: accuracyValues.length
            ? Math.round(
                accuracyValues.reduce((a, b) => a + b, 0) / accuracyValues.length,
              )
            : 0,
          lastSessionDate: sessions.length > 0 ? sessions[0].startedAt.toISOString() : null,
        };
      },
    );
  }

  async getPatientDetail(doctorId: string, childId: string): Promise<DoctorPatientDetail> {
    const child = await this.prisma.child.findFirst({
      where: { id: childId, doctorId },
      include: {
        gameSessions: {
          include: { game: true },
          orderBy: { startedAt: 'desc' },
          take: 50,
        },
        prescriptions: {
          orderBy: { createdDate: 'desc' },
        },
      },
    });

    if (!child) {
      throw new NotFoundException('Patient not found');
    }

    const accuracyValues = child.gameSessions
      .map((s: { accuracy: { toNumber: () => number } | null }) =>
        s.accuracy ? s.accuracy.toNumber() * 100 : 0,
      )
      .filter((v: number) => v > 0);

    const sessions: DoctorSession[] = child.gameSessions.map(
      (s: {
        id: string;
        game: { title: string };
        duration: number;
        accuracy: { toNumber: () => number } | null;
        reactionTime: number | null;
        startedAt: Date;
      }) => ({
        id: s.id,
        gameTitle: s.game.title,
        durationMinutes: Math.max(1, Math.ceil(s.duration / 60)),
        accuracy: s.accuracy ? Math.round(s.accuracy.toNumber() * 100) : 0,
        reactionTimeMs: s.reactionTime ?? 0,
        createdAt: s.startedAt.toISOString(),
      }),
    );

    const prescriptions: DoctorPrescription[] = child.prescriptions.map(
      (p: {
        id: string;
        childId: string;
        diagnosis: string;
        targetGoals: unknown;
        recommendedGames: unknown;
        difficultyRange: string;
        dailyLimitMinutes: number;
        notes: string | null;
        status: string;
        createdDate: Date;
        lastModified: Date;
      }) => ({
        id: p.id,
        childId: p.childId,
        childName: child.name,
        diagnosis: p.diagnosis,
        targetGoals: p.targetGoals as Record<string, boolean>,
        recommendedGames: p.recommendedGames as Array<{ gameId: string; reason: string }>,
        difficultyRange: p.difficultyRange,
        dailyLimitMinutes: p.dailyLimitMinutes,
        notes: p.notes,
        status: p.status,
        createdDate: p.createdDate.toISOString(),
        lastModified: p.lastModified.toISOString(),
      }),
    );

    return {
      id: child.id,
      name: child.name,
      age: child.age,
      diagnosis: child.diagnosis,
      baselineVA: child.baselineVA,
      dailyLimit: child.dailyLimit,
      totalSessions: child.gameSessions.length,
      avgAccuracy: accuracyValues.length
        ? Math.round(
            accuracyValues.reduce((a: number, b: number) => a + b, 0) / accuracyValues.length,
          )
        : 0,
      lastSessionDate:
        child.gameSessions.length > 0 ? child.gameSessions[0].startedAt.toISOString() : null,
      sessions,
      prescriptions,
    };
  }

  async listPrescriptions(doctorId: string): Promise<DoctorPrescription[]> {
    const prescriptions = await this.prisma.doctorPrescription.findMany({
      where: { doctorId },
      include: { child: true },
      orderBy: { createdDate: 'desc' },
    });

    return prescriptions.map(
      (p: {
        id: string;
        childId: string;
        child: { name: string };
        diagnosis: string;
        targetGoals: unknown;
        recommendedGames: unknown;
        difficultyRange: string;
        dailyLimitMinutes: number;
        notes: string | null;
        status: string;
        createdDate: Date;
        lastModified: Date;
      }) => ({
        id: p.id,
        childId: p.childId,
        childName: p.child.name,
        diagnosis: p.diagnosis,
        targetGoals: p.targetGoals as Record<string, boolean>,
        recommendedGames: p.recommendedGames as Array<{ gameId: string; reason: string }>,
        difficultyRange: p.difficultyRange,
        dailyLimitMinutes: p.dailyLimitMinutes,
        notes: p.notes,
        status: p.status,
        createdDate: p.createdDate.toISOString(),
        lastModified: p.lastModified.toISOString(),
      }),
    );
  }

  async createPrescription(
    doctorId: string,
    dto: CreatePrescriptionDto,
  ): Promise<DoctorPrescription> {
    const child = await this.prisma.child.findFirst({
      where: { id: dto.childId, doctorId },
    });

    if (!child) {
      throw new NotFoundException('Patient not found for this doctor');
    }

    const prescription = await this.prisma.doctorPrescription.create({
      data: {
        doctorId,
        childId: dto.childId,
        diagnosis: dto.diagnosis,
        targetGoals: dto.targetGoals,
        recommendedGames: dto.recommendedGames,
        difficultyRange: dto.difficultyRange ?? 'medium',
        dailyLimitMinutes: dto.dailyLimitMinutes ?? 30,
        notes: dto.notes,
      },
    });

    return {
      id: prescription.id,
      childId: prescription.childId,
      childName: child.name,
      diagnosis: prescription.diagnosis,
      targetGoals: prescription.targetGoals as Record<string, boolean>,
      recommendedGames: prescription.recommendedGames as Array<{ gameId: string; reason: string }>,
      difficultyRange: prescription.difficultyRange,
      dailyLimitMinutes: prescription.dailyLimitMinutes,
      notes: prescription.notes,
      status: prescription.status,
      createdDate: prescription.createdDate.toISOString(),
      lastModified: prescription.lastModified.toISOString(),
    };
  }
}
