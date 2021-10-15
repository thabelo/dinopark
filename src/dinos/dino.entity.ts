import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Dino {

    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    species: string;

    @ApiProperty()
    @Column()
    gender: string;

    @ApiProperty()
    @Column()
    digestion_period_in_hours: number;

    @ApiProperty()
    @Column()
    herbivore: boolean;

    @ApiProperty()
    @Column()
    location: string;    

    @ApiProperty()
    @Column()
    park_id: number;
}
