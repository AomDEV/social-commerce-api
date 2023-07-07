import { ApiProperty } from "@nestjs/swagger";
import { EPlatform } from "@prisma/client";
import { IsEnum, IsNumber, IsPositive, Min } from "class-validator";

export class ProductQuantityDTO {
    @ApiProperty({enum: EPlatform})
    @IsEnum(EPlatform)
    platform: EPlatform;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    discount: number;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    quantity: number;
}