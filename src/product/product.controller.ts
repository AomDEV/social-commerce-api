import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ReadUsecase } from "./usecase/read.usecase";
import { ProductFilterDTO } from "./dto/filter.dto";
import { ProductQuantityDTO } from "./dto/update.dto";
import { UpdateUsecase } from "./usecase/update.usecase";

@Controller('products')
export class ProductController {
    constructor (
        private readonly readUsecase: ReadUsecase,
        private readonly updateUsecase: UpdateUsecase
    ) {}

    @Get()
    @ApiTags('Product')
    getAll() {
        return this.readUsecase.getAll();
    }

    @Post()
    @ApiTags('Product')
    getAllByFilter(
        @Body() body: ProductFilterDTO
    ) {
        return this.readUsecase.getAll(body);
    }

    @Get(':id')
    @ApiTags('Product')
    getOne(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.readUsecase.getOne(id);
    }

    @Patch(':id')
    @ApiTags('Product')
    updateQuantity(
        @Param('id', ParseIntPipe) productId: number,
        @Body() body: ProductQuantityDTO
    ) {
        return this.updateUsecase.updateQuantity(productId, body);
    }
}