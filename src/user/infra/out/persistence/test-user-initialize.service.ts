import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';

export class TestUserInitializeService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.initializeTestUser();
  }

  private async initializeTestUser(): Promise<void> {
    const admins = [
      {
        email: 'test1@test.com',
        password:
          '$2a$10$JhOL4EqwkKR.9hAiLzBX6.tL6g/HlY/G0ZVKBYNc8wvohB/e3WGOC',
        provider: 'local',
        nickname: 'test1',
        description: 'admin',
        image: '',
      },
      {
        email: 'test2@test.com',
        password:
          '$2a$10$Bg6UwBpDPKQwfAlIzPuMyuRlfVFO6njH.guOeKrrgc2K9alk/Neby',
        provider: 'local',
        nickname: 'test2',
        description: 'admin',
        image: '',
      },
      {
        email: 'test3@test.com',
        password:
          '$2a$10$keOwQ/wTL4GH301j8MtuJeHNaNCKt0Etv575nJxe0KB3CgvXQNxJO',
        provider: 'local',
        nickname: 'test3',
        description: 'admin',
        image: '',
      },
      {
        email: 'test4@test.com',
        password:
          '$2a$10$fw1ToWOhAII6/RBdG014JeF8ptvQXUcMsdCyoDsomHaKAXanTfVY6',
        provider: 'local',
        nickname: 'test4',
        description: 'admin',
        image: '',
      },
      {
        email: 'test5@test.com',
        password:
          '$2a$10$31GsgJhl2ErUq8zL0hsP0eOk9/BoYqkP5vfFClO9eBnBg.P0dpsNq',
        provider: 'local',
        nickname: 'test5',
        description: 'admin',
        image: '',
      },
    ];

    const emails = admins.map((admin) => admin.email);
    const existing = await this._userRepository.find({
      where: { email: In(emails) },
      select: ['email'],
    });

    const existingEmailSet = new Set(existing.map((user) => user.email));

    const toInsert = admins.filter(
      (admin) => !existingEmailSet.has(admin.email),
    );

    if (toInsert.length > 0) {
      await this._userRepository.insert(toInsert);
    }
  }
}
