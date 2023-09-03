export type IRequestOption = {};

/** 网络请求格式 */
export type IRequest = {
    method: "get" | "post" | "delete" | "fetch"; // 网络请求
    route: string; // 路由地址
    option?: {
        head?: object; // 模拟请求头
        params?: object; // 请求携带参数
        others?: object; // 模拟无关数据
    };
};
