import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { validationLimits } from "../validation/limits";
import { Book } from "./Book";
import { Shelf } from "./Shelf";
import { Topic } from "./Topic";

export enum UserType {
  Client,
  Admin,
}

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: validationLimits.USERNAME.max, unique: true })
  public username!: string;

  @Column({ length: validationLimits.PASSWORD.max })
  public password!: string;

  @Column({ length: validationLimits.EMAIL.max, unique: true })
  public email!: string;

  @Column("int")
  public userType!: UserType;

  @Column("boolean", { default: true })
  public confirmed!: boolean;

  @CreateDateColumn({ type: "timestamp" })
  public createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt!: Date;

  @OneToMany(() => Book, (book) => (book as any).user)
  public books!: Book[];

  @OneToMany(() => Topic, (topic) => (topic as any).user)
  public topics!: Topic[];

  @OneToMany(() => Shelf, (shelf) => (shelf as any).user)
  public shelves!: Shelf[];
}
