import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDestinatonDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDestinatonDto: CreateDestinatonDto) {
    return await this.prisma.destination.create({
      data: {
        ...createDestinatonDto,
        travelDate: new Date(createDestinatonDto.travelDate).toISOString(),
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return await this.prisma.destination.findMany({ where: { userId } });
  }

  async findOne(userId: number, id: number) {
    const destination = await this.prisma.destination.findFirst({ where: { id, userId } });

    if (!destination) {
      throw new NotFoundException(`Destination id ${id} not found`);
    }

    return destination;
  }

  async removeDestination(userId: number, id: number) {
    await this.findOne(userId, id);

    return this.prisma.destination.delete({ where: { id } });
  }

  async updateDestination(userId: number, id: number, updateDestination: UpdateDestinationDto) {
    await this.findOne(userId, id);

    return this.prisma.destination.update({
      where: { id },
      data: { ...updateDestination },
    });
  }
}
