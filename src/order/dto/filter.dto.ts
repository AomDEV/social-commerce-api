import { ApiProperty } from "@nestjs/swagger";
import { EOrderStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class FilterDTO {
    @ApiProperty({enum: EOrderStatus, default: EOrderStatus.PENDING, required: false})
    @IsEnum(EOrderStatus)
    @IsOptional()
    status: EOrderStatus;
}