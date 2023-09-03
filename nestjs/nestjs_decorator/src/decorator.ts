import "reflect-metadata";
const log = require("debug")("decorator");

/** Controller  类装饰器*/
export function Controller(root: string) {
    return (target: any) => {
        log("@Controller:", target);
        Reflect.defineMetadata("root", root, target);
    };
}

/** Get 方法装饰器 */
export function Get(route?: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        log("@Get:", route, target, propertyKey);

        if (!Reflect.getMetadata("handlersOfGet", target.constructor)) {
            Reflect.defineMetadata("handlersOfGet", [], target.constructor);
        }
        const handlersOfGet = Reflect.getMetadata("handlersOfGet", target.constructor);
        handlersOfGet.push({
            route: route ?? "",
            method: propertyKey,
        });

        const fn = descriptor.value;
        descriptor.value = function (...args: any[]) {
            let result = null;
            try {
                log("调用前逻辑----------", JSON.stringify(args), fn);
                const paramDef = Reflect.getMetadata(`paramFor${propertyKey}`, target.constructor);
                log("参数装饰器：", paramDef);
                const newArgs: any[] = [...args];
                if (paramDef?.length) {
                    paramDef.forEach((fieldName: string, index: number) => {
                        if (!!fieldName?.length) {
                            newArgs[index] = fieldName.length < 2 ? args[0]?.[fieldName[0]] : args[0]?.[fieldName[0]]?.[fieldName[1]];
                        }
                    });
                }
                result = fn.apply(this, newArgs);
            } catch (error) {
                console.log(error);
            } finally {
                log("调用后逻辑----------");
                return result;
            }
        };
    };
}

/** Post 方法装饰器 */
export function Post(route?: string) {
    return (target: any, propertyKey: string, _descriptor: PropertyDescriptor) => {
        log("@Post:", route, target, propertyKey);
        // todo...
    };
}

/** Head 参数装饰器 */
export function Head(fieldName?: string) {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        log("@Head", target, propertyKey, parameterIndex, fieldName);
        const paramsName = `paramFor${propertyKey}`;
        if (!Reflect.getMetadata(paramsName, target.constructor)) Reflect.defineMetadata(paramsName, [], target.constructor);
        const paramsArray = Reflect.getMetadata(paramsName, target.constructor);
        paramsArray[parameterIndex] = !fieldName ? ["head"] : ["head", fieldName];
    };
}

/** Params 参数装饰器 */
export function Params(fieldName?: string) {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        log("@Params", target, propertyKey, parameterIndex, fieldName);
        const paramsName = `paramFor${propertyKey}`;
        if (!Reflect.getMetadata(paramsName, target.constructor)) Reflect.defineMetadata(paramsName, [], target.constructor);
        const paramsArray = Reflect.getMetadata(paramsName, target.constructor);
        paramsArray[parameterIndex] = !fieldName ? ["params"] : ["params", fieldName];
    };
}
