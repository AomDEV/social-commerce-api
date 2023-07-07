import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ReadUsecase } from "./usecase/read.usecase";
import { UpdateUsecase } from "./usecase/update.usecase";

@Module({
    imports: [],
    controllers: [ProductController],
    providers: [
        ReadUsecase,
        UpdateUsecase
    ],
})
export class ProductModule {}