import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { WalletUser } from './wallet-user.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', nullable: true })
  userId?: number;

  @Column({ name: 'wallet_user_id', nullable: true })
  walletUserId?: number;

  @Column({ length: 50 })
  platform!: string;

  @Column({ name: 'device_name', length: 100 })
  deviceName!: string;

  @Column({ name: 'device_type', length: 50 })
  deviceType!: string;

  @Column({ name: 'fcm_token', length: 255, nullable: true })
  fcmToken?: string;

  @Column({ name: 'expired_at', type: 'timestamp', nullable: true })
  expiredAt?: Date;

  @ManyToOne(() => User, user => user.devices)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => WalletUser, walletUser => walletUser.devices)
  @JoinColumn({ name: 'wallet_user_id' })
  walletUser?: WalletUser;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}