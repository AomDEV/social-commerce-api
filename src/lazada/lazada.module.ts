import { Module } from "@nestjs/common";
import { LazadaController } from "./lazada.controller";
import { OAuthUsecase } from "../shopee/usecase/oauth.usecase";

@Module({
    imports: [],
    controllers: [LazadaController],
    providers: [],
})
export class LazadaModule { }