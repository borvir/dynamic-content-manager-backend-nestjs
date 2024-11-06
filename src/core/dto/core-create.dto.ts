import { CoreEntity } from '../entity/core.entity';
import { User } from '../user/enitity/user.entity';

export class CoreCreateDto {
  static async createEntity(
    userId: string,
    entity: CoreEntity,
    // dto: CoreCreateDto,
  ) {
    const creator = await entity.createdBy;
    if (creator === null) {
      entity.createdBy = Promise.resolve(new User(userId));
    }
    entity.changedBy = Promise.resolve(new User(userId));
  }
}
