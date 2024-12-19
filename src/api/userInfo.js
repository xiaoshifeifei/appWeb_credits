import service from "@/utils/request";
// 获取用户列表
export const getUserList = (params) => {
  return service({
    url: "/app/user/list",
    method: "get",
    params,
  });
};

// 用户设置
export const setUserInfo = (data) => {
  return service({
    url: "/user/edit",
    method: "post",
    data,
  });
};

// 获取宝箱列表
export const getTackList = (params) => {
  return service({
    url: "/config/mission/get",
    method: "get",
    params,
  });
};
// 宝箱新增
export const createTack = (data) => {
  return service({
    url: "/config/mission/add",
    method: "post",
    data,
  });
};
// 宝箱编辑
export const updateTack = (data) => {
  return service({
    url: "/config/mission/edit",
    method: "post",
    data,
  });
};
// 宝箱删除
export const deleteTack = (data) => {
  return service({
    url: "/config/mission/del",
    method: "post",
    data,
  });
};

export const sendMailGo = (data) => {
  return service({
    url: "/app/inbox/send",
    method: "post",
    data,
  });
};

// 获取日常/周常列表
export const dailyOrWeeklyGet = (params) => {
  return service({
    url: "/config/mission/dailyOrWeeklyGet",
    method: "get",
    params,
  });
};
// 日常/周常新增
export const dailyOrWeeklyAdd = (data) => {
  return service({
    url: "/config/mission/dailyOrWeeklyAdd",
    method: "post",
    data,
  });
};
// 日常/周常删除
export const dailyOrWeeklyDel = (data) => {
  return service({
    url: "/config/mission/dailyOrWeeklyDel",
    method: "post",
    data,
  });
};

//用户物品统计
export const getUserItemInOut = (params) => {
  return service({
    url: "/app/statistics/userItemInOut",
    method: "get",
    params,
  });
};

//物品来源消耗统计
export const getItemOriginInOut = (params) => {
  return service({
    url: "/app/statistics/itemOriginInOut",
    method: "get",
    params,
  });
};

//商城商品购买记录列表
export const getMallDaySales = (params) => {
  return service({
    url: "/app/statistics/mallDaySales",
    method: "get",
    params,
  });
};

//用户留存
export const getAccountRetained = (params) => {
  return service({
    url: "/app/user/retained",
    method: "get",
    params,
  });
};

// 获取用户物品获得记录列表
export const getVirtualItemInList = (params) => {
  return service({
    url: "/app/user/virtualItemInList",
    method: "get",
    params,
  });
};
// 获取用户物品获得记录列表
export const getVirtualItemOutList = (params) => {
  return service({
    url: "/app/user/virtualItemOutList",
    method: "get",
    params,
  });
};
// 获取来源列表
export const getVirtualItemOriginList = (params) => {
  return service({
    url: "/app/common/virtualItemOriginList",
    method: "get",
    params,
  });
};

// 下注记录列表
export const betDetailGetList = (params) => {
  return service({
    url: "/app/user/betDetail",
    method: "get",
    params,
  });
};

// @Tags Api
// @Summary 更新api
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body api.CreateApiParams true "更新api"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /api/updateApi [post]
export const updateApi = (data) => {
  return service({
    url: "/api/updateApi",
    method: "post",
    data,
  });
};

// @Tags Api
// @Summary 更新api
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body api.CreateApiParams true "更新api"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /api/setAuthApi [post]
export const setAuthApi = (data) => {
  return service({
    url: "/api/setAuthApi",
    method: "post",
    data,
  });
};

// @Tags Api
// @Summary 获取所有的Api 不分页
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /api/getAllApis [post]
export const getAllApis = (data) => {
  return service({
    url: "/api/getAllApis",
    method: "post",
    data,
  });
};

// @Tags SysApi
// @Summary 删除选中Api
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "ID"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /api/deleteApisByIds [delete]
export const deleteApisByIds = (data) => {
  return service({
    url: "/api/deleteApisByIds",
    method: "delete",
    data,
  });
};

// FreshCasbin
// @Tags      SysApi
// @Summary   刷新casbin缓存
// @accept    application/json
// @Produce   application/json
// @Success   200   {object}  response.Response{msg=string}  "刷新成功"
// @Router    /api/freshCasbin [get]
export const freshCasbin = () => {
  return service({
    url: "/api/freshCasbin",
    method: "get",
  });
};

export const syncApi = () => {
  return service({
    url: "/api/syncApi",
    method: "get",
  });
};

export const getApiGroups = () => {
  return service({
    url: "/api/getApiGroups",
    method: "get",
  });
};

export const ignoreApi = (data) => {
  return service({
    url: "/api/ignoreApi",
    method: "post",
    data,
  });
};

export const enterSyncApi = (data) => {
  return service({
    url: "/api/enterSyncApi",
    method: "post",
    data,
  });
};
