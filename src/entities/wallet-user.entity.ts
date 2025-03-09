import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Wallet } from './wallet.entity';
import { WalletDetailSplit } from './wallet-detail-split.entity';
import { Device } from './device.entity';
import { WalletDetails } from './wallet-details.entity';

@Entity('wallet_users')
export class WalletUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'wallet_id' })
  walletId!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ length: 100, nullable: true })
  name?: string;

  @Column({ length: 255, nullable: true })
  token?: string;

  @Column({ length: 255, nullable: true })
  agent?: string;

  @Column({ length: 45, nullable: true })
  ip?: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean = false;

  @Column({ name: 'notify_enable', default: true })
  notifyEnable: boolean = true;

  @ManyToOne(() => User, user => user.walletUsers)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Wallet, wallet => wallet.walletUsers)
  @JoinColumn({ name: 'wallet_id' })
  wallet!: Wallet;

  @OneToMany(() => Device, device => device.walletUser)
  @JoinColumn({ name: 'wallet_user_id' })
  devices!: Device[];

  @ManyToMany(() => WalletDetails)
  @JoinTable({
    name: 'wallet_detail_wallet_user',
    joinColumn: { name: 'wallet_user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'wallet_detail_id', referencedColumnName: 'id' }
  })
  walletDetails!: WalletDetails[];

  @OneToMany(() => WalletDetails, walletDetail => walletDetail.createdBy)
  createdWalletDetails!: WalletDetails[];

  @OneToMany(() => WalletDetails, walletDetail => walletDetail.paymentUser)
  paymentWalletDetails!: WalletDetails[];

  @OneToMany(() => WalletDetailSplit, split => split.walletUser)
  splits!: WalletDetailSplit[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}