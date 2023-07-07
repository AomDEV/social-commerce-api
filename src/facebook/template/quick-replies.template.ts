import { EActionPayload } from "@/common/types/payload.type";

export function getConfirmQuickReply(confirmPayload: EActionPayload, cancelPayload: EActionPayload) {
    return [
        {
            content_type: "text",
            title: "✅ ยืนยัน",
            payload: confirmPayload
        },
        {
            content_type: "text",
            title: "❌ ยกเลิก",
            payload: cancelPayload
        }
    ];
}

export function getProductQuickReply() {
    return [
        {
            content_type: "text",
            title: "🛒 ดูตะกร้าของฉัน",
            payload: EActionPayload.VIEW_CART
        },
        {
            content_type: "text",
            title: "📦 ดูสินค้าทั้งหมด",
            payload: EActionPayload.SHOW_PRODUCT
        }
    ];
}

export function getCartQuickReply() {
    return [
        {
            content_type: "text",
            title: "💰 ยืนยันคำสั่งซื้อ",
            payload: EActionPayload.CONFIRM_ORDER
        },
        {
            content_type: "text",
            title: "❌ ยกเลิกคำสั่งซื้อ",
            payload: EActionPayload.CANCEL_ORDER
        },
        {
            content_type: "text",
            title: "📦 ดูสินค้าทั้งหมด",
            payload: EActionPayload.SHOW_PRODUCT
        }
    ];
}