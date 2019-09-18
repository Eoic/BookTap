import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shelf } from "./Shelf";
import { User } from "./User";

enum BookStatus {
    NotStarted = 0,
    Started = 1,
    Finished = 2,
}

@Entity("books")
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ length: 255 })
    public title!: string;

    @Column("int")
    public status!: BookStatus;

    @CreateDateColumn({ type: "timestamp" })
    public createdAt!: Date;

    @ManyToOne(() => User, (user) => (user as any).books)
    public user!: User;

    @ManyToOne(() => Shelf, (shelf) => (shelf as any).books)
    public shelf!: Shelf;
}
