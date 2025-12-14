import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { SearchSweetDto } from './dto/search-sweet.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PurchaseSweetDto } from './dto/purchase-sweet.dto';
import { RestockSweetDto } from './dto/restock-sweet.dto';

@Controller('api/sweets')
export class SweetsController {
  constructor(private readonly sweetsService: SweetsService) {}

  @Post()
  create(@Body() createSweetDto: CreateSweetDto) {
    return this.sweetsService.create(createSweetDto);
  }

  @Get()
  findAll() {
    return this.sweetsService.findAll();
  }

  @Get('search')
  search(@Query() searchSweetDto: SearchSweetDto) {
    return this.sweetsService.search(searchSweetDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sweetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSweetDto: UpdateSweetDto) {
    return this.sweetsService.update(id, updateSweetDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sweetsService.remove(id);
  }
  @Post(':id/purchase')
  purchase(
    @Param('id') id: string,
    @Body() purchaseSweetDto: PurchaseSweetDto,
  ) {
    return this.sweetsService.purchase(id, purchaseSweetDto);
  }

  @Roles(Role.ADMIN)
  @Post(':id/restock')
  restock(
    @Param('id') id: string,
    @Body() restockSweetDto: RestockSweetDto,
  ) {
    return this.sweetsService.restock(id, restockSweetDto);
  }
}