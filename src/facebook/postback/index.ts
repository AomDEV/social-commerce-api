import { EActionPayload } from "@/common/types/payload.type";
import WelcomePostback from "./welcome.postback";
import GetStartedPostback from "./get-started.postback";
import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { Provider } from "@nestjs/common";
import TestPostback from "./test.postback";
import AddToCartPostback from "./add-to-cart.postback";
import ShowProductPostback from "./show-product.postback";
import ViewCartPostback from "./view-cart.postback";
import ConfirmOrderPostback from "./confirm-order.postback";
import CancelOrderPostback from "./cancel-order.postback";
import CreateOrderPostback from "./create-order.postback";
import NothingPostback from "./nothing.postback";
import OnOrderPaidPostback from "./on-confirm-paid.postback";

const POSTBACKS = {
    [EActionPayload._TEST]: TestPostback,
    [EActionPayload.NOTHING]: NothingPostback,
    [EActionPayload.GET_STARTED]: GetStartedPostback,
    [EActionPayload.WELCOME]: WelcomePostback,
    [EActionPayload.ADD_TO_CART]: AddToCartPostback,
    [EActionPayload.SHOW_PRODUCT]: ShowProductPostback,
    [EActionPayload.VIEW_CART]: ViewCartPostback,
    [EActionPayload.CONFIRM_ORDER]: ConfirmOrderPostback,
    [EActionPayload.CANCEL_ORDER]: CancelOrderPostback,
    [EActionPayload.CREATE_ORDER]: CreateOrderPostback,
    [EActionPayload.ON_ORDER_PAID]: OnOrderPaidPostback
} as unknown as Record<EActionPayload, IFacebookPostback>;
const PROVIDERS: Provider[] = Object.keys(POSTBACKS).map(key => POSTBACKS[key]);
export {
    POSTBACKS,
    PROVIDERS,
}