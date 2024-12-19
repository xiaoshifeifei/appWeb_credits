<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item :label="t('tableColumn.accountId')">
          <el-input
            clearable
            v-model="searchInfo.accountId"
            :placeholder="t('tableColumn.accountId')"
          />
        </el-form-item>
        <el-form-item :label="t('tableColumn.origin')">
          <el-select
            clearable
            v-model="searchInfo.origin"
            :placeholder="t('tableColumn.placeholder')"
          >
            <el-option
              v-for="item in originOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('tableColumn.code')">
          <el-select
            clearable
            v-model="searchInfo.code"
            :placeholder="t('tableColumn.placeholder')"
          >
            <el-option
              v-for="item in completeOptions"
              :key="item.code"
              :label="t(`tableColumn.${item.code}`)"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <DataTime
          v-model="value2"
          :paramsValue="paramsValue"
          @close="paramsValue = false"
        ></DataTime>
        <el-form-item>
          <el-button type="primary" icon="search" @click="onSubmit">
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
          min-width="90"
          :label="t('tableColumn.accountId')"
          prop="accountId"
        >
        </el-table-column>
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.siteId')"
          prop="siteId"
        >
        </el-table-column>
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.id')"
          prop="id"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.code')"
          min-width="90"
          prop="code"
        >
          <template #default="scope">
            {{
              scope.row.code == "diamond"
                ? t("tableColumn.diamond")
                : scope.row.code == "gold_coin"
                ? t("tableColumn.gold_coin")
                : scope.row.code
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.origin')"
          prop="origin"
        >
          <template #default="scope">
            <div>
              {{
                scope.row.origin == "collect"
                  ? t("tableColumn.collect")
                  : scope.row.origin == "day7sign"
                  ? t("tableColumn.day7sign")
                  : scope.row.origin == "advertise"
                  ? t("tableColumn.advertise")
                  : scope.row.origin == "inbox"
                  ? t("tableColumn.inbox")
                  : scope.row.origin == "mall"
                  ? t("tableColumn.mall")
                  : scope.row.origin == "mission"
                  ? t("tableColumn.mission")
                  : scope.row.origin == "present"
                  ? t("tableColumn.present")
                  : scope.row.origin == "timedReward"
                  ? t("tableColumn.timedReward")
                  : scope.row.origin == "wheelOfFortune"
                  ? t("tableColumn.wheelOfFortune")
                  : scope.row.origin == "levels"
                  ? t("tableColumn.levels")
                  : scope.row.origin
              }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          min-width="150"
          :label="t('tableColumn.num')"
          prop="num"
        >
          <template #default="scope">
            <div style="color: red">+{{ scope.row.num }}</div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.created')"
          prop="created"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.created) }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { getVirtualItemInList, getVirtualItemOriginList } from "@/api/userInfo";
import { virtualItemGetList } from "@/api/tack";
import DataTime from "@/components/DataTime/index.vue";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const route = useRoute();

defineOptions({
  name: "userInfo",
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const searchInfo = ref({});
const completeOptions = ref([]);
const originOptions = ref([]);
const value2 = ref([]);
const paramsValue = ref(false);

const onReset = () => {
  searchInfo.value = {};
  value2.value = [];
  paramsValue.value = true;
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
  getTableData();
};

const handleCurrentChange = (val) => {
  page.value = val;
  getTableData();
};
const handleChange = (number, index, params, params2) => {
  if (params === "v2") {
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
  } else if (params == "v4") {
    if (number >= 1000000000) {
      if (params2) {
        return number / 1000000000 + "B";
      } else {
        return (form.value.max = number / 1000000000 + "B");
      }
    } else if (number >= 1000000) {
      if (params2) {
        return number / 1000000 + "M";
      } else {
        return (form.value.max = number / 1000000 + "M");
      }
    } else if (number >= 1000) {
      if (params2) {
        return number / 1000 + "K";
      } else {
        return (form.value.max = number / 1000 + "K");
      }
    } else {
      if (params2) {
        return number.toString();
      } else {
        return (form.value.max = number.toString());
      }
    }
  }
};

// 查询
const getTableData = async () => {
  if (value2.value && value2.value.length) {
    searchInfo.value.start = value2.value[0];
    searchInfo.value.end = value2.value[1];
  } else {
    searchInfo.value.start = null;
    searchInfo.value.end = null;
  }

  const table = await getVirtualItemInList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    table.data.list.map((item, index) => {
      item.num = handleChange(item.num, index, "v4", true);
    });
    tableData.value = table.data.list;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};
const initPage = async () => {
  searchInfo.value.accountId = route.query.id;
  const itemData = await virtualItemGetList({
    page: page.value,
    pageSize: 9999,
  });
  if (itemData.code === 0) {
    completeOptions.value = itemData.data.list;
  }
  const origin = await getVirtualItemOriginList({
    page: page.value,
    pageSize: 9999,
  });
  if (origin.code === 0) {
    const data = origin.data.inOrigins.map((item) => {
      return { label: t(`tableColumn.${item}`), value: item };
    });
    originOptions.value = data;
  }
  getTableData();
};

initPage();
const dataGet = (dateStr) => {
  let date = new Date(dateStr);
  let formattedDate =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0") +
    " " +
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0") +
    ":" +
    date.getSeconds().toString().padStart(2, "0");
  return formattedDate;
};

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
</script>

<style scoped lang="scss">
.warning {
  color: #dc143c;
}
.myForm {
  padding-bottom: 50px;
}
</style>
  