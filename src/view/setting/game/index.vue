<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <SelectInput
          v-model="value2"
          :searchClear="searchClear"
          @close="searchClear = false"
        ></SelectInput>
        <el-form-item>
          <el-button type="success" icon="search" @click="onSubmit">
            {{ t("general.search") }}
          </el-button>
          <el-button icon="refresh" @click="onReset">
            {{ t("general.reset") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <h2>{{ t("tableColumn.Drag") }}</h2>
    <table :class="tableData.length === 1 ? 'tableWidth' : ''">
      <tbody>
        <tr v-for="(row, rowIndex) in mergedArray" :key="rowIndex">
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            draggable="true"
            @dragstart="onDragStart(rowIndex, cellIndex)"
            @dragover.prevent
            @drop="onDrop(rowIndex, cellIndex)"
            class="draggable-cell"
          >
            <em class="indexNum glowing-number" v-if="searchParams"
              >{{ indexVal }}
            </em>
            <em class="indexNum glowing-number" v-else
              >{{ rowIndex * 4 + cellIndex }}
            </em>
            <span style="padding: 0 10px">{{ cell }}</span>
            <em class="edit" @click="editTackFunc(cell)">
              {{ t("view.dictionary.sysDictionary.details") }}
              <el-icon class="icons"><ArrowRight /></el-icon>
            </em>
          </td>
        </tr>
      </tbody>
    </table>
    <el-drawer
      v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      size="40%"
      :before-close="closeDialog"
      :show-close="false"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ dialogTitle }}</span>
          <div>
            <el-button @click="closeDialog">
              {{ t("general.close") }}
            </el-button>
            <el-button type="primary" @click="enterDialog">
              {{ t("general.confirm") }}
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        class="myForm"
        ref="apiForm"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-row class="w-full">
          <el-col :span="20">
            <el-form-item :label="t('tableColumn.gameId')" prop="gameId">
              <el-input
                disabled
                v-model="form.gameId"
                autocomplete="off"
                @input="form.gameId = form.gameId.replace(/[^\d|]/g, '')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item :label="t('tableColumn.cnName')" prop="cnName">
              <el-input disabled v-model="form.cnName" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item :label="t('tableColumn.code')" prop="code">
              <el-input disabled v-model="form.code" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item :label="t('tableColumn.name')" prop="name">
              <el-input disabled v-model="form.name" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item :label="t('tableColumn.originId')">
              <el-select
                disabled
                v-model="form.originId"
                style="width: 100%"
                :placeholder="t('general.pleaseSelect')"
              >
                <el-option
                  v-for="item in completeOptions"
                  :key="item.value"
                  :label="t(`tableColumn.${item.label}`)"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item :label="t('tableColumn.typeId')">
              <el-select
                disabled
                v-model="form.typeId"
                style="width: 100%"
                :placeholder="t('general.pleaseSelect')"
              >
                <el-option
                  v-for="item in gameType"
                  :key="item.value"
                  :label="t(`tableColumn.${item.label}`)"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item :label="t('tableColumn.vendorId')" prop="vendorId">
              <el-input
                disabled
                v-model="form.vendorId"
                autocomplete="off"
                @input="form.vendorId = form.vendorId.replace(/[^\d|]/g, '')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item :label="t('tableColumn.status')" prop="enabled">
              <el-switch
                v-model="form.enabled"
                inline-prompt
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item :label="t('tableColumn.line')" prop="line">
              <el-select
                v-model="form.line"
                style="width: 100%"
                :placeholder="t('general.pleaseSelect')"
              >
                <el-option
                  v-for="item in lineOptions"
                  :key="item.value"
                  :label="t(`tableColumn.${item.label}`)"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item
              :label="t('tableColumn.realityLine')"
              prop="realityLine"
            >
              <el-select
                v-model="form.realityLine"
                style="width: 100%"
                :placeholder="t('general.pleaseSelect')"
              >
                <el-option
                  v-for="item in lineOptions"
                  :key="item.value"
                  :label="t(`tableColumn.${item.label}`)"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item :label="t('tableColumn.sort')" prop="sort">
              <el-input
                v-model="form.sort"
                autocomplete="off"
                @input="form.sort = form.sort.replace(/[^\d|]/g, '')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getGameList, setGameSort } from "@/api/game";
import SelectInput from "@/components/selectInput/selectInput.vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage

defineOptions({
  name: "game",
});
const form = ref({
  cnName: "",
  code: "",
  enabled: null,
  gameId: null,
  line: null,
  name: "",
  originId: null,
  realityLine: null,
  sort: null,
  typeId: null,
  vendorId: null,
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(1000000);
const searchInfo = ref({});
const value2 = ref({});
const indexVal = ref(0);
const searchClear = ref(false);
const searchParams = ref(false);

const completeOptions = ref([
  { value: 1, label: "skg" },
  { value: 2, label: "Malay" },
  { value: 3, label: "Shenzhen" },
  { value: 4, label: "activity" },
]);
const gameType = ref([
  { value: 1, label: "solt" },
  { value: 2, label: "fishing" },
  { value: 3, label: "blockchain" },
]);
const lineOptions = ref([
  { value: 0, label: "no" },
  { value: 1, label: "yes" },
]);

// 表格数据
const dialogTitle = ref(t("general.add"));
const dialogFormVisible = ref(false);
const result = ref([]);
const tableData = ref([]);
const mergedArray = ref([]);
const chunkedArray = ref([]);
const startDate = ref(null);
const endDate = ref(null);
const gameId = ref(null);
const num = ref(6); //每行个数
const apiForm = ref(null);

const getTableData = async () => {
  console.log(234679);
  searchInfo.value.code = value2.value.code;
  searchInfo.value.name = value2.value.name;
  indexVal.value = value2.value.index;

  const table = await getGameList({
    page: page.value,
    pageSize: pageSize.value,
    ...value2.value,
  });
  if (table.code === 0) {
    tableData.value = table.data.list;
    if (value2.value.code) {
      searchParams.value = true;
    } else {
      searchParams.value = false;
    }
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
    result.value = tableData.value.map((obj) => [obj.cnName]);
    chunkedArray.value = chunkArray(result.value, num.value);
    next();
  }
};
getTableData();

const onReset = () => {
  searchInfo.value = {};
  searchClear.value = true;
};
const onSubmit = () => {
  page.value = 1;
  pageSize.value = 1000000;
  getTableData();
};

const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size)); // 每次取出 size 个元素，合并成一个子数组
  }
  return result;
};
const next = () => {
  mergedArray.value = chunkedArray.value.map((item) => {
    return (item = item.reduce((acc, curr) => acc.concat(curr), []));
  });
};
// 拖拽的单元格位置
const draggingCell = ref({ rowIndex: null, cellIndex: null });

// 拖拽开始
const onDragStart = (rowIndex, cellIndex) => {
  startDate.value = mergedArray.value[rowIndex][cellIndex];
  draggingCell.value = { rowIndex, cellIndex };
};
// 拖拽放置
const onDrop = (targetRowIndex, targetCellIndex) => {
  const { rowIndex, cellIndex } = draggingCell.value;
  if (rowIndex !== null && cellIndex !== null) {
    // 交换单元格数据
    const temp = mergedArray.value[targetRowIndex][targetCellIndex];

    mergedArray.value[targetRowIndex][targetCellIndex] =
      mergedArray.value[rowIndex][cellIndex];
    mergedArray.value[rowIndex][cellIndex] = temp;
    endDate.value =
      Number(targetRowIndex) * num.value + Number(targetCellIndex);
    // 重置拖拽位置
    draggingCell.value = { rowIndex: null, cellIndex: null };
    tableData.value.forEach((item) => {
      if (item.cnName == startDate.value) {
        gameId.value = item.gameId;
        GameSort(item.gameId, endDate.value);
      }
    });
  }
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
  startDate.value = null;
  endDate.value = null;
  getTableData();
};

const initForm = () => {
  apiForm.value.resetFields();
  form.value = {
    cnName: "",
    code: "",
    enabled: null,
    gameId: null,
    line: null,
    name: "",
    originId: null,
    realityLine: null,
    sort: null,
    typeId: null,
    vendorId: null,
  };
};
const rules = ref({
  id: [{ required: true, message: "请输入id", trigger: "blur" }],
  type: [{ required: true, message: "请选择类型", trigger: "blur" }],
  desc: [{ required: true, message: "请输入desc", trigger: "blur" }],
  price: [{ required: true, message: "请输入价格", trigger: "blur" }],
  discount: [{ required: true, message: "请输入折扣", trigger: "blur" }],
  expired: [{ required: true, message: "请选择过期时间", trigger: "blur" }],
});

const editTackFunc = async (params) => {
  tableData.value.forEach((item) => {
    if (item.cnName == params) {
      form.value = item;
      openDialog("edit");
    }
  });
};

const openDialog = (key) => {
  switch (key) {
    case "edit":
      dialogTitle.value = t("general.edit");
      break;
    default:
      break;
  }
  dialogFormVisible.value = true;
};
const closeDialog = () => {
  initForm();
  dialogFormVisible.value = false;
};
const enterDialog = async () => {
  apiForm.value.validate(async (valid) => {
    if (valid) {
      form.value.gameId = Number(form.value.gameId);
      form.value.originId = Number(form.value.originId);
      form.value.sort = Number(form.value.sort);
      form.value.typeId = Number(form.value.typeId);
      form.value.vendorId = Number(form.value.vendorId);
      form.value.enabled = Number(form.value.enabled);
      const res = await setGameSort(form.value);
      if (res.code === 0) {
        ElMessage({
          type: "success",
          message: t("user.userEditedNote"),
          showClose: true,
        });
        getTableData();
        closeDialog();
      }
    }
  });
};
</script>

<style>
table {
  width: 100%;
  /* border-collapse: collapse; */
  border-collapse: separate;
}
.tableWidth {
  width: 400px !important;
}
th,
td {
  /* border: 1px solid #ccc; */
  padding: 8px;
  text-align: left;
}

.draggable-cell {
  cursor: move; /* 鼠标指针变为移动状态 */
  background-color: #f6f7fb;
  transition: background-color 0.3s;
  height: 50px;
  position: relative;
  width: 10%;
}

.draggable-cell:nth-child(odd) {
  background-color: #eeeae5;
}

.draggable-cell:nth-child(even) {
  background-color: #ffffff;
}

.draggable-cell:active {
  background-color: var(--el-warn-bgc-current);
}
.indexNum {
  font-weight: 700;
  font-size: 20px;
}
.edit {
  font-size: 12px;
  color: #409eff;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-40%);
}
.icons {
  vertical-align: middle;
  transform: translateY(-1px);
  font-size: 15px;
}

/* 鼠标悬浮时的动态边框光效 */
.draggable-cell:hover {
  z-index: 99999;
  animation: borderEffect 1s ease infinite;
}

/* 动态边框光效动画 */
@keyframes borderEffect {
  0% {
    border-color: transparent;
    box-shadow: 0 0 10px rgba(131, 218, 255, 0.7);
  }
  50% {
    border-color: #409eff;
    box-shadow: 0 0 20px rgba(131, 218, 255, 1),
      0 0 30px rgba(131, 218, 255, 0.8);
  }
  100% {
    border-color: transparent;
    box-shadow: 0 0 10px rgba(2131, 218, 255, 0.7);
  }
}
.glowing-number {
  font-size: 20px; /* Text size set to 20px */
  font-weight: bold;
  color: #fff; /* Text color */
  text-align: center;
  animation: glowing 1.5s infinite alternate;
  text-shadow: 0 0 1px #ff6347, 0 0 2px #ff6347, 0 0 3px #ff6347,
    0 0 4px #ff6347, 0 0 5px #ff6347;
}

/* Animation for glowing effect */
@keyframes glowing {
  0% {
    text-shadow: 0 0 1px #ff6347, 0 0 2px #ff6347, 0 0 3px #ff6347,
      0 0 4px #ff6347, 0 0 5px #ff6347;
    color: #ff6347; /* Initial light blue color */
  }
  50% {
    text-shadow: 0 0 2px #ff6347, 0 0 3px #ff6347, 0 0 5px #ff6347,
      0 0 6px #ff6347, 0 0 7px #ff6347;
    color: #a2dff7; /* Lighter blue color */
  }
  100% {
    text-shadow: 0 0 3px #ff6347, 0 0 5px #ff6347, 0 0 7px #ff6347,
      0 0 8px #ff6347, 0 0 10px #ff6347;
    color: #a9d6f2; /* Final lighter blue color */
  }
}
</style>