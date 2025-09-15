import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DestinationsService } from './destinations.service';
import { CreateDestinatonDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Controller('destinations')
@UseGuards(JwtAuthGuard)
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post()
  create(@Request() req, @Body() createDestinatonDto: CreateDestinatonDto) {
    return this.destinationsService.create(req.user.userId, createDestinatonDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.destinationsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.destinationsService.findOne(req.user.userId, +id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDestination: UpdateDestinationDto) {
    return this.destinationsService.updateDestination(req.user.userId, +id, updateDestination);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.destinationsService.removeDestination(req.user.userId, +id);
  }
}
