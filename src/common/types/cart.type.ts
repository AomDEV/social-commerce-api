import { EOrderStatus, Order, OrderProduct, Product, ProductPlatform } from "@prisma/client";

export type CartSession = {
    sessionId: string;
    products: CartSessionProduct[];
    status: EOrderStatus;
    createdAt: Date;
    updatedAt: Date;
};
export type CartSessionProduct = {
    productPlatformId: bigint;
    product: Product;
    discount: number;
    quantity: number;
};
export type OrderFullRelation = Order & {
    order_product: (
        OrderProduct & {
            platform: ProductPlatform & {
                product: Product
            }
        }
    )[]
};
