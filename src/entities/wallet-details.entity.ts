import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Category } from './category.entity';
import { WalletUser } from './wallet-user.entity';

@Entity('wallet_details')
export class WalletDetails {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'wallet_id', nullable: true })
  walletId?: number;

  @Column({ name: 'category_id', nullable: true })
  categoryId?: number;

  @Column()
  type!: number;

  @Column({ name: 'payment_wallet_user_id', nullable: true })
  paymentWalletUserId?: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ length: 10, default: 'TWD' })
  unit: string = 'TWD';

  @Column({ name: 'symbol_operation_type_id', nullable: true })
  symbolOperationTypeId?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value!: number;

  @Column({ name: 'is_personal', default: false })
  isPersonal: boolean = false;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  rates?: number;

  @Column({ type: 'json', nullable: true })
  splits?: Record<string, any>;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ length: 255, nullable: true })
  note?: string;

  @Column({ name: 'select_all', default: false })
  selectAll: boolean = false;

  @Column({ name: 'checkout_by', nullable: true })
  checkoutById?: number;

  @Column({ name: 'created_by', nullable: true })
  createdById?: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedById?: number;

  @Column({ name: 'deleted_by', nullable: true })
  deletedById?: number;

  @Column({ name: 'checkout_at', type: 'timestamp', nullable: true })
  checkoutAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Relationships
  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'wallet_id' })
  wallet!: Wallet;

  @ManyToOne(() => WalletUser)
  @JoinColumn({ name: 'payment_wallet_user_id' })
  paymentUser!: WalletUser;

  @ManyToMany(() => WalletUser)
  @JoinTable({
    name: 'wallet_detail_wallet_user',
    joinColumn: { name: 'wallet_detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'wallet_user_id', referencedColumnName: 'id' }
  })
  walletUsers!: WalletUser[];

  @ManyToOne(() => WalletUser)
  @JoinColumn({ name: 'checkout_by' })
  checkoutBy!: WalletUser;

  @ManyToOne(() => WalletUser)
  @JoinColumn({ name: 'created_by' })
  createdBy!: WalletUser;

  @ManyToOne(() => WalletUser)
  @JoinColumn({ name: 'updated_by' })
  updatedBy!: WalletUser;

  @ManyToOne(() => WalletUser)
  @JoinColumn({ name: 'deleted_by' })
  deletedBy!: WalletUser;
}