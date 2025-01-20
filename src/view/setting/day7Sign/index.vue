<template>
  <div>
    <div class="gva-search-box">
      <!-- <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item>
          <el-button type="success" icon="search" @click="onSubmit">
            {{ t("general.search") }}
          </el-button>
          <el-button icon="refresh" @click="onReset">
            {{ t("general.reset") }}
          </el-button>
        </el-form-item>
      </el-form> -->
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button type="success" icon="plus" @click="openDialog('add')">
          {{ t("general.add") }}
        </el-button>
      </div>
      <el-table
        border
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
          :label="t('tableColumn.day')"
          min-width="150"
          prop="day"
        />

        <el-table-column
          align="center"
          :label="t('tableColumn.award')"
          min-width="400"
          prop="award"
        >
          <template #default="scope">
            <!-- <div>{{ scope.row.award }}</div> -->
            <div v-for="(item, index) in scope.row.award" :key="index">
              <div
                v-for="(item1, key, index1) in item"
                :key="index1"
                class="spanCla"
              >
                <span>{{ t(`tableColumn.${key}`) }}: </span>
                <span
                  v-if="key == 'code'"
                  :class="key == 'code' ? 'span3' : ''"
                  >{{ t(`tableColumn.${item1}`) }}</span
                >
                <span v-else :class="key == 'code' ? 'span3' : ''">{{
                  item1
                }}</span>
              </div>
              <span
                class="span4"
                v-if="
                  scope.row.award.length > 1 &&
                  scope.row.award.length - 1 > index
                "
              >
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          :label="t('general.operations')"
          min-width="200"
        >
          <template #default="scope">
            <el-button
              type="primary"
              icon="edit"
              size="small"
              @click="editTackFunc(scope.row)"
            >
              {{ t("general.edit") }}
            </el-button>
            <el-button
              icon="delete"
              size="small"
              @click="deleteTackFunc(scope.row)"
            >
              {{ t("general.delete") }}
            </el-button>
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

    <el-drawer
      v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      size="60%"
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
        label-width="80px"
      >
        <el-row class="w-full">
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.day')" prop="day">
              <el-input-number
                :disabled="type === 'edit'"
                :min="0"
                v-model="form.day"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div
          style="
            padding: 0 0 20px 40px;
            color: black;
            font-size: 16px;
            font-weight: 700;
          "
        >
          {{ t("tableColumn.award") }}
        </div>
        <div style="padding: 0 0 20px 40px; color: red; font-size: 12px">
          提示：分别填写物品配置的名称 / 数量
        </div>
        <template v-for="(item, index) in form.award" :key="index">
          <el-row class="w-full">
            <el-col :span="12" v-if="item.code || type !== null">
              <el-form-item
                :label="t('tableColumn.code')"
                :prop="`award.${index}.code`"
                :rules="rules['award.code']"
              >
                <!-- <el-input :min="0" v-model="item.code" autocomplete="off" /> -->
                <el-select
                  clearable
                  v-model="item.code"
                  :placeholder="t('tableColumn.placeholder')"
                >
                  <el-option
                    v-for="item1 in codeOptions"
                    :key="item1.code"
                    :label="t(`tableColumn.${item1.code}`)"
                    :value="item1.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="item.num || type !== null">
              <!-- <el-form-item label="num">
                <el-input-number
                  :min="0"
                  v-model="item.num"
                  autocomplete="off"
                />
                <el-button
                  style="margin-left: 20px"
                  type="delete"
                  @click="delItem(index)"
                >
                  删除
                </el-button>
              </el-form-item> -->
              <el-form-item
                :label="t('tableColumn.num')"
                :prop="`award.${index}.num`"
                :rules="rules['award.num']"
              >
                <el-input
                  style="width: 55%"
                  v-model="item.num"
                  autocomplete="off"
                  @input="item.num = item.num.replace(/[^\d|\.]/g, '')"
                  @change="handleChange(item.num, index, 'v4')"
                />
                <el-button
                  style="margin-left: 20px"
                  icon="delete"
                  @click="delItem(index)"
                >
                  {{ t("general.delete") }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-form-item>
          <el-button type="success" icon="plus" @click="addItem()">
            {{ t("general.add") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  day7SignGetList,
  day7SignDel,
  day7SignEdit,
  day7SignAdd,
  virtualItemGetList,
} from "@/api/tack";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const router = useRouter();

defineOptions({
  name: "day7Sign",
});
const codeOptions = ref([]);
const apis = ref([]);
const form = ref({
  day: null,
  award: [
    {
      code: "",
      num: null,
    },
  ],
});

const type = ref("");
const rules = ref({
  day: [{ required: true, message: "请输入天数", trigger: "blur" }],
  "award.code": [{ required: true, message: "请输入code", trigger: "blur" }],
  "award.num": [{ required: true, message: "请选输入数量", trigger: "blur" }],
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const searchInfo = ref({});

const clickBetDetail = (id) => {
  // let query = {};
  // query["id"] = id;
  // router.push({ name: "taskDetails", query });
};

const onReset = () => {
  searchInfo.value = {};
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
  const table = await day7SignGetList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    table.data.list.map((item, index) => {
      if (item.award != null && item.award.length > 0) {
        item.award.map((item2, index2) => {
          item2.num = handleChange(item2.num, index2, "v4", true);
        });
      }
    });

    tableData.value = table.data.list;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};
const initPage = async () => {
  const itemData = await virtualItemGetList({
    page: page.value,
    pageSize: 9999,
  });
  if (itemData.code === 0) {
    codeOptions.value = itemData.data.list;
  }
  getTableData();
};
initPage();
// 批量操作
const handleSelectionChange = (val) => {
  apis.value = val;
};

// 弹窗相关
const apiForm = ref(null);
const initForm = () => {
  apiForm.value.resetFields();
  form.value = {
    day: null,
    award: [
      {
        code: "",
        num: null,
      },
    ],
  };
};

const addItem = () => {
  form.value.award.push({
    code: "",
    num: null,
  });
};

const delItem = (index) => {
  form.value.award.splice(index, 1);
};

const dialogTitle = ref(t("general.add"));
const dialogFormVisible = ref(false);
const openDialog = (key) => {
  switch (key) {
    case "add":
      dialogTitle.value = t("general.add");
      break;
    case "edit":
      dialogTitle.value = t("general.edit");
      break;
    default:
      break;
  }
  type.value = key;
  dialogFormVisible.value = true;
};
const closeDialog = () => {
  initForm();
  dialogFormVisible.value = false;
};

const editTackFunc = async (row) => {
  let rows = JSON.parse(JSON.stringify(row));
  form.value = rows;
  openDialog("edit");
};

const enterDialog = async () => {
  apiForm.value.validate(async (valid) => {
    if (valid) {
      if (form.value.award != null && form.value.award.length) {
        form.value.award.map((item, index) => {
          item.num = item.num + "";
          if (item.num.indexOf("B") !== -1) {
            const newStr = item.num.replace("B", "");
            item.num = Number(newStr) * 1000000000;
          } else if (item.num.indexOf("M") !== -1) {
            const newStr = item.num.replace("M", "");
            item.num = Number(newStr) * 1000000;
          } else if (item.num.indexOf("K") !== -1) {
            const newStr = item.num.replace("K", "");
            item.num = Number(newStr) * 1000;
          } else {
            item.num = Number(item.num);
          }
        });
      }
      switch (type.value) {
        case "add":
          {
            const res = await day7SignAdd(form.value);
            if (res.code === 0) {
              ElMessage({
                type: "success",
                message: t("user.userAddedNote"),
                showClose: true,
              });
              getTableData();
              closeDialog();
            }
          }
          break;
        case "edit":
          {
            const res = await day7SignEdit(form.value);
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
          break;
        default:
          {
            ElMessage({
              type: "error",
              message: t("view.api.unknownOperation"),
              showClose: true,
            });
          }
          break;
      }
    }
  });
};

const deleteTackFunc = async (row) => {
  ElMessageBox.confirm(t("general.deleteConfirm"), t("general.hint"), {
    confirmButtonText: t("general.confirm"),
    cancelButtonText: t("general.cancel"),
    type: "warning",
  }).then(async () => {
    const res = await day7SignDel({ day: row.day });
    if (res.code === 0) {
      ElMessage({
        type: "success",
        message: t(`general.deleteSuccess`),
      });
      getTableData();
    }
  });
};
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
