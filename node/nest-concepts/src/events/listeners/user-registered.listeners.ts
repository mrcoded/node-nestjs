import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { UserRegisteredEventProps } from '../user-events.service';

//event listeners respond to the event emitted
@Injectable()
export class UserRegisteredListeners {
  private readonly logger = new Logger(UserRegisteredListeners.name);

  @OnEvent('user.registered')
  handleUserRegisteredEvent(event: UserRegisteredEventProps): void {
    const { user, timeStamp } = event;

    //app actions
    this.logger.log(
      `Welcome, ${user.email}! Your account successfully created at ${timeStamp.toISOString()}.`,
    );
  }
}
