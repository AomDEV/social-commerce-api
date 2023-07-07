import { EActionPayload } from "@/common/types/payload.type";

export interface IPlatform {
    notify<T>(recipient: string, payload: EActionPayload, metadata: T): Promise<T>;
}