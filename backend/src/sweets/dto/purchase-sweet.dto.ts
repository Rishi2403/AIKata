import { IsNumber, IsPositive, Min } from 'class-validator';

export class PurchaseSweetDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}