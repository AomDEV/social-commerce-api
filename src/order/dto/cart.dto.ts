import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class AddToCartDTO {
    @ApiProperty({default: "882389805304337"})
    @IsString()
    @IsNumberString()
    @MinLength(10)
    sessionId: string;

    @ApiProperty({default: 1})
    @IsNumber()
    @IsPositive()
    productPlatformId: number;
    
    @ApiProperty({default: 1})
    @IsNumber()
    @IsPositive()
    quantity: number;
}

export class CheckoutDTO {
    @ApiProperty({default: "882389805304337"})
    @IsString()
    @IsNumberString()
    @MinLength(10)
    sessionId: string;

    @ApiProperty({default: null,required: false})
    @IsString()
    @IsOptional()
    buyer?: string;
}

export class ConfirmDTO {
    @ApiProperty({ default: 1 })
    @IsNumber()
    orderId: number;

    @ApiProperty({ default: "Credit Card" })
    @IsString()
    paymentMethod: string;
}