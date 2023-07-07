import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller('lazada')
export class LazadaController {
    @Get()
    @ApiTags('Health-Check')
    index() {
        return { timestamp: new Date() };
    }
}