import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate, JoinColumn, getRepository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { Device } from './device.entity';
import { WalletUser } from './wallet-user.entity';
import { Exclude } from 'class-transformer';
// import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100, nullable: true })
  account?: string;

  @Column({ length: 255, nullable: true })
  image?: string;

  @Exclude()
  @Column()
  password!: string;

  @Column({ length: 255, nullable: true })
  token?: string;

  @Column({ name: 'notify_token', length: 255, nullable: true })
  notifyToken?: string;

  @Column({ name: 'agent', length: 255, nullable: true })
  agent?: string;

  @Column({ length: 45, nullable: true })
  ip?: string;

  @OneToMany(() => Wallet, wallet => wallet.user)
  @JoinColumn({ name: 'user_id' })
  wallets!: Wallet[];

  @OneToMany(() => WalletUser, walletUser => walletUser.user)
  @JoinColumn({ name: 'user_id' })
  walletUsers!: WalletUser[];

  @OneToMany(() => Device, device => device.user)
  @JoinColumn({ name: 'user_id' })
  devices!: Device[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
//   async hashPassword() {
//     if (this.password) {
//       const salt = await bcrypt.genSalt();
//       this.password = await bcrypt.hash(this.password, salt);
//     }
//   }

  routeNotificationForNotify() {
    return this.notifyToken;
  }

  wallet?: Wallet | null; // Add this line to define the new property

  jwt?: string; // Add this line to define the new property

  notifies?: any[]; // Add this line to define the new property

  async getLatestWallet(): Promise<Wallet | null> {
    if (!this.wallets || this.wallets.length === 0) {
      return null;
    }
    return this.wallets.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];
  }
}