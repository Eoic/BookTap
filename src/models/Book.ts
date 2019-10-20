import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shelf } from "./Shelf";
import { User } from "./User";

export enum BookStatus {
    NotStarted = 0,
    Started = 1,
    Finished = 2,
}

@Entity("books")
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    // Metadata
    @Column({ length: 255 })
    public title!: string;

    @Column({ length: 512 })
    public description!: string;

    @Column({ length: 255 })
    public author!: string;

    @Column({ length: 128 })
    public publisher!: string;

    @Column({ length: 5 })
    public language!: string;

    @Column({ length: 4 })
    public year!: string;

    @Column({ length: 255 })
    public fsReference!: string;

    // User defined
    @Column()
    public favourite!: boolean;

    @Column("int")
    public status!: BookStatus;

    // Misc
    @CreateDateColumn({ type: "timestamp" })
    public createdAt!: Date;

    // Relations
    @ManyToOne(() => User, (user) => (user as any).books)
    public user!: User;

    @ManyToOne(() => Shelf, (shelf) => (shelf as any).books)
    public shelf!: Shelf;
}
