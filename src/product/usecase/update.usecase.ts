import { Injectable } from "@nestjs/common";
import { ProductQuantityDTO } from "@/product/dto/update.dto";
import { PrismaService } from "@/common/service/prisma.service";
import { EPlatform } from "@prisma/client";

@Injectable()
export class UpdateUsecase {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async updateQuantity(productId: number, body: ProductQuantityDTO) {
        const findPlatform = await this.prismaService.productPlatform.findFirst({
            where: {
                product_id: productId,
                platform: body.platform as EPlatform,
            }
        });
        const upsert = this.prismaService.productPlatform.upsert({
            where: {
                id: findPlatform?.id ?? 0
            },
            create: {
                product_id: productId,
                platform: body.platform as EPlatform,
                discount: body.discount,
                reference: null,
                quantity: body.quantity,
            },
            update: {
                discount: body.discount,
                quantity: body.quantity,
            },
        });
        return upsert;
    }
}