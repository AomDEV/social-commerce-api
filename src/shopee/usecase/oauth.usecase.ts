import { Injectable } from "@nestjs/common";
import ShopeeClient from "shopee-client";

@Injectable()
export class OAuthUsecase {
    private readonly shopId: string;
    private readonly client: ShopeeClient;
    constructor() {
        this.shopId = process.env.SHOPEE_SHOP_ID;
        const partnerId = process.env.SHOPEE_PARTNER_ID;
        const partnerKey = process.env.SHOPEE_PARTNER_KEY;
        const validEnv = partnerId && partnerKey;
        this.client = validEnv ? new ShopeeClient({
            is_uat: false,
            shop_id: this.shopId,
            partner_id: partnerId,
            partner_key: partnerKey,
        }) : null;
    }

    buildRedirectUrl() {
        const redirectUrl = this.client.buildAuthURL();
        return {
            shopId: this.shopId,
            redirectUrl: redirectUrl,
        }
    }
}