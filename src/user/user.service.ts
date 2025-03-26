import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

    findAll(account?: string, name?: string): Promise<User[]> {
    const where = {
      ...(account && { account: Like(`%${account}%`) }),
      ...(name && { name: Like(`%${name}%`) }),
    };
    return this.userRepository.find({ where });
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findByAccount(account: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { account } });
  }

  create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findUserWithWallet(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ 
      where: { id }, 
      relations: ['wallets', 'walletUsers', 'devices'], 
    });
    if (!user) {
      return null;
    }
    user.wallet = await user.getLatestWallet();
    return user;
  }

  async update(id: number, user: User): Promise<User | null> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}