import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { snowFlake } from './utils/snow.flake';

@EventSubscriber()
export class EverythingSubscriber implements EntitySubscriberInterface {
	beforeInsert(event: InsertEvent<any>) {
		if (!event.entity.id) {
			event.entity.id = snowFlake.nextId();
		}
	}
}
