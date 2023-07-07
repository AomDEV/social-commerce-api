import { CURRENCY_SHORT } from "@/common/constants/currency";
import { CartSession } from "@/common/types/cart.type";
import { Order } from "@prisma/client";

export function getReceiptTemplate(cart: CartSession, options: {
    recipient?: {first_name: string; last_name: string},
    order?: Order
} = {}) {

    return {
        template_type: "receipt",
        recipient_name: [options.recipient.first_name, options.recipient.last_name].join(" ") ?? "Guest",
        order_number: options.order.id ? String(options.order.id).padStart(8, '0') : cart.sessionId,
        currency: CURRENCY_SHORT,
        payment_method: options?.order?.payment_method ?? "Manual",
        timestamp: Math.floor(cart.createdAt.getTime() / 1000),
        summary: {
            total_cost: cart.products.reduce((total, item) => total + (
                (item.product.price.toNumber() - parseFloat(String(item.discount))) * parseInt(String(item.quantity))
            ), 0)
        },
        elements: cart.products.map(item => {
            return {
                title: item.product.title,
                subtitle: item.product.description,
                quantity: item.quantity,
                price: item.product.price.toNumber(),
                currency: CURRENCY_SHORT,
                image_url: item.product.image_uuid
            };
        }),

    };
}