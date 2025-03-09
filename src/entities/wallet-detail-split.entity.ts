import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { WalletDetails } from './wallet-details.entity';
import { WalletUser } from './wallet-user.entity';

@Entity('wallet_detail_splits')
export class WalletDetailSplit {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => WalletDetails, walletDetail => walletDetail.splits)
  @JoinColumn({ name: 'wallet_detail_id' })
  walletDetail!: WalletDetails;

  @ManyToOne(() => WalletUser, walletUser => walletUser.splits)
  @JoinColumn({ name: 'wallet_user_id' })
  walletUser!: WalletUser;

  @Column({ name: 'wallet_detail_id' })
  walletDetailId!: number;

  @Column({ name: 'wallet_user_id' })
  walletUserId!: number;

  @Column({ length: 10, default: 'TWD' })
  unit: string = 'TWD';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value!: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean = true;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}