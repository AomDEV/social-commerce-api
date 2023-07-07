import { Type } from "@nestjs/common";
import { LazadaModule } from "@/lazada/lazada.module";
import { ShopeeModule } from "@/shopee/shopee.module";
import { FacebookModule } from "@/facebook/facebook.module";
import { ProductModule } from "@/product/product.module";
import { OrderModule } from "@/order/order.module";

export const API_MODULES: Array<Type<any>> = [
    LazadaModule,
    ShopeeModule,
    FacebookModule,
    ProductModule,
    OrderModule,
];