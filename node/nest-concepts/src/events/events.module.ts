import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventService } from './user-events.service';
import { UserRegisteredListeners } from './listeners/user-registered.listeners';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      global: true,
      wildcard: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
    }),
  ],
  providers: [UserEventService, UserRegisteredListeners],
  exports: [UserEventService],
})
export class EventsModule {}
