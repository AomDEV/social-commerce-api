import { IPlatform } from "@/common/interfaces/platform.interface";
import { FacebookService } from "@/facebook/facebook.service";
import { Provider } from "@nestjs/common";
import { EPlatform } from "@prisma/client";
import { PlatformService } from "./platform.service";
import { PROVIDERS as FACEBOOK_PROVIDERS } from "@/facebook/postback";

const INSTANCES = {
    [EPlatform.FACEBOOK]: FacebookService,
    [EPlatform.LAZADA]: null,
    [EPlatform.SHOPEE]: null,
} as unknown as Record<EPlatform, IPlatform>;
const getDependencies = () => ({
    [EPlatform.FACEBOOK]: FACEBOOK_PROVIDERS,
    [EPlatform.LAZADA]: [],
    [EPlatform.SHOPEE]: []
}) as unknown as Record<EPlatform, Provider[]>;
const getProviders = (): Provider[] => {
    const DEPENDENCIES = getDependencies();
    return Object.keys(INSTANCES).filter(x => INSTANCES[x]).map(key => INSTANCES[key])
        .concat(PlatformService)
        .concat(Object.keys(DEPENDENCIES).map(key => DEPENDENCIES[key]).flat())
        .filter(Boolean);
}
export {
    INSTANCES,
    getProviders,
}