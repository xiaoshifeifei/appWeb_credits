<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
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
      <div class="gva-btn-list">
        <el-button type="primary" icon="plus" @click="openDialog('add')">
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
        <el-table-column type="selection" align="center" width="60" />
        <el-table-column
          align="center"
          :label="t('tableColumn.id')"
          min-width="100"
          prop="id"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.code')"
          min-width="100"
          prop="code"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.interval')"
          min-width="100"
          prop="interval"
        />

        <el-table-column
          align="center"
          :label="t('tableColumn.awardData')"
          min-width="400"
          prop="award"
        >
          <template #default="scope">
            <!-- <div>{{ scope.row.award }}</div> -->
            <div v-for="(item, index) in scope.row.awardData" :key="index">
              <div
                v-for="(item1, key, index1) in item"
                :key="index1"
                class="spanCla"
              >
                <span>{{ t(`tableColumn.${key}`) }}: </span>
                <span
                  v-if="key == 'code'"
                  :class="key == 'code' ? 'span2' : ''"
                >
                  {{ t(`tableColumn.${item1}`) }}</span
                >
                <span v-else :class="key == 'code' ? 'span2' : ''">
                  {{ item1 }}</span
                >
              </div>
              <span
                class="span4"
                v-if="
                  scope.row.awardData.length > 1 &&
                  scope.row.awardData.length - 1 > index
                "
              >
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.max')"
          min-width="100"
          prop="max"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.desc')"
          min-width="150"
          prop="desc"
        />
        <el-table-column
          align="center"
          fixed="right"
          :label="t('general.operations')"
          min-width="200"
        >
          <template #default="scope">
            <el-button
              icon="edit"
              type="primary"
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
          layout="prev, pager, next"
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
            <el-form-item :label="t('tableColumn.id')" prop="id">
              <el-input-number
                :disabled="type === 'edit'"
                :min="0"
                v-model="form.id"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="w-full">
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.code')" prop="code">
              <el-input v-model="form.code" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="w-full">
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.interval')" prop="interval">
              <el-input-number
                :min="0"
                v-model="form.interval"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="w-full">
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.max')" prop="max">
              <el-input
                v-model="form.max"
                autocomplete="off"
                @input="form.max = form.max.replace(/[^\d|\.]/g, '')"
                @change="handleChange(form.max, index, 'v4')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="w-full">
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.desc')" prop="desc">
              <el-input v-model="form.desc" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>

        <div style="padding: 0 0 20px 40px; color: black; font-size: 16px">
          {{ t("tableColumn.award") }}
        </div>
        <div style="padding: 0 0 20px 40px; color: red; font-size: 12px">
          提示：分别填写物品配置的重量 / 名称 / 数量
        </div>
        <template v-for="(item, index) in form.award" :key="index">
          <el-row class="w-full">
            <el-col :span="6" v-if="item.weight || type !== null">
              <el-form-item :label="t('tableColumn.weight')">
                <el-input-number
                  class="inputN"
                  :min="0"
                  v-model="item.weight"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5" v-if="item.code || type !== null">
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
                  @change="handleChange(item.num, index, 'v2')"
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
          <el-button type="primary" icon="plus" @click="addItem()">
            {{ t("general.add") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  timedRewardGetList,
  timedRewardDel,
  timedRewardEdit,
  timedRewardAdd,
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
  id: null,
  code: "",
  interval: null,
  award: [
    {
      weight: null,
      code: "",
      num: null,
    },
  ],
  desc: "",
  max: null,
});

const type = ref("");
const rules = ref({
  day: [{ required: true, message: "请输入天数", trigger: "blur" }],
  max: [{ required: true, message: "请输入最大数", trigger: "blur" }],
  "award.code": [{ required: true, message: "请选择类型", trigger: "blur" }],
  "award.num": [{ required: true, message: "请选输入数量", trigger: "blur" }],
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const awardData = ref([]);
const searchInfo = ref({});

const onReset = () => {
  searchInfo.value = {};
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
const delItem = (index) => {
  form.value.award.splice(index, 1);
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
  const table = await timedRewardGetList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    table.data.list.map((item, index) => {
      item.max = handleChange(item.max, index, "v4", true);
      if (item.award != null && item.award.length > 0) {
        item.awardData = JSON.stringify(item.award);
        item.award.map((item2, index2) => {
          item2.num = handleChange(item2.num, index2, "v2", true);
        });
      }
    });

    table.data.list.map((item, index) => {
      item.awardData = JSON.parse(item.awardData);
      if (item.awardData != null && item.awardData.length > 0) {
        // 按照 code 分组并计算 value 的总和
        const result = item.awardData.reduce((acc, item) => {
          // 如果该 code 不在结果对象中，初始化
          if (!acc[item.code]) {
            acc[item.code] = { code: item.code, num: 0, weight: 0 };
          }
          // 累加 value 值
          acc[item.code].num += item.num;
          acc[item.code].weight += item.weight;
          return acc;
        }, {});

        // 转换为数组形式
        const output = Object.values(result);
        item.awardData = output;
      }
    });
    table.data.list.map((item, index) => {
      item.max = handleChange(item.max, index, "v4", true);
      if (item.awardData != null && item.awardData.length > 0) {
        item.awardData.map((item2, index2) => {
          item2.num = handleChange(item2.num, index2, "v2", true);
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
    id: null,
    code: "",
    interval: null,
    award: [
      {
        weight: null,
        code: "",
        num: null,
      },
    ],
    desc: "",
    max: null,
  };
};

const addItem = () => {
  form.value.award.push({
    weight: null,
    code: "",
    num: null,
  });
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

  handleChange(form.value.max, 0, "v4");
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
      if (form.value.max) {
        form.value.max = form.value.max + "";
        if (form.value.max.indexOf("B") !== -1) {
          const newStr = form.value.max.replace("B", "");
          form.value.max = Number(newStr) * 1000000000;
        } else if (form.value.max.indexOf("M") !== -1) {
          const newStr = form.value.max.replace("M", "");
          form.value.max = Number(newStr) * 1000000;
        } else if (form.value.max.indexOf("K") !== -1) {
          const newStr = form.value.max.replace("K", "");
          form.value.max = Number(newStr) * 1000;
        } else {
          form.value.max = Number(form.value.max);
        }
      }
      switch (type.value) {
        case "add":
          {
            const res = await timedRewardAdd(form.value);
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
            const res = await timedRewardEdit(form.value);
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
    const res = await timedRewardDel({ id: row.id });
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
.w-full {
  .inputN {
    width: 100%;
  }
}

.span2 {
  font-weight: 700;
}
.span4 {
  display: block;
  border-bottom: 1px solid var(--border-color);
  width: 80%;
  margin: auto;
}

.span1 {
  display: inline-block;
  width: 50%;
  text-align: right;
}
.span3 {
  display: inline-block;
  width: calc(49% - 8px);
  text-align: left;
  padding-left: 8px;
}
.spanCla {
  display: inline-block;
  margin-right: 20px;
}
</style>
