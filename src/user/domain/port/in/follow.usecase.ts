import {
  PostFollowCommand,
  UnfollowCommand,
  CancelFollowRequestCommand,
  ApproveFollowCommand,
  RejectFollowCommand,
} from '../../../application/command/user.command';

export const FollowUseCaseSymbol = Symbol('FollowUseCase');

export interface FollowUseCase {
  postFollow(command: PostFollowCommand): Promise<number>;
  unfollow(command: UnfollowCommand): Promise<number>;
  cancelFollowRequest(command: CancelFollowRequestCommand): Promise<number>;
  approveFollow(command: ApproveFollowCommand): Promise<number>;
  rejectFollow(command: RejectFollowCommand): Promise<number>;
}
