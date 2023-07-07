import { IPlatform } from "@/common/interfaces/platform.interface";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { EPlatform } from "@prisma/client";
import { INSTANCES } from "./config";

@Injectable()
export class PlatformService {
    constructor(
        private readonly moduleRef: ModuleRef,
    ) {}

    getInstance(platform: EPlatform): IPlatform {
        const instance = INSTANCES[platform];
        if(!instance) throw new NotFoundException(`Platform ${platform} not found`);
        const module: IPlatform = this.moduleRef.get(instance as any);
        return module;
    }
}