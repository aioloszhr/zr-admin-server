import { User } from '../entities/user.entity';
import { OmitVO } from '@/utils/vo';

export class UserVO extends OmitVO(User, ['password']) {
	avatarPath?: string;
}
