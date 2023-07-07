import { PrismaService } from "@/common/service/prisma.service";
import { CartSession, OrderFullRelation } from "@/common/types/cart.type";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { EOrderStatus } from "@prisma/client";
import { CheckoutDTO, ConfirmDTO } from "@/order/dto/cart.dto";
import { FacebookService } from "@/facebook/facebook.service";
import { PlatformService } from "@/platform/platform.service";
import { EActionPayload } from "@/common/types/payload.type";

@Injectable()
export class CartUsecase {
    private _session: CartSession[] = [];
    constructor (
        private readonly facebookService: FacebookService,
        private readonly prismaService: PrismaService,
        private readonly platformService: PlatformService
    ) {}

    private getSessionIndex(sessionId: string): number {
        return this._session.findIndex(session => session.sessionId === sessionId);
    }
    private getProductIndex(sessionId: string, productPlatformId: number): number {
        const sessionIndex = this.getSessionIndex(sessionId);
        if(sessionIndex < 0) throw new NotFoundException("Session not found");
        return this._session[sessionIndex].products.findIndex(
            product => product.productPlatformId.toString() === productPlatformId.toString()
        );
    }
    private async setProductQuantity(
        sessionId: string,
        productPlatformId: number,
        newQuantity: ((current: number) => number) | number,
    ) {
        const index = this.getSessionIndex(sessionId);
        if(index < 0) throw new NotFoundException("Session not found");
        let productIndex = this.getProductIndex(sessionId, productPlatformId);

        if(this._session[index].status !== EOrderStatus.PENDING) throw new ForbiddenException("Order is not available");
        if(productIndex < 0) {
            const info = await this.prismaService.productPlatform.findUnique({
                where: {
                    id: BigInt(productPlatformId)
                },
                select: {
                    product: true,
                    discount: true,
                }
            });
            this._session[index].products.push({
                productPlatformId: BigInt(productPlatformId),
                discount: info.discount.toNumber(),
                product: info.product,
                quantity: 0,
            });
        }
        productIndex = this.getProductIndex(sessionId, productPlatformId);

        const currentQuantity = this._session[index].products[productIndex]?.quantity ?? 0;
        this._session[index].products[productIndex].quantity = typeof newQuantity === "number" ? newQuantity : newQuantity(currentQuantity);
        const afterQuantity = this._session[index].products[productIndex].quantity;
        if(afterQuantity <= 0) this._session.splice(index, 1);
        return this._session[index];
    }

    async addToCart(
        sessionId: string,
        productPlatformId: number,
        quantity: number
    ) {
        if(!productPlatformId || !quantity) throw new NotFoundException("Product not found");
        const info = await this.prismaService.productPlatform.findUnique({
            where: {
                id: BigInt(productPlatformId)
            },
            select: {
                product: true,
                discount: true,
            }
        });
        if(this.getSessionIndex(sessionId) < 0) this._session.push({
            sessionId: sessionId,
            products: [
                {
                    productPlatformId: BigInt(productPlatformId),
                    product: info.product,
                    discount: info.discount.toNumber(),
                    quantity: 0,
                }
            ],
            status: EOrderStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return this.setProductQuantity(
            sessionId,
            productPlatformId,
            (current) => current + quantity
        );
    }

    async removeFromCart(
        sessionId: string,
        productPlatformId: number,
        quantity: number
    ) {
        return this.setProductQuantity(
            sessionId,
            productPlatformId,
            (current) => current - quantity
        );
    }

    async checkout(body: CheckoutDTO) {
        const sessionIndex = this.getSessionIndex(body.sessionId);
        if(sessionIndex < 0) throw new NotFoundException("Session not found");

        const sessionProducts = this._session[sessionIndex].products;
        if(sessionProducts.length <= 0) throw new NotFoundException("Cart is empty");

        const productsInfo = await this.prismaService.productPlatform.findMany({
            where: {
                id: {
                    in: sessionProducts.map(product => BigInt(product.productPlatformId))
                }
            },
            include: {
                product: true,
            }
        });

        let total: number = 0;
        let discount: number = 0;
        let net: number = 0;
        for (const productInfo of productsInfo) {
            const cartQuantity = sessionProducts.find(
                product => BigInt(product.productPlatformId) === BigInt(productInfo.id)
            )?.quantity ?? 0;
            if(cartQuantity <= 0) continue;

            const _total = cartQuantity * productInfo.product.price.toNumber();
            const _net = cartQuantity * (productInfo.product.price.toNumber() - productInfo.discount.toNumber());

            total += _total;
            discount += _total - _net;
            net += _net;
        }

        return this.prismaService.order.create({
            data: {
                buyer: body.buyer,
                status: EOrderStatus.PENDING,
                platform: productsInfo[0].platform,
                total: total,
                discount: discount,
                net: net,
                order_product: {
                    createMany: {
                        data: sessionProducts.map(product => ({
                            product_id: BigInt(product.productPlatformId),
                            quantity: product.quantity,
                        }))
                    }
                }
            },
            include: {
                order_product: {
                    include: {
                        platform: true,
                    }
                }
            }
        });
    }

    async cancelCart(sessionId: string) {
        const index = this.getSessionIndex(sessionId);
        if(index < 0) throw new NotFoundException("Session not found");
        delete this._session[index];
        return this._session[index];
    }

    async getCartInfo(sessionId: string) {
        return this._session.find(session => session?.sessionId === sessionId);
    }

    async confirm(body: ConfirmDTO) {
        const order = await this.prismaService.order.findUnique({
            where: {
                id: BigInt(body.orderId)
            },
        });
        if(!order) throw new NotFoundException("Order not found");
        if(order.status !== EOrderStatus.PENDING) throw new ForbiddenException("Order is not available");
        const updated = await this.prismaService.order.update({
            where: {
                id: BigInt(body.orderId)
            },
            data: {
                status: EOrderStatus.PAID,
                payment_method: body.paymentMethod,
            },
            include: {
                order_product: {
                    include: {
                        platform: {
                            include: {
                                product: true
                            }
                        },
                    }
                },
            }
        });
        if(updated.status !== EOrderStatus.PAID) throw new ForbiddenException("Order is not available");
        
        const instance = this.platformService.getInstance(updated.platform);
        if(!instance) throw new NotFoundException("Platform not found");
        return instance.notify(updated.buyer, EActionPayload.ON_ORDER_PAID, updated);
    }

    orderToCart(order: OrderFullRelation): CartSession {
        return {
            sessionId: null,
            products: order.order_product.map(info => ({
                productPlatformId: info.platform.id,
                product: info.platform.product,
                discount: info.platform.discount.toNumber(),
                quantity: info.quantity,
            })),
            status: order.status,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
        };
    }
}