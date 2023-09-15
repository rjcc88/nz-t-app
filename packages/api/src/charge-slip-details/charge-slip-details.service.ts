import { PaginateOptions } from '@api/lib/interface';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { RoleService } from '@api/role/role.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ScmChargeslipDtl } from '@prisma/client';
import { CreateChargeSlipDetailDto } from './dto/create-charge-slip-detail.dto';
import { UpdateChargeSlipDetailDto } from './dto/update-charge-slip-detail.dto';

@Injectable()
export class ChargeSlipDetailsService {
  constructor(private role: RoleService, private prisma: PrismaService) {}
  async create(createChargeSlipDetailDto: CreateChargeSlipDetailDto) {
    return await this.prisma.scmChargeslipDtl.create({
      data: createChargeSlipDetailDto,
    });
  }

  async findAll({
    data,
    page,
    pageSize,
    pagination,
    order,
  }: PaginateOptions<
    Prisma.ScmChargeslipDtlWhereInput,
    Prisma.ScmChargeslipOrderByWithRelationInput
  >): Promise<ScmChargeslipDtl[] | any> {
    if (!pagination) {
      return this.prisma.scmChargeslipDtl.findMany({
        include: {
          scmChargeslip: true,
          scmItemDtl: true,
        },
        where: data,
        orderBy: order,
      });
    }
    const returnData = await this.prisma.$transaction([
      this.prisma.scmChargeslipDtl.count({
        where: data,
      }),
      this.prisma.scmChargeslipDtl.findMany({
        where: data,
        take: pageSize || 10,
        skip: (page - 1) * pageSize || 0,
        orderBy: order,
      }),
    ]);
    return returnData;
  }

  async findOne(id: string) {
    const data = await this.prisma.scmChargeslipDtl.findUnique({
      include: {
        scmChargeslip: true,
        scmItemDtl: true,
      },
      where: {
        id,
      },
    });
    if (!data)
      throw new NotFoundException(
        `Chargeslip detail with ${id} does not exist.`,
      );
    return data;
  }

  async update(
    id: string,
    updateChargeSlipDetailDto: UpdateChargeSlipDetailDto,
  ) {
    await this.findOne(id);
    const updatedData = this.prisma.scmChargeslipDtl.update({
      where: { id },
      data: updateChargeSlipDetailDto,
    });
    return updatedData;
  }

  remove(id: number) {
    return `This action removes a #${id} chargeSlipDetail`;
  }
}
