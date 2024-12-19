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
        <el-form-item :label="t('tableColumn.gameCode')">
          <!-- <el-input
            clearable
            v-model="searchInfo.gameCode"
            :placeholder="t('tableColumn.accountId')"
          /> -->
          <el-input
            clearable
            v-model="searchInfo.gameCode"
            placeholder="暂时只能搜索goldVolcano"
          />
        </el-form-item>
        <TimePickMinute
          v-model="value2"
          :paramsValue="paramsValue"
          @close="(paramsValue = false), (value2 = [])"
        ></TimePickMinute>
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
          :label="t('tableColumn.betId')"
          min-width="90"
          prop="betId"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.username')"
          min-width="90"
          prop="username"
        />
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.bet')"
          prop="bet"
        >
        </el-table-column>
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.win')"
          prop="win"
        >
        </el-table-column>
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.winLoss')"
          prop="winLoss"
        >
          <template #default="scope">
            <div>
              <span style="color: red !important">
                {{ scope.row.winLoss }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.balance')"
          prop="balance"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.features')"
          prop="features"
        >
          <template #default="scope">
            <div>
              {{ scope.row.features }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          min-width="150"
          :label="t('tableColumn.gameCode')"
          prop="gameCode"
        >
        </el-table-column>
        <el-table-column
          align="center"
          min-width="150"
          :label="t('tableColumn.mode')"
          prop="mode"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.time')"
          prop="time"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.time) }}</div>
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
import { betDetailGetList, getVirtualItemOriginList } from "@/api/userInfo";
import TimePickMinute from "@/components/DataTime/timePickMinute.vue";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
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

// 查询
const getTableData = async () => {
  if (value2.value && value2.value.length) {
    searchInfo.value.start = value2.value[0];
    searchInfo.value.end = value2.value[1];
  } else {
    searchInfo.value.start = null;
    searchInfo.value.end = null;
  }
  // searchInfo.value.gameCode = "goldVolcano";
  const table = await betDetailGetList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    tableData.value = table.data.list;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};
const initPage = async () => {
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
  