import { PrismaService } from "@/common/service/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductFilterDTO } from "@/product/dto/filter.dto";
import { EPlatform } from "@prisma/client";

@Injectable()
export class ReadUsecase {
    constructor (
        private readonly prismaService: PrismaService
    ) {}

    async getAll(filter: ProductFilterDTO = {}) {
        const where = {};

        if (filter.platform) where["platform"] = filter.platform as EPlatform;
        if (filter.title) where["product"]["title"] = filter.title;
        if (filter.description) where["product"]["description"] = filter.description;
        if (filter.price) where["product"]["price"] = filter.price;

        return this.prismaService.productPlatform.findMany({
            where: where,
            include: {
                product: true,
            }
        });
    }

    async getOne(id: number) {
        return this.prismaService.product.findUniqueOrThrow({
            where: {
                id: id
            }
        }).catch(e => {
            throw new NotFoundException()
        });
    }
}