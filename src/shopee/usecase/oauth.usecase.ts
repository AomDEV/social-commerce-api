import { Injectable } from "@nestjs/common";
import ShopeeClient from "shopee-client";

@Injectable()
export class OAuthUsecase {
    private readonly shopId: string;
    private readonly client: ShopeeClient;
    constructor() {
        this.shopId = process.env.SHOPEE_SHOP_ID;
        this.client = new ShopeeClient({
            is_uat: false,
            shop_id: this.shopId,
            partner_id: process.env.SHOPEE_PARTNER_ID,
            partner_key: process.env.SHOPEE_PARTNER_KEY,
        });
    }

    buildRedirectUrl() {
        const redirectUrl = this.client.buildAuthURL();
        return {
            shopId: this.shopId,
            redirectUrl: redirectUrl,
        }
    }
}