import { IsNumber, IsPositive, Min } from 'class-validator';

export class RestockSweetDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}