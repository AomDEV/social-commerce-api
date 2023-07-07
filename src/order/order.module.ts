import { Module, Provider } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { ReadUsecase } from "./usecase/read.usecase";
import { CartUsecase } from "./usecase/cart.usecase";
import { FacebookService } from "@/facebook/facebook.service";
import { getProviders } from "@/platform/config";

@Module({
    controllers: [OrderController],
    providers: ([
        FacebookService,
        ReadUsecase,
        CartUsecase,
    ] as Provider[]).concat(getProviders()),
})
export class OrderModule {}