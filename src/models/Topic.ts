import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Shelf } from "./Shelf";

@Entity("topics")
export class Topic extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ length: 255 })
    public title!: string;

    @Column({ length: 255 })
    public description!: string;

    @CreateDateColumn({ type: "timestamp" })
    public createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    public updatedAt!: Date;

    @OneToMany(() => Shelf, (shelf) => (shelf as any).topic)
    public shelves!: Shelf[];
}
