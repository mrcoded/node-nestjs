import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'src/auth/entities/user.entity';

export interface UserRegisteredEventProps {
  user: {
    id: number;
    email: string;
    name: string;
  };
  timeStamp: Date;
}

@Injectable()
export class UserEventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  //Emit a user registered event
  emitUserRegistered(user: User): void {
    const userRegisteredEvent: UserRegisteredEventProps = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      timeStamp: new Date(),
    };

    //takes the event name and event data
    this.eventEmitter.emit('user.registered', userRegisteredEvent);
  }
}
