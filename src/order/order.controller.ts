import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ReadUsecase } from "./usecase/read.usecase";
import { CartUsecase } from "./usecase/cart.usecase";
import { AddToCartDTO, CheckoutDTO, ConfirmDTO } from "./dto/cart.dto";
import { FilterDTO } from "./dto/filter.dto";

@Controller('orders')
export class OrderController {
    constructor (
        private readonly readUsecase: ReadUsecase,
        private readonly cartUsecase: CartUsecase
    ) {}

    @Get()
    @ApiTags('Order')
    getAll(
        @Query() query?: FilterDTO
    ) {
        return this.readUsecase.getAll(query);
    }

    @Get(':id')
    @ApiTags('Order')
    getOne(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.readUsecase.getOne(id);
    }

    @Post('add-to-cart')
    @ApiTags('Order')
    addToCart(
        @Body() body: AddToCartDTO
    ) {
        return this.cartUsecase.addToCart(
            body.sessionId,
            body.productPlatformId,
            body.quantity
        );
    }

    @Post('remove-from-cart')
    @ApiTags('Order')
    removeFromCart(
        @Body() body: AddToCartDTO
    ) {
        return this.cartUsecase.removeFromCart(
            body.sessionId,
            body.productPlatformId,
            body.quantity
        );
    }

    @Post('checkout')
    @ApiTags('Order')
    checkout(
        @Body() body: CheckoutDTO
    ) {
        return this.cartUsecase.checkout(body);
    }

    @Post('confirm')
    @ApiTags('Order')
    confirm(
        @Body() body: ConfirmDTO
    ) {
        return this.cartUsecase.confirm(body);
    }
}