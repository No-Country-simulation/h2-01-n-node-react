import { IsNotEmpty, IsString } from 'class-validator';

export class CountryNameDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(name: string) {
    this.name = this.capitalize(name);
  }

  private capitalize(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }
}
