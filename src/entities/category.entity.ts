import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletDetails } from './wallet-details.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId?: number;

  @Column({ name: 'wallet_id', nullable: true })
  walletId?: number;

  @Column({ length: 50 })
  name!: string;

  @Column({ length: 50, nullable: true })
  icon?: string;

  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent?: Category;

  @OneToMany(() => Category, category => category.parent)
  @JoinColumn({ name: 'parent_id' })
  children!: Category[];

  //   @OneToMany(() => WalletDetails, walletDetails => walletDetails.category)
  //   walletDetails!: WalletDetails[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}