import {
    BaseEntity, Column, CreateDateColumn, Entity, ManyToOne,
    OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";
import { topicLimits } from "../validation/limits";
import { Shelf } from "./Shelf";
import { User } from "./User";

@Entity("topics")
export class Topic extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ length: topicLimits.title.max })
    public title!: string;

    @Column({ length: topicLimits.description.max })
    public description!: string;

    @CreateDateColumn({ type: "timestamp" })
    public createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    public updatedAt!: Date;

    @OneToMany(() => Shelf, (shelf) => (shelf as any).topic)
    public shelves!: Shelf[];

    @ManyToOne(() => User, (user) => (user as any).topics)
    public user!: User;
}
