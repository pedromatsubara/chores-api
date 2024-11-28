import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userData: Partial<User>): Promise<User> {
    return this.usersRepository.create(userData);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne(id);
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    await this.usersRepository.update(id, userData);
    return this.usersRepository.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    return this.usersRepository.remove(id);
  }
}
