import { IsNotEmpty, IsString } from 'class-validator';

// TODO: fix case "El-Salvador"
export class CountryNameDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(name: string) {
    this.name = this.capitalize(name);
  }

  private capitalize(input: string): string {
    return input
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('-');
  }
}
