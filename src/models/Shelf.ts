// tslint:disable-next-line: max-line-length
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { shelfLimits } from "../validation/limits";
import { Book } from "./Book";
import { Topic } from "./Topic";
import { User } from "./User";

@Entity("shelves")
export class Shelf extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    // User defined
    @Column({ length: shelfLimits.title.max })
    public title!: string;

    @Column({ length: shelfLimits.description.max })
    public description!: string;

    // Misc
    @CreateDateColumn({ type: "timestamp" })
    public createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    public updatedAt!: Date;

    // Relations
    @ManyToOne(() => Topic, (topic) => (topic as any).shelves, { onDelete: "SET NULL", nullable: true })
    public topic!: Topic | null;

    @ManyToOne(() => User, (user) => (user as any).shelves, { onDelete: "CASCADE" })
    public user!: User;

    @OneToMany(() => Book, (book) => (book as any).shelf)
    public books!: Book[];
}
