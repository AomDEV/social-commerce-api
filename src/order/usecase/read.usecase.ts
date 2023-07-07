import { PrismaService } from "@/common/service/prisma.service";
import { CartSessionProduct, OrderFullRelation } from "@/common/types/cart.type";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ReadUsecase {
    constructor (
        private readonly prismaService: PrismaService
    ) {}

    parseOrder(
        order: OrderFullRelation
    ) {
        const response = {
            ...order,
            order_product: undefined,
            products: order.order_product.map(product => ({
                ...product.platform.product,
                quantity: product.quantity,
            })),
            total_cost: order.net.toNumber(),
        }
        return response;
    }

    async getAll(filter: object = {}) {
        const result = await this.prismaService.order.findMany({
            where: {
                order_product: {
                    every: {
                        quantity: {
                            gt: 0
                        }
                    }
                },
                ...filter
            },
            include: {
                order_product: {
                    include: {
                        platform: {
                            include: {
                                product: true,
                            }
                        }
                    }
                }
            }
        });
        return result.map(this.parseOrder);
    }

    async getOne(id: number) {
        const result = await this.prismaService.order.findFirstOrThrow({
            where: {
                id: id,
                order_product: {
                    every: {
                        quantity: {
                            gt: 0
                        }
                    }
                }
            },
            include: {
                order_product: {
                    include: {
                        platform: {
                            include: {
                                product: true,
                            }
                        }
                    }
                }
            },
            
        }).catch(e => {
            throw new NotFoundException();
        });
        return this.parseOrder(result);
    }
}