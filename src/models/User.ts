import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { validationLimits } from "../validation/limits";
import { Book } from "./Book";

enum UserType {
  Client,
  Admin,
}

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: validationLimits.USERNAME.max })
  public username!: string;

  @Column({ length: validationLimits.PASSWORD.max })
  public password!: string;

  @Column({ length: validationLimits.EMAIL.max })
  public email!: string;

  @Column("int")
  public userType!: UserType;

  @CreateDateColumn({ type: "timestamp" })
  public createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt!: Date;

  @OneToMany(() => Book, (book) => (book as any).user)
  public books!: Book[];
}
