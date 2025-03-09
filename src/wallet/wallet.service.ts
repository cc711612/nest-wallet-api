import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  create(walletData: Partial<Wallet>) {
    const newWallet = this.walletRepository.create(walletData);
    return this.walletRepository.save(newWallet);
  }

  findAll() {
    return this.walletRepository.find();
  }

  findOne(id: number) {
    return this.walletRepository.findOne({ where: { id } });
  }

  update(id: number, updateData: Partial<Wallet>) {
    return this.walletRepository.update(id, updateData);
  }

  remove(id: number) {
    return this.walletRepository.delete(id);
  }
}