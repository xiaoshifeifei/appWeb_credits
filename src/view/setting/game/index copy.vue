<template>
  <div>
    <div class="gva-table-box">
      <el-table
        border
        ref="tabA"
        class="elTable"
        :data="dList"
        highlight-current-row
        :header-cell-style="{
          backgroundColor: 'var(--el-tab-bgc)',
          Color: '#FFF',
        }"
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="sort" fixed align="center" prop="sort">
          <template #default="scope">
            <div
              style="display: flex; align-items: center"
              :attrabc="scope.row.sort"
              class="attrabcccc"
            >
              <span style="margin-left: 10px">{{ scope.row.sort }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="gameId" fixed align="center" prop="gameId" />
        <el-table-column label="code" fixed align="center" prop="code" />
        <el-table-column label="cnName" fixed align="center" prop="cnName" />
        <el-table-column label="name" fixed align="center" prop="name" />
        <el-table-column label="enabled" fixed align="center" prop="enabled" />
        <el-table-column label="line" fixed align="center" prop="line" />
        <el-table-column
          label="originId"
          fixed
          align="center"
          prop="originId"
        />
        <el-table-column
          label="realityLine"
          fixed
          align="center"
          prop="realityLine"
        />
        <el-table-column label="typeId" fixed align="center" prop="typeId" />
        <el-table-column
          label="vendorId"
          fixed
          align="center"
          prop="vendorId"
        />
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="150px"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import Sortable from "sortablejs";
import { onMounted, ref } from "vue";
import { getGameList, setGameSort } from "@/api/game";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const initArr = ref([]);
const searchInfo = ref({});

const dList = ref([]);
const getTableData = async () => {
  const table = await getGameList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    initArr.value = table.data.list;
    dList.value = initArr.value.map((i) => i);
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
    initSort();
    forceReoderChild();
  }
};

const sortInstance = ref(null);
const tabA = ref(null);
const initSort = () => {
  const table = document.querySelector(
    ".elTable .el-table__body-wrapper tbody"
  );
  sortInstance.value = new Sortable(table, {
    group: "shared",
    animation: 150,
    ghostClass: "sortable-ghost", //拖拽样式
    easing: "cubic-bezier(1, 0, 0, 1)",
    store: null,
    draggable: ".el-table__row",
    onStart: (item) => {
      // console.log("onstart...");
      // console.log(sortInstance.value.toArray());
    },
    onSort: function (/**Event*/ evt) {
      // console.log("onsort...");
      // console.log(sortInstance.value.toArray());
    },
    // 结束拖动事件
    onEnd: (item) => {
      // console.log(item);
      console.log("oldIdx=" + item.oldIndex + ", newIdx=" + item.newIndex);
      console.log("initArr.value", initArr.value[item.oldIndex].gameId);
      GameSort(initArr.value[item.oldIndex].gameId, item.newIndex);
    },
  });
};
const GameSort = async (gameId, sort) => {
  const params = {
    gameId: gameId,
    sort: sort,
  };
  const res = await setGameSort(params);
  if (res.code === 0) {
    ElMessage({
      type: "success",
      message: t("user.userEditedNote"),
      showClose: true,
    });
  }
  initArr.value = [];
  getTableData();
};
// 强制原生排序;
const forceReoderChild = () => {
  // 找到所有 children
  const childCols = document.querySelectorAll(".attrabcccc");
  let sortArr = [];
  // 找到 list 的排序值，按这个值重新排序下这个 children
  // 举例： 2 3 1 4 7
  for (let i = 0; i < childCols.length; i++) {
    sortArr[i] = parseInt(childCols[i].attributes["attrabc"].value);
  }
  const sortedArr = sortArr
    .map((i) => i)
    .sort((a, b) => {
      return a < b ? -1 : a > b ? 1 : 0;
    });
  // 重新排序后找到真正的下标
  let sortedArrMap = {};
  sortedArr.forEach((item, idx) => {
    sortedArrMap[item] = idx;
  });

  // sortedArray 为最后排序好的数组
  let sortedArray = [];
  const rootEl = sortInstance.value.el;
  sortArr.forEach((item, idx) => {
    const idxOri = sortedArrMap[item];
    sortedArray[idxOri] = rootEl.children[idx];
  });

  // 删除原数组数据
  for (let i = 0; i < rootEl.children.length; i++) {
    rootEl.removeChild(rootEl.children[i]);
  }

  // 将排序好的数组 append 到 rootEl
  sortedArray.forEach((item, idx) => {
    rootEl.appendChild(item);
  });
};

const handleUpdate = (row) => {};

onMounted(() => {
  getTableData();
});
const tableRowClassName = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 0) {
    return "";
  } else {
    return "warnBg";
  }
};
</script>


<style scoped lang="scss">
.warning {
  color: #dc143c;
}
.el-input-number {
  width: 50%;
}
.span1 {
  display: inline-block;
  width: 50%;
  text-align: right;
}
.span2 {
  display: inline-block;
  width: calc(49% - 8px);
  text-align: left;
  padding-left: 8px;
}
.span3 {
  font-weight: 700;
}
.span4 {
  display: block;
  border-bottom: 1px solid var(--border-color);
  width: 50%;
  margin: auto;
}
.spanCla {
  display: inline-block;
  margin-right: 20px;
}
</style>
