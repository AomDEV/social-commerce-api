import { EFacebookMenuItemType } from "@/common/types/facebook.type";
import { EActionPayload } from "@/common/types/payload.type";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsLocale, IsNumberString, IsOptional, IsString, IsUrl, MaxLength, ValidateNested } from "class-validator";

export class PayloadDTO {
    @ApiProperty({enum: EActionPayload})
    @IsEnum(EActionPayload)
    payload: EActionPayload;
}
export class GreetingDTO {
    @ApiProperty({default: "default"})
    @IsString()
    @IsLocale()
    locale: string;

    @ApiProperty({default: "Hello!"})
    @IsString()
    text: string;
}
export class IceBreakersDTO extends PayloadDTO {
    @ApiProperty({default: "ice_breakers"})
    @IsString()
    question: string;
}
export class CallToActionDTO extends PayloadDTO {
    @ApiProperty({enum: EFacebookMenuItemType, default: EFacebookMenuItemType.POSTBACK})
    @IsEnum(EFacebookMenuItemType)
    type: EFacebookMenuItemType;

    @ApiProperty({default: "call_to_action"})
    @IsString()
    @MaxLength(30)
    title: string;

    @ApiProperty({required: false, default: null})
    @IsString()
    @IsOptional()
    @IsUrl()
    url?: string;
}
export class PersistentMenuDTO {
    @ApiProperty({default: "default"})
    @IsString()
    @IsLocale()
    locale: string;

    @ApiProperty({type: [CallToActionDTO]})
    @ValidateNested({each: true})
    call_to_actions: CallToActionDTO[];
}
export class InstallDTO {
    @ApiProperty({default: "882389805304337"})
    @IsString()
    @IsNumberString()
    page_id: string;

    @ApiProperty({type: PayloadDTO})
    @ValidateNested()
    get_started: PayloadDTO;

    @ApiProperty({type: [GreetingDTO]})
    @ValidateNested({each: true})
    greeting: GreetingDTO[];

    @ApiProperty({type: [IceBreakersDTO]})
    @ValidateNested({each: true})
    ice_breakers: IceBreakersDTO[];

    @ApiProperty({type: [PersistentMenuDTO]})
    @ValidateNested({each: true})
    persistent_menu: PersistentMenuDTO[];
}