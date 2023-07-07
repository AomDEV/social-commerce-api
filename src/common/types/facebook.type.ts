export type FacebookOptions = {
    useVersion?: boolean;
    headers?: {[key: string]: string};
};

export enum EFacebookMenuItemType {
    POSTBACK = "postback",
    WEB_URL = "web_url",
}

export type FacebookAction = {
    type: EFacebookMenuItemType;
    title: string;
    payload?: string;
    url?: string;
};

export type FacebookGenericElement = {
    title: string;
    image_url: string;
    subtitle: string;
    default_action?: FacebookAction;
    buttons: FacebookAction[];
};

export type FacebookWebhookEvent = { [key: string]: any } & { metadata?: any; }