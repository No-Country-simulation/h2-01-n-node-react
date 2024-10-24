import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('achievements')
export class Achievements {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    playerName: string;

    @Column()
    clubRanking: number;

    @Column()
    confederation: string;

    @Column()
    league: string;

    @Column()
    matchesPlayed: number;

    @Column()
    totalClubMatches: number;

    @Column()
    goals: number;

    @Column()
    assists: number;

    @Column()
    rating: number;
    }
