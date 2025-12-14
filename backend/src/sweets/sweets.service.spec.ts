import { Test, TestingModule } from '@nestjs/testing';
import { SweetsService } from './sweets.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SweetsService', () => {
  let service: SweetsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    sweet: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SweetsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SweetsService>(SweetsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new sweet', async () => {
      const createDto = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 100,
      };

      const createdSweet = {
        id: '1',
        ...createDto,
        createdAt: new Date(),
      };

      mockPrismaService.sweet.create.mockResolvedValue(createdSweet);

      const result = await service.create(createDto);

      expect(result).toEqual(createdSweet);
      expect(mockPrismaService.sweet.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of sweets', async () => {
      const sweets = [
        {
          id: '1',
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.5,
          quantity: 100,
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Gummy Bears',
          category: 'Gummy',
          price: 1.5,
          quantity: 200,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(sweets);

      const result = await service.findAll();

      expect(result).toEqual(sweets);
      expect(mockPrismaService.sweet.findMany).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should search sweets by name', async () => {
      const searchDto = { name: 'Chocolate' };
      const sweets = [
        {
          id: '1',
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.5,
          quantity: 100,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(sweets);

      const result = await service.search(searchDto);

      expect(result).toEqual(sweets);
    });

    it('should search sweets by category', async () => {
      const searchDto = { category: 'Gummy' };
      const sweets = [
        {
          id: '2',
          name: 'Gummy Bears',
          category: 'Gummy',
          price: 1.5,
          quantity: 200,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(sweets);

      const result = await service.search(searchDto);

      expect(result).toEqual(sweets);
    });

    it('should search sweets by price range', async () => {
      const searchDto = { minPrice: 1, maxPrice: 2 };
      const sweets = [
        {
          id: '2',
          name: 'Gummy Bears',
          category: 'Gummy',
          price: 1.5,
          quantity: 200,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(sweets);

      const result = await service.search(searchDto);

      expect(result).toEqual(sweets);
    });
  });

  describe('findOne', () => {
    it('should return a sweet by id', async () => {
      const sweet = {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 100,
        createdAt: new Date(),
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(sweet);

      const result = await service.findOne('1');

      expect(result).toEqual(sweet);
    });

    it('should throw NotFoundException if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a sweet', async () => {
      const updateDto = { price: 3.0 };
      const updatedSweet = {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 3.0,
        quantity: 100,
        createdAt: new Date(),
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(updatedSweet);
      mockPrismaService.sweet.update.mockResolvedValue(updatedSweet);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(updatedSweet);
    });

    it('should throw NotFoundException if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.update('999', { price: 3.0 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a sweet', async () => {
      const sweet = {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 100,
        createdAt: new Date(),
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(sweet);
      mockPrismaService.sweet.delete.mockResolvedValue(sweet);

      const result = await service.remove('1');

      expect(result).toEqual(sweet);
    });

    it('should throw NotFoundException if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
  describe('purchase', () => {
    it('should decrease quantity when purchasing', async () => {
      const sweet = {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 100,
        createdAt: new Date(),
      };

      const updatedSweet = {
        ...sweet,
        quantity: 95,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(sweet);
      mockPrismaService.sweet.update.mockResolvedValue(updatedSweet);

      const result = await service.purchase('1', { quantity: 5 });

      expect(result.quantity).toBe(95);
      expect(mockPrismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { quantity: 95 },
      });
    });

    it('should throw BadRequestException if quantity is insufficient', async () => {
      const sweet = {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 3,
        createdAt: new Date(),
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(sweet);

      await expect(service.purchase('1', { quantity: 5 })).rejects.toThrow(
        'Insufficient quantity available',
      );
    });

    it('should throw BadRequestException if quantity is zero', async () => {
      const sweet = {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 0,
        createdAt: new Date(),
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(sweet);

      await expect(service.purchase('1', { quantity: 1 })).rejects.toThrow(
        'Insufficient quantity available',
      );
    });

    it('should throw NotFoundException if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.purchase('999', { quantity: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('restock', () => {
    it('should increase quantity when restocking', async () => {
      const sweet = {
        id: '1',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 50,
        createdAt: new Date(),
      };

      const updatedSweet = {
        ...sweet,
        quantity: 100,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(sweet);
      mockPrismaService.sweet.update.mockResolvedValue(updatedSweet);

      const result = await service.restock('1', { quantity: 50 });

      expect(result.quantity).toBe(100);
      expect(mockPrismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { quantity: 100 },
      });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.restock('999', { quantity: 50 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});