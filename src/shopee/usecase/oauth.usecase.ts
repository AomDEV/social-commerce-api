import { Injectable } from "@nestjs/common";
import ShopeeClient from "shopee-client";

function getClient() {
    const shopId = process.env.SHOPEE_SHOP_ID;
    const partnerId = process.env.SHOPEE_PARTNER_ID;
    const partnerKey = process.env.SHOPEE_PARTNER_KEY;

    if(!shopId || !partnerId || !partnerKey) return null;
    if(typeof shopId !== "string" || typeof partnerId !== "string" || typeof partnerKey !== "string") return null;
    if(shopId.length <= 0 || partnerId.length <= 0 || partnerKey.length <= 0) return null;
    return new ShopeeClient({
        is_uat: false,
        shop_id: shopId,
        partner_id: partnerId,
        partner_key: partnerKey,
    });
}
@Injectable()
export class OAuthUsecase {
    private readonly shopId: string;
    private readonly client: ShopeeClient;
    constructor() {
        this.shopId = process.env.SHOPEE_SHOP_ID;
        this.client = getClient();
    }

    buildRedirectUrl() {
        const redirectUrl = this.client.buildAuthURL();
        return {
            shopId: this.shopId,
            redirectUrl: redirectUrl,
        }
    }
}