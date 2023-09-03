import { Controller, Get, Head, Params } from "../decorator";

const log = require("debug")("controller::user");

@Controller("users")
export class UserController {
    @Get()
    getAll(@Head() head: string, @Params() params: any) {
        log(`UserController::getAll() - ${Reflect.getMetadata("root", this.constructor)} --, head: ${head}, params: ${params}`);
        return [
            { name: "Moxy_1", age: "12" },
            { name: "Moxy_2", age: "18" },
        ];
    }

    @Get("vip")
    getVip(@Head("token") token: string, @Head("app") app: string, @Params("nickName") nickName: string) {
        log(`UserController::getVip() - ${Reflect.getMetadata("root", this.constructor)} -- token: ${token}, app: ${app}, nickName:  ${nickName}`);
        return [
            { name: "Vip_1", age: "999" },
            { name: "Vip_2", age: "998" },
        ];
    }
}
