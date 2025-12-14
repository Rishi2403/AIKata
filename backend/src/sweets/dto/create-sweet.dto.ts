import { IsString, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateSweetDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;
}