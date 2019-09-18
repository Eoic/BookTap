// tslint:disable-next-line: max-line-length
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Book } from "./Book";
import { Topic } from "./Topic";

@Entity("shelves")
export class Shelf extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ length: 255 })
    public title!: string;

    @CreateDateColumn({ type: "timestamp" })
    public createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    public updatedAt!: Date;

    @ManyToOne(() => Topic, (topic) => (topic as any).shelves)
    public topic!: Topic;

    @OneToMany(() => Book, (book) => (book as any).shelf)
    public books!: Book[];
}
