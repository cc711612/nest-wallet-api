import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('socials')
export class Social {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 255, nullable: true })
  email?: string;

  @Column({ name: 'social_type', length: 50 })
  socialType!: string;

  @Column({ name: 'social_type_value', length: 255 })
  socialTypeValue!: string;

  @Column({ length: 255, nullable: true })
  image?: string;

  @Column({ length: 255, nullable: true })
  token?: string;

  @Column({ default: false })
  followed: boolean = false;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_social',
    joinColumn: { name: 'social_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  users!: User[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}