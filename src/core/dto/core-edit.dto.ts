import { CoreEntity } from '../entity/core.entity';
import { User } from '../user/enitity/user.entity';

export class CoreEditDto {
  static async updateEntity(
    dto: CoreEditDto,
    entity: CoreEntity,
    userId: string,
  ) {
    entity.changedBy = Promise.resolve(new User(userId));
    entity.changedAt = new Date();
    entity.deletedAt = null;
  }
}
