import axios from "axios";
import { FacebookOptions } from "@/common/types/facebook.type";

export function FB(options: FacebookOptions = {}) {
    const useVersion = typeof options.useVersion === "undefined" || options.useVersion === true;
    const version = useVersion ? process.env.FACEBOOK_GRAPH_VERSION : "";
    const client = axios.create({
        baseURL: `${process.env.FACEBOOK_GRAPH_API_URL}/${version}`,
        timeout: 5000,
        headers: options.headers ?? {}
    });
    return client;
}