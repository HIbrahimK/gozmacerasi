import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CalibrationService, CalibrationData } from './calibration.service';

@Controller('calibration')
@UseGuards(JwtAuthGuard)
export class CalibrationController {
  constructor(private readonly calibrationService: CalibrationService) {}

  @Get('profile/:childId')
  getProfile(@Param('childId') childId: string) {
    return this.calibrationService.getProfile(childId);
  }

  @Post('profile')
  saveProfile(@Body() data: CalibrationData) {
    return this.calibrationService.saveProfile(data);
  }

  @Get('presets')
  getPresets() {
    return this.calibrationService.getPresets();
  }
}
