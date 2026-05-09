import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CalibrationService, CalibrationData } from './calibration.service';

@Controller('calibration')
@UseGuards(JwtAuthGuard)
export class CalibrationController {
  constructor(private readonly calibrationService: CalibrationService) {}

  @Get('presets')
  getPresets() {
    return this.calibrationService.getPresets();
  }

  @Get('user')
  getUserCalibrations(@Req() req: any) {
    return this.calibrationService.getUserCalibrations(req.user.userId);
  }

  @Get('active')
  getActiveUserCalibration(@Req() req: any) {
    return this.calibrationService.getActiveUserCalibration(req.user.userId);
  }

  @Post('user')
  saveUserCalibration(@Req() req: any, @Body() data: CalibrationData) {
    return this.calibrationService.saveUserCalibration(req.user.userId, data);
  }

  @Put('user/:id/active')
  setActiveUserCalibration(@Req() req: any, @Param('id') id: string) {
    return this.calibrationService.setActiveUserCalibration(req.user.userId, id);
  }

  @Delete('user/:id')
  deleteUserCalibration(@Req() req: any, @Param('id') id: string) {
    return this.calibrationService.deleteUserCalibration(req.user.userId, id);
  }
}
