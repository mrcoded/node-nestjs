import { PartialType } from '@nestjs/mapped-types';
import { CreateDestinatonDto } from './create-destination.dto';

export class UpdateDestinationDto extends PartialType(CreateDestinatonDto) {}
