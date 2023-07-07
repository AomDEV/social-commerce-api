import { ApiProperty } from "@nestjs/swagger";
import { EPlatform } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class NumberFilter {
    @ApiProperty({required: false})
    @IsNumber()
    equals: number;

    @ApiProperty({required: false})
    @IsNumber()
    gte: number;

    @ApiProperty({required: false})
    @IsNumber()
    gt: number;

    @ApiProperty({required: false})
    @IsNumber()
    lte: number;

    @ApiProperty({required: false})
    @IsNumber()
    lt: number;
};
export class StringFilter {
    @ApiProperty({required: false})
    @IsString()
    contains: string;

    @ApiProperty({required: false})
    @IsString()
    equals?: string;
}

export class ProductFilterDTO {
    @ApiProperty({enum: EPlatform, required: false, default: EPlatform.FACEBOOK})
    @IsEnum(EPlatform)
    platform?: EPlatform;

    @ApiProperty({type: StringFilter, required: false, default: null})
    @ValidateNested()
    @IsOptional()
    title?: StringFilter;

    @ApiProperty({type: StringFilter, required: false, default: null})
    @ValidateNested()
    @IsOptional()
    description?: StringFilter;

    @ApiProperty({type: NumberFilter, required: false, default: null})
    @ValidateNested()
    @IsOptional()
    price?: NumberFilter;
}