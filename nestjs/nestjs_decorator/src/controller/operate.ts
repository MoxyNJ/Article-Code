import { Controller, Get, Head, Params } from "../decorator";

const log = require("debug")("controller::operate");

@Controller("operates")
export class OperateController {
    @Get()
    getAll(@Head() head: any, @Params("device") device: string, @Params() params: any) {
        log(`OperateController::getAll() - ${Reflect.getMetadata("root", this.constructor)} -- head:`, head, "device:", device, " params:", params);
        return [{ name: "operate_1" }, { name: "operate_2" }];
    }
}
