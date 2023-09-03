import { IRequest } from "./type";
import { UserController, OperateController } from "./controller";

const log = require("debug")("main");

/** Module */
class Module {
    public controllersList: any[] = [];
    constructor(ctrlClassList: any[]) {
        ctrlClassList.forEach((ctrlClass) => {
            this.controllersList.push(new ctrlClass());
        });
    }
}

/** 模拟网络请求 */
const requestsList: IRequest[] = [
    { method: "get", route: "users", option: { head: { token: "1111", app: "admin" }, params: { age: "18" } } },
    { method: "get", route: "users/vip", option: { head: { token: "2222", app: "shop" }, params: { age: "12", nickName: "mike" } } },
    { method: "get", route: "operates", option: { head: { token: "3333" }, params: { device: "GPT", id: 1 }, others: { id: "1" } } },
];

/** 初始化：获得一个 Module 实例 */
function initial() {
    // 传入所有需要注入的依赖
    return new Module([UserController, OperateController]);
}

/**
 *
 * @param controller 控制器 controller
 * @param req 响应对象 request
 * @param handlersMethod 不同的请求方法
 */
function matchMethod(controller: any, req: IRequest, handlersMethod: "handlersOfGet" | "handlersOfPost") {
    const handlers = Reflect.getMetadata(handlersMethod, controller.constructor);

    handlers?.forEach((handler: any) => {
        const rootRoute = Reflect.getMetadata("root", controller.constructor);
        const subRoute = handler.route ? `${rootRoute}/${handler.route}` : rootRoute;
        if (subRoute !== req.route) return;
        log("matching......", controller, rootRoute);
        const result = controller[handler.method](req.option);
        log("request result: ", result);
    });
}

/** 主函数 */
function main() {
    const m = initial();
    const controllers = m.controllersList;

    // 模拟正在发送网络请求
    requestsList.forEach((req: IRequest) => {
        log("--[request start]-------------", req.method, req.route);
        for (let controller of controllers) {
            switch (req.method) {
                case "get":
                    matchMethod(controller, req, "handlersOfGet");
                    break;
                case "post":
                    break;
                default:
                    break;
            }
        }
        log("--[request ended]-------------");
    });
}

main();
