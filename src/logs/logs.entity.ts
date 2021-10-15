import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Log {

    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ nullable: true})
    name: string;

    @ApiProperty()
    @Column({ nullable: true})
    species: string;

    @ApiProperty()
    @Column({ nullable: true})
    gender: string;

    @ApiProperty()
    @Column({ nullable: true})
    digestion_period_in_hours: number;

    @ApiProperty()
    @Column({ nullable: true})
    herbivore: boolean;

    @ApiProperty()
    @Column({ nullable: true})
    location: string;    

    @ApiProperty()
    @Column({ nullable: true})
    park_id: number;

    @ApiProperty()
    @Column({ nullable: true})
    kind: string;

    @ApiProperty()
    @Column({ nullable: true})
    dinosaur_id: number;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    time: Date;
}