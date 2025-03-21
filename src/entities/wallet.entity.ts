import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, AfterLoad, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { User } from './user.entity';
import { WalletDetails } from './wallet-details.entity';
import { WalletUser } from './wallet-user.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ length: 100 })
  title!: string;

  @Column({ length: 3, default: 'TWD' })
  unit: string = 'TWD';

  @Column({ length: 50, nullable: true })
  code?: string;

  @Column({ type: 'json', nullable: true })
  properties?: Record<string, any>;

  @Column({
    type: 'enum',
    enum: [1, 0],
    default: 1
  })
  status: 1 | 0 = 1;

  @ManyToOne(() => User, user => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => WalletDetails, details => details.wallet)
  @JoinColumn({ name: 'wallet_id' })
  walletDetails!: WalletDetails[];

  @OneToMany(() => WalletUser, walletUser => walletUser.wallet)
  @JoinColumn({ name: 'wallet_id' })
  walletUsers!: WalletUser[];

  @OneToMany(() => WalletUser, walletUser => walletUser.wallet)
  walletUserCreated!: WalletUser[];

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
  
  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date;

  @AfterLoad()
  setDefaultProperties() {
    if (this.properties === undefined || this.properties === null) {
      this.properties = {};
    }
    if (!this.properties.unitConfigurable) {
      this.properties.unitConfigurable = false;
    }
    if (!this.properties.decimalPlaces) {
      this.properties.decimalPlaces = 0;
    }
  }

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}