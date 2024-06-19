import { UserEntity } from '../entities/user';
import { OmitVO } from '@/utils/vo';

export class UserVO extends OmitVO(UserEntity, ['password']) {
	avatarPath?: string;
}
