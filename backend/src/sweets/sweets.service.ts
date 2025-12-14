import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { SearchSweetDto } from './dto/search-sweet.dto';
// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class SweetsService {
  constructor(private prisma: PrismaService) {}

  async create(createSweetDto: CreateSweetDto) {
    return this.prisma.sweet.create({
      data: createSweetDto,
    });
  }

  async findAll() {
    return this.prisma.sweet.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async search(searchSweetDto: SearchSweetDto) {
    const { name, category, minPrice, maxPrice } = searchSweetDto;

    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (category) {
      where.category = {
        contains: category,
        mode: 'insensitive',
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    return this.prisma.sweet.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const sweet = await this.prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet) {
      throw new NotFoundException(`Sweet with ID ${id} not found`);
    }

    return sweet;
  }

  async update(id: string, updateSweetDto: UpdateSweetDto) {
    // Check if sweet exists
    await this.findOne(id);

    return this.prisma.sweet.update({
      where: { id },
      data: updateSweetDto,
    });
  }

  async remove(id: string) {
    // Check if sweet exists
    await this.findOne(id);

    return this.prisma.sweet.delete({
      where: { id },
    });
  }
async purchase(id: string, purchaseSweetDto: { quantity: number }) {
    const sweet = await this.findOne(id);

    // Check if sufficient quantity is available
    if (sweet.quantity < purchaseSweetDto.quantity) {
      throw new BadRequestException('Insufficient quantity available');
    }

    // Decrease the quantity
    const newQuantity = sweet.quantity - purchaseSweetDto.quantity;

    return this.prisma.sweet.update({
      where: { id },
      data: { quantity: newQuantity },
    });
  }

  async restock(id: string, restockSweetDto: { quantity: number }) {
    const sweet = await this.findOne(id);

    // Increase the quantity
    const newQuantity = sweet.quantity + restockSweetDto.quantity;

    return this.prisma.sweet.update({
      where: { id },
      data: { quantity: newQuantity },
    });
  }
}