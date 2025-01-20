<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <!-- <el-form-item :label="t('tableColumn.accountId')">
          <el-input
            clearable
            v-model="searchInfo.accountId"
            :placeholder="t('tableColumn.accountId')"
            @blur="searchChange($event, 'accountId')"
          />
        </el-form-item> -->
        <DataTime
          v-model="value2"
          :showTime="true"
          :showTimes="showTimes"
          :paramsValue="paramsValue"
          @close="(paramsValue = false), (showTimes = false)"
        ></DataTime>
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

    <div class="gva-table-box">
      <el-table
        border
        ref="multipleTable"
        :data="tableData"
        @selection-change="handleSelectionChange"
        highlight-current-row
        :header-cell-style="{
          backgroundColor: 'var(--el-tab-bgc)',
          Color: '#FFF',
        }"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          align="center"
          min-width="100"
          :label="t('tableColumn.days')"
          prop="day"
        >
          <template #default="scope">
            <div>
              {{ dataGet(scope.row.day) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.items')"
          min-width="400"
          prop="items"
        >
          <template #default="scope">
            <!-- {{ scope.row.items }} -->
            <div
              v-for="(item, key, index) in scope.row.items"
              :key="index"
              class="spanZ"
            >
              <span class="span4" v-if="index > 0"></span>
              <div class="spanTitle">
                <span>{{ t(`tableColumn.code`) }}: </span>
                <span>{{
                  key == "diamond"
                    ? t(`tableColumn.diamond`)
                    : key == "gold_coin"
                    ? t(`tableColumn.gold_coin`)
                    : key
                }}</span>
              </div>
              <div
                v-for="(item1, key1, index1) in item"
                :key="index1"
                class="spanCla"
              >
                <span v-if="key1 != 'out'">{{
                  key1 == "in"
                    ? t(`tableColumn.in`) + ":"
                    : key1 == "out"
                    ? ""
                    : key1 == "inOut"
                    ? t(`tableColumn.inOut`) + ":"
                    : key1 == "origins"
                    ? t(`tableColumn.origins`) + ":"
                    : key1
                }}</span>
                <span v-if="key1 != 'out' && key1 != 'origins'">
                  <!-- {{ item1 }} -->
                  {{ handleChange(item1, index1, "v4", true) }}
                </span>
                <span v-if="key1 === 'origins'">
                  <span v-for="(item2, key2, index2) in item1" :key="index2">
                    <span
                      v-if="index2 > 0"
                      style="color: #ccc; vertical-align: top"
                    >
                      |
                    </span>
                    {{ t(`tableColumn.${key2}`) }}
                  </span>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="80"
          :label="t('tableColumn.bet')"
          prop="bet"
        >
        </el-table-column>
        <el-table-column
          align="center"
          min-width="80"
          :label="t('tableColumn.win')"
          prop="win"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="80"
          :label="t('tableColumn.winLoss')"
          prop="winLoss"
        >
          <template #default="scope">
            <div style="color: rgb(255, 0, 0)">
              {{ scope.row.winLoss }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          :label="t('general.operations')"
          min-width="100"
        >
          <template #default="scope">
            <el-button type="primary" size="small" @click="seeFunc(scope.row)">
              {{ t("general.see") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div> -->
    </div>
    <el-drawer
      v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      size="100%"
      append-to-body
      :before-close="closeDialog"
      :show-close="false"
      style="background-color: #f7f7f7"
      class="dra"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ dialogTitle }}</span>
          <div>
            <el-button @click="closeDialog">
              {{ t("components.commandMenu.close") }}
            </el-button>
          </div>
        </div>
      </template>

      <el-form class="myForm" ref="apiForm" :model="form" label-width="120px">
        <el-row class="w-full">
          <el-col :span="8">
            <el-form-item :label="t('tableColumn.days')">
              <el-input v-model="form.day" readonly autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="w-full">
          <el-col :span="8">
            <el-form-item :label="t('tableColumn.bet')">
              <el-input v-model="form.bet" readonly autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="w-full">
          <el-col :span="8">
            <el-form-item :label="t('tableColumn.win')">
              <el-input v-model="form.win" readonly autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="w-full">
          <el-col :span="8">
            <el-form-item :label="t('tableColumn.winLoss')">
              <el-input
                v-model="form.winLoss"
                readonly
                autocomplete="off"
                style="--el-input-text-color: red"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <template v-for="(item, key, index) in form.items" :key="index">
          <div class="nameKey">{{ key }}：</div>
          <div class="temple">
            <div v-for="(item1, key1, index1) in item" :key="index1">
              <div v-if="key1 !== 'origins'" class="temp1">
                <el-form-item :label="t(`tableColumn.${key1}`)">
                  <el-input v-model="item[key1]" readonly autocomplete="off" />
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="origin">
            <div v-for="(item1, key1, index1) in item" :key="index1">
              <div v-if="key1 === 'origins'">
                <el-table
                  :data="item[key1]"
                  border
                  style="width: 600px; margin-top: 20px"
                >
                  <el-table-column
                    prop="name"
                    align="center"
                    :label="t(`tableColumn.${key1}`)"
                    width="200"
                  />
                  <el-table-column
                    prop="in"
                    align="center"
                    :label="t(`tableColumn.in`)"
                    width="200"
                  />
                  <el-table-column
                    prop="out"
                    align="center"
                    :label="t(`tableColumn.out`)"
                    width="200"
                  />
                </el-table>
              </div>
            </div>
          </div>
        </template>
      </el-form>
    </el-drawer>
  </div>
</template>
  
  <script setup>
import { getItemOriginInOut } from "@/api/userInfo";
import { ElMessage } from "element-plus";
import { ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataTime from "@/components/DataTime/index.vue";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const router = useRouter();
const route = useRoute();

defineOptions({
  name: "userInfo",
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const searchInfo = ref({});
const dialogTitle = ref(t("view.dictionary.sysDictionary.details"));
const form = ref({});
const dialogFormVisible = ref(false);
const paramsValue = ref(false);
const showTimes = ref(false);
const value2 = ref([]);
const shortcuts = [
  {
    text: "Today",
    value: () => {
      const end = new Date();
      const start = new Date();
      return [start, end];
    },
  },
  {
    text: "Yesterday",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24);
      end.setTime(end.getTime() - 3600 * 1000 * 24);
      return [start, end];
    },
  },

  {
    text: "Last week",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "Last month",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "Last 3 months",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];

const handleDateChange = (params, index) => {
  if (index === 0) {
    let date = new Date(params);
    let formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0") +
      " " +
      "00" +
      ":" +
      "00" +
      ":" +
      "00";
    const dataTime = new Date(formattedDate).getTime();
    const myTime = new Date(dataTime);
    const isoDate = dayjs(myTime).format("YYYY-MM-DDTHH:mm:ssZ");
    searchInfo.value.start = isoDate;
  } else if (index === 1) {
    let date = new Date(params);
    let formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0") +
      " " +
      "23" +
      ":" +
      "59" +
      ":" +
      "59";
    const dataTime = new Date(formattedDate).getTime();
    const myTime = new Date(dataTime);
    const isoDate = dayjs(myTime).format("YYYY-MM-DDTHH:mm:ssZ");
    searchInfo.value.end = isoDate;
  }
};
const dataGet = (dateStr) => {
  let date = new Date(dateStr);
  let formattedDate =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0") +
    " ";
  return formattedDate;
};
const handleChange = (number, index, params, params2) => {
  if (params == "v4") {
    if (number >= 1000000000) {
      if (params2) {
        return number / 1000000000 + "B";
      } else {
        return (form.value.award[index].num = number / 1000000000 + "B");
      }
    } else if (number >= 1000000) {
      if (params2) {
        return number / 1000000 + "M";
      } else {
        return (form.value.award[index].num = number / 1000000 + "M");
      }
    } else if (number >= 1000) {
      if (params2) {
        return number / 1000 + "K";
      } else {
        return (form.value.award[index].num = number / 1000 + "K");
      }
    } else {
      if (params2) {
        return number.toString();
      } else {
        return (form.value.award[index].num = number.toString());
      }
    }
  }
};

const seeFunc = async (row) => {
  let rows = JSON.parse(JSON.stringify(row));
  rows.day = dataGet(rows.day);
  for (let key in rows.items) {
    for (let key1 in rows.items[key]) {
      if (typeof rows.items[key][key1] === "object") {
        const obj1 = Object.keys(rows.items[key][key1]);
        const obj2 = Object.values(rows.items[key][key1]);
        const obj3 = obj1.map((item, index) => {
          obj2[index].name = t(`tableColumn.${item}`);
          return obj2[index];
        });
        rows.items[key][key1] = obj3;
      }
    }
  }

  form.value = rows;
  dialogFormVisible.value = true;
};
const closeDialog = () => {
  initForm();
  dialogFormVisible.value = false;
};
const apiForm = ref(null);
const initForm = () => {
  apiForm.value.resetFields();
  form.value = {};
};

const searchChange = (e, params) => {
  if (params && e.target.value == "") {
    searchInfo.value[params] = null;
  }
  onSubmit();
};
const onReset = () => {
  searchInfo.value = {};
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const isoDate = now.toISOString();
  const now2 = new Date();
  now2.setHours(23, 59, 59, 999);
  const isoDate2 = now2.toISOString();
  const isoArr = [isoDate, isoDate2];
  const timeData = isoArr.map((item) => {
    return item;
  });

  value2.value = timeData;
  showTimes.value = true;
};
// 搜索

const onSubmit = () => {
  page.value = 1;
  pageSize.value = 10;
  getTableData();
};

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val;
  // getTableData();
};

const handleCurrentChange = (val) => {
  page.value = val;
  // getTableData();
};

// 查询
const getTableData = async () => {
  if (value2.value && value2.value.length) {
    searchInfo.value.start = value2.value[0];
    searchInfo.value.end = value2.value[1];
  } else {
    searchInfo.value.start = null;
    searchInfo.value.end = null;
    return ElMessage.warning(
      t("tableColumn.placeholder") + t("tableColumn.time")
    );
  }

  const table = await getItemOriginInOut({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    tableData.value = table.data;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};
const init = async () => {
  setTimeout(() => {
    getTableData();
  }, 10);
};
init();
// 批量操作
const handleSelectionChange = (val) => {
  if (val.length > 0) {
    let arr = [];
    val.forEach((item) => {
      arr.push(item.accountId);
    });
  }
};
const multipleTable = ref(null);

const tableRowClassName = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 0) {
    return "";
  } else {
    return "warnBg";
  }
};
watchEffect(() => {
  if (value2.value) {
    getTableData();
  }
});
</script>
  
<style scoped lang="scss">
.warning {
  color: #dc143c;
}
.myForm {
  width: 70%;
  padding-bottom: 50px;
  margin: auto;
}
.nameKey {
  color: #000;
  font-weight: 700;
  font-size: 16px;
  margin: 20px 0;
}
.nameKey1 {
  color: #999;
  font-weight: 600;
  font-size: 14px;
  // margin: 10px 0;
}
.temple {
  display: flex;
  justify-content: flex-start;
}

.temp1 {
  width: 100%;
}
.origin {
  width: calc(100% - 50px);
  padding-left: 50px;
  margin-bottom: 30px;
}
.pose {
  // margin-left: -50px;
  color: #666;
}
.myInput .el-input__inner {
  color: red;
}

.span1 {
  display: inline-block;
  width: 30%;
  text-align: right;
  vertical-align: top;
}
.span2 {
  display: inline-block;
  width: calc(69% - 8px);
  text-align: left;
  padding-left: 8px;
}
.span3 {
  font-weight: 700;
}
.span4 {
  display: block;
  border-bottom: 1px solid var(--border-color);
  width: 100%;
  margin: auto;
}
.spanZ {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.spanCla {
  // width: 50%;
  display: inline-block;
  margin-right: 20px;
}
.spanTitle {
  width: 100%;
}
.origin {
  & :deep(.el-table tr th .cell) {
    color: #333 !important;
  }
}
</style>
  