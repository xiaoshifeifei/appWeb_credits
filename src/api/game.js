import service from "@/utils/request";
// 获取游戏列表
export const getGameList = (params) => {
  return service({
    url: "/app/game/list",
    method: "get",
    params,
  });
};

// 游戏排序
export const setGameSort = (data) => {
  return service({
    url: "/app/game/setGameSort",
    method: "post",
    data,
  });
};
