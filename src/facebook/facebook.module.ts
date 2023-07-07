import { Module, Provider } from "@nestjs/common";
import { FacebookController } from "./facebook.controller";
import { WebhookUsecase } from "./usecase/webhook.usecase";
import { IntegrateUsecase } from "./usecase/integrate.usecase";
import { FacebookService } from "./facebook.service";
import { PROVIDERS } from "./postback";
import { CartUsecase } from "@/order/usecase/cart.usecase";
import { PlatformService } from "@/platform/platform.service";

@Module({
    imports: [],
    controllers: [FacebookController],
    providers: ([
        PlatformService,
        FacebookService,
        WebhookUsecase,
        IntegrateUsecase,
        CartUsecase,
    ] as Provider[])
    .concat(PROVIDERS),
})
export class FacebookModule { }