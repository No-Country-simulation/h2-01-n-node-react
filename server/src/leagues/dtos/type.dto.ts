import { IsNotEmpty, IsString } from 'class-validator';

export class LeagueTypeDTO {
  @IsString()
  @IsNotEmpty()
  type: string;

  constructor(type: string) {
    this.type = this.capitalize(type);
  }

  private capitalize(input: string): string {
    const trimmedInput = input.trim();
    return (
      trimmedInput.charAt(0).toUpperCase() + trimmedInput.slice(1).toLowerCase()
    );
  }
}
