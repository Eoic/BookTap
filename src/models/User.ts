import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { validationLimits } from "../validation/limits";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: validationLimits.USERNAME.max })
  public username!: string;

  @Column({ length: validationLimits.PASSWORD.max })
  public password!: string;

  @Column()
  public email!: string;

  @CreateDateColumn({ type: "timestamp" })
  public createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt!: Date;
}
