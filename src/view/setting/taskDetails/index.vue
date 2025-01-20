<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="ID">
          <el-input v-model="searchInfo.id" placeholder="ID" />
        </el-form-item>
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
        <el-table-column type="selection" align="center" width="60" />
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.id')"
          prop="id"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.desc')"
          min-width="150"
          prop="desc"
        />

        <el-table-column
          align="center"
          :label="t('tableColumn.complete')"
          min-width="400"
          prop="complete"
        >
          <template #default="scope">
            <div
              v-for="(item, index) in scope.row.complete"
              :key="index"
              class="spanZ"
            >
              <div
                v-for="(item1, key, index1) in item"
                :key="index1"
                class="spanClass"
              >
                <span v-if="item1 !== ''" class="spanRi">
                  <span>{{ t(`tableColumn.${key}`) }}: </span>
                  <span>{{ item1 }}</span>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.award')"
          min-width="200"
          prop="award"
        >
          <template #default="scope">
            <div v-for="(item, index) in scope.row.award" :key="index">
              <div v-for="(item1, key, index1) in item" :key="index1">
                <span class="span1">{{ t(`tableColumn.${key}`) }}: </span>
                <span class="span2">{{ item1 }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          :label="t('tableColumn.start')"
          min-width="180"
          prop="start"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.start) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.end')"
          min-width="180"
          prop="end"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.end) }}</div>
          </template>
        </el-table-column> -->
        <el-table-column
          align="center"
          :label="t('tableColumn.unlock')"
          min-width="150"
          prop="unlock"
        >
          <template #default="scope">
            <div v-for="(item, index) in scope.row.unlock" :key="index">
              <div v-for="(item1, key, index1) in item" :key="index1">
                <span class="span1">{{ t(`tableColumn.${key}`) }}:</span>
                <span class="span2">{{ item1 }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.tag')"
          min-width="150"
          prop="tag"
        >
          <template #default="scope">
            <div v-for="(item1, key, index1) in scope.row.tag" :key="index1">
              <span class="span1">{{ t(`tableColumn.${key}`) }}:</span>
              <span class="span2">{{ item1 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.before')"
          min-width="150"
          prop="before"
        />
        <el-table-column
          align="center"
          fixed="right"
          :label="t('general.operations')"
          min-width="200"
        >
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              icon="edit"
              @click="editTackFunc(scope.row)"
            >
              {{ t("general.edit") }}
            </el-button>
            <el-button
              size="small"
              icon="delete"
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
            <el-button type="primary" @click="enterDialog"
              >{{ t("general.confirm") }}
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        class="myForm"
        ref="apiForm"
        :model="form"
        :rules="rules"
        label-width="100px"
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
            <div style="padding: 0 0 5px 80px; color: red; font-size: 12px">
              提示：前置任务ID
            </div>
            <el-form-item :label="t('tableColumn.before')" prop="before">
              <el-input-number
                :min="0"
                v-model="form.before"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('tableColumn.desc')" prop="desc">
          <el-input v-model="form.desc" autocomplete="off" />
        </el-form-item>
        <div
          style="
            padding: 0 0 20px 40px;
            color: black;
            font-size: 16px;
            font-weight: 700;
          "
        >
          {{ t("tableColumn.complete") }}
        </div>
        <template v-for="(item, index) in form.complete" :key="index">
          <el-col :span="12" v-if="item.type || type !== null">
            <el-form-item
              :label="t('tableColumn.type')"
              :prop="`complete.${index}.type`"
              :rules="rules['complete.type']"
            >
              <el-select
                v-model="item.type"
                style="width: 100%"
                :placeholder="t('general.pleaseSelect')"
              >
                <el-option
                  v-for="item1 in typeOptions"
                  :key="item1.value"
                  :label="item1.label"
                  :value="item1.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-row class="w-full">
            <el-col :span="12" v-if="item.game || type !== null">
              <el-form-item :label="t('tableColumn.game')">
                <el-input v-model="item.game" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="item.roomCode || type !== null">
              <el-form-item :label="t('tableColumn.roomCode')">
                <el-select
                  v-model="item.roomCode"
                  style="width: 100%"
                  :placeholder="t('general.pleaseSelect')"
                >
                  <el-option
                    v-for="item1 in completeOptions"
                    :key="item1.value"
                    :label="item1.label"
                    :value="item1.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="item.value || type !== null">
              <div style="padding: 0 0 5px 80px; color: red; font-size: 12px">
                提示：值为次数 或 金额
              </div>
              <el-form-item
                label="value"
                :prop="`complete.${index}.value`"
                :rules="rules['complete.value']"
              >
                <el-input
                  v-model="item.value"
                  autocomplete="off"
                  @input="item.value = item.value.replace(/[^\d|\.]/g, '')"
                  @change="handleChange(item.value, index, 'v1')"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="item.value2 || type !== null">
              <div style="padding: 0 0 5px 80px; color: red; font-size: 12px">
                提示：type = 108 时为下注次数，其他类型输入0
              </div>
              <el-form-item
                label="value2"
                :prop="`complete.${index}.value2`"
                :rules="rules['complete.value2']"
              >
                <el-input
                  v-model="item.value2"
                  autocomplete="off"
                  @input="item.value2 = item.value2.replace(/[^\d|\.]/g, '')"
                  @change="handleChange(item.value2, index, 'v2')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="w-full">
            <el-col :span="12" v-if="item.code || type !== null">
              <div style="padding: 0 0 5px 80px; color: red; font-size: 12px">
                提示：用做物品收集的任务（暂无这类任务）
              </div>
              <el-form-item :label="t('tableColumn.code')">
                <el-input v-model="item.code" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="item.mode || type !== null">
              <div style="padding: 0 0 5px 80px; color: red; font-size: 12px">
                提示：用于限制值在哪个游戏模式才进行累加
              </div>
              <el-form-item :label="t('tableColumn.mode')">
                <el-input v-model="item.mode" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="w-full">
            <el-col :span="12" v-if="item.limit || type !== null">
              <div style="padding: 0 0 5px 80px; color: red; font-size: 12px">
                提示：限制单次值的限制 比如说单次下注达到100才将这次的值进行累积
              </div>
              <el-form-item :label="t('tableColumn.limit')">
                <el-input-number
                  :min="0"
                  v-model="item.limit"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="item.initialize || type !== null">
              <div style="padding: 0 0 5px 80px; color: red; font-size: 12px">
                提示：用于进度值的初始化 空字符串默认为now now: 接任务开始统计
                day:日统计 week:周统计
              </div>
              <el-form-item :label="t('tableColumn.initialize')">
                <el-input v-model="item.initialize" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
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
        <template v-for="(item, index) in form.award" :key="index">
          <el-row class="w-full">
            <el-col :span="12" v-if="item.type || type !== null">
              <el-form-item
                :label="t('tableColumn.type')"
                :prop="`award.${index}.type`"
                :rules="rules['award.type']"
              >
                <el-select
                  v-model="item.type"
                  style="width: 100%"
                  :placeholder="t('general.pleaseSelect')"
                >
                  <el-option
                    v-for="item1 in typeOptions"
                    :key="item1.value"
                    :label="item1.label"
                    :value="item1.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-col :span="12" v-if="item.id || type !== null">
              <el-form-item :label="t('tableColumn.id')">
                <el-input-number
                  :min="0"
                  v-model="item.id"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col> -->
          <el-row class="w-full">
            <el-col :span="12" v-if="item.code || type !== null">
              <div style="padding: 0 0 5px 80px; color: red; font-size: 12px">
                提示：输入物品配置的物品名称
              </div>
              <el-form-item label="code">
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
              <div style="padding: 0 0 5px 80px; color: red; font-size: 12px">
                提示：输入物品配置的物品数量
              </div>
              <el-form-item
                :label="t('tableColumn.num')"
                :prop="`award.${index}.num`"
                :rules="rules['award.num']"
              >
                <el-input
                  v-model="item.num"
                  autocomplete="off"
                  @input="item.num = item.num.replace(/[^\d|\.]/g, '')"
                  @change="handleChange(item.num, index, 'v3')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <div
          style="
            padding: 0 0 20px 40px;
            color: black;
            font-size: 16px;
            font-weight: 700;
          "
          v-if="form.unlock && form.unlock.length"
        >
          {{ t("tableColumn.unlock") }}
        </div>
        <template v-for="(item, index) in form.unlock" :key="index">
          <el-row class="w-full">
            <el-col :span="12" v-if="item.type || type !== null">
              <el-form-item
                :label="t('tableColumn.type')"
                :prop="`unlock.${index}.type`"
                :rules="rules['unlock.type']"
              >
                <el-select
                  v-model="item.type"
                  style="width: 100%"
                  :placeholder="t('general.pleaseSelect')"
                >
                  <el-option
                    v-for="item1 in typeOptions"
                    :key="item1.value"
                    :label="item1.label"
                    :value="item1.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="item.level || type !== null">
              <el-form-item :label="t('tableColumn.level')" prop="level">
                <el-input-number
                  :min="0"
                  v-model="item.level"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <div
          style="
            padding: 0 0 20px 40px;
            color: black;
            font-size: 16px;
            font-weight: 700;
          "
        >
          {{ t("tableColumn.tag") }} (配置长期任务)
        </div>
        <el-row class="w-full">
          <el-col :span="12" v-if="form.tag.game || type !== null">
            <el-form-item :label="t('tableColumn.game')" prop="tag">
              <el-input v-model="form.tag.game" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.tag.roomCode || type !== null">
            <el-form-item :label="t('tableColumn.roomCode')" prop="roomCode">
              <!-- <el-input v-model="form.tag.roomCode" autocomplete="off" /> -->
              <el-select
                v-model="form.tag.roomCode"
                style="width: 100%"
                :placeholder="t('general.pleaseSelect')"
              >
                <el-option
                  v-for="item1 in completeOptions"
                  :key="item1.value"
                  :label="item1.label"
                  :value="item1.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div style="padding: 0 0 20px 40px; color: red; font-size: 12px">
          type提示：
          <div style="margin: 5px 0">101 //下注多少完成</div>
          <div style="margin: 5px 0">102 //赢多少完成</div>
          <div style="margin: 5px 0">103 //下注多少次完成</div>
          <div style="margin: 5px 0">104 //mega win多少次完成</div>
          <div style="margin: 5px 0">105 //big win多少次外完成</div>
          <div style="margin: 5px 0">106 //单次赢多少完成</div>
          <div style="margin: 5px 0">107 //触发free次数</div>
          <div style="margin: 5px 0">108 //下注多少次内要赢奖多少</div>
          <div style="margin: 5px 0">109 //游戏主线完成</div>
          <div style="margin: 5px 0">110 //bonus触发次数完成</div>
          <div style="margin: 5px 0">111 //cash explosion次数完成</div>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  getTackList,
  deleteTack,
  updateTack,
  createTack,
  virtualItemGetList,
} from "@/api/tack";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const route = useRoute();

defineOptions({
  name: "taskDetails",
});

const apis = ref([]);
const form = ref({
  id: null,
  before: null,
  desc: "",
  complete: [
    {
      type: null,
      value: null,
      code: "",
      roomCode: "",
      game: "",
      mode: "",
      limit: null,
      initialize: "",
      value2: null,
    },
  ],
  award: [
    {
      type: null,
      id: null,
      code: "",
      num: null,
    },
  ],
  unlock: [
    {
      type: null,
      level: null,
    },
  ],
  tag: {
    roomCode: "",
    game: "",
  },
});
const codeOptions = ref([]);
const type = ref("");
const rules = ref({
  id: [{ required: true, message: "请输入id", trigger: "blur" }],
  "complete.type": [
    { required: true, message: "请输入模板类型", trigger: "blur" },
  ],
  "award.type": [
    { required: true, message: "请输入奖励类型", trigger: "blur" },
  ],
  "award.num": [{ required: true, message: "请输入数量", trigger: "blur" }],
  "unlock.type": [{ required: true, message: "请输入类型", trigger: "blur" }],
  "complete.value": [
    {
      required: true,
      message: "请输入value",
      trigger: "blur",
    },
  ],
  "complete.value2": [
    {
      required: true,
      message: "请输入value2",
      trigger: "blur",
    },
  ],
});
const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const searchInfo = ref({});
const completeOptions = ref([
  { label: "HIGH", value: "HIGH" },
  { label: "LOW", value: "LOW" },
  { label: "MIDDLE", value: "MIDDLE" },
]);
const typeOptions = ref([
  { label: "下注多少完成(101)", value: 101 },
  { label: "赢多少完成(102)", value: 102 },
  { label: "下注多少次完成(103)", value: 103 },
  { label: "mega win多少次完成(104)", value: 104 },
  { label: "big win多少次外完成(105)", value: 105 },
  { label: "单次赢多少完成(106)", value: 106 },
  { label: "触发free次数(107)", value: 107 },
  { label: "下注多少次内要赢奖多少(108)", value: 108 },
  { label: "游戏主线完成(109)", value: 109 },
  { label: "bonus触发次数完成(110)", value: 110 },
  { label: "cash explosion次数完成(111)", value: 111 },
]);
const onReset = () => {
  searchInfo.value = {};
};
const handleChange = (number, index, params, params2) => {
  if (params === "v1") {
    if (number >= 1000000000) {
      if (params2) {
        return number / 1000000000 + "B";
      } else {
        return (form.value.complete[index].value = number / 1000000000 + "B");
      }
    } else if (number >= 1000000) {
      if (params2) {
        return number / 1000000 + "M";
      } else {
        return (form.value.complete[index].value = number / 1000000 + "M");
      }
    } else if (number >= 1000) {
      if (params2) {
        return number / 1000 + "K";
      } else {
        return (form.value.complete[index].value = number / 1000 + "K");
      }
    } else {
      if (params2) {
        return number.toString();
      } else {
        return (form.value.complete[index].value = number.toString());
      }
    }
  } else if (params === "v2") {
    if (number >= 1000000000) {
      if (params2) {
        return number / 1000000000 + "B";
      } else {
        return (form.value.complete[index].value2 = number / 1000000000 + "B");
      }
    } else if (number >= 1000000) {
      if (params2) {
        return number / 1000000 + "M";
      } else {
        return (form.value.complete[index].value2 = number / 1000000 + "M");
      }
    } else if (number >= 1000) {
      if (params2) {
        return number / 1000 + "K";
      } else {
        return (form.value.complete[index].value2 = number / 1000 + "K");
      }
    } else {
      if (params2) {
        return number.toString();
      } else {
        return (form.value.complete[index].value2 = number.toString());
      }
    }
  } else if (params === "v3") {
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

// 初始化方法 查询
const init = async () => {
  searchInfo.value.id = route.query.id;
  const itemData = await virtualItemGetList({
    page: page.value,
    pageSize: 9999,
  });
  if (itemData.code === 0) {
    codeOptions.value = itemData.data.list;
  }
  if (route.query.id) {
    const table = await getTackList({
      page: page.value,
      pageSize: pageSize.value,
      ...searchInfo.value,
    });
    if (table.code === 0) {
      table.data.list.map((item, index) => {
        if (item.complete[0].value) {
          item.complete[0].value = handleChange(
            item.complete[0].value,
            0,
            "v1",
            true
          );
        }
        if (item.complete[0].value2) {
          item.complete[0].value2 = handleChange(
            item.complete[0].value2,
            0,
            "v2",
            true
          );
        }
        if (item.award[0].num) {
          item.award[0].num = handleChange(item.award[0].num, 0, "v3", true);
        }
      });
      tableData.value = table.data.list;
      total.value = table.data.total;
      page.value = table.data.page;
      pageSize.value = table.data.pageSize;
    }
  }
};
init();
// 查询
const getTableData = async () => {
  const table = await getTackList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    table.data.list.map((item, index) => {
      if (item.complete[0].value) {
        item.complete[0].value = handleChange(
          item.complete[0].value,
          0,
          "v1",
          true
        );
      }
      if (item.complete[0].value2) {
        item.complete[0].value2 = handleChange(
          item.complete[0].value2,
          0,
          "v2",
          true
        );
      }
      if (item.award[0].num) {
        item.award[0].num = handleChange(item.award[0].num, 0, "v3", true);
      }
    });
    tableData.value = table.data.list;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};

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
    before: null,
    desc: "",
    complete: [
      {
        type: null,
        value: null,
        code: "",
        roomCode: "",
        game: "",
        mode: "",
        limit: null,
        initialize: "",
        value2: null,
      },
    ],
    award: [
      {
        type: null,
        id: null,
        code: "",
        num: null,
      },
    ],
    unlock: [
      {
        type: null,
        level: null,
      },
    ],
    tag: {
      roomCode: "",
      game: "",
    },
  };
};

const dialogTitle = ref("新增");
const dialogFormVisible = ref(false);
const openDialog = (key) => {
  switch (key) {
    case "add":
      dialogTitle.value = "新增";
      break;
    case "edit":
      dialogTitle.value = "编辑";
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
function isJSON(str) {
  if (typeof str !== "string") {
    return false;
  } else {
    return true;
  }
}
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
const editTackFunc = async (row) => {
  let rows = JSON.parse(JSON.stringify(row));
  form.value = rows;
  handleChange(form.value.complete[0].value, 0, "v1");
  handleChange(form.value.complete[0].value2, 0, "v2");
  handleChange(form.value.award[0].num, 0, "v3");
  openDialog("edit");
};

const enterDialog = async () => {
  apiForm.value.validate(async (valid) => {
    if (valid) {
      if (form.value.complete[0].value) {
        form.value.complete[0].value = form.value.complete[0].value + "";
        if (form.value.complete[0].value.indexOf("M") !== -1) {
          const newStr = form.value.complete[0].value.replace("W", "");
          form.value.complete[0].value = Number(newStr) * 1000000000;
        } else if (form.value.complete[0].value.indexOf("W") !== -1) {
          const newStr = form.value.complete[0].value.replace("W", "");
          form.value.complete[0].value = Number(newStr) * 10000;
        } else if (form.value.complete[0].value.indexOf("K") !== -1) {
          const newStr = form.value.complete[0].value.replace("K", "");
          form.value.complete[0].value = Number(newStr) * 1000;
        } else {
          form.value.complete[0].value = Number(form.value.complete[0].value);
        }
      }
      if (form.value.complete[0].value2) {
        form.value.complete[0].value2 = form.value.complete[0].value2 + "";
        if (form.value.complete[0].value2.indexOf("M") !== -1) {
          const newStr = form.value.complete[0].value2.replace("W", "");
          form.value.complete[0].value2 = Number(newStr) * 1000000000;
        } else if (form.value.complete[0].value2.indexOf("W") !== -1) {
          const newStr = form.value.complete[0].value2.replace("W", "");
          form.value.complete[0].value2 = Number(newStr) * 10000;
        } else if (form.value.complete[0].value2.indexOf("K") !== -1) {
          const newStr = form.value.complete[0].value2.replace("K", "");
          form.value.complete[0].value2 = Number(newStr) * 1000;
        } else {
          form.value.complete[0].value2 = Number(form.value.complete[0].value2);
        }
      }
      if (form.value.award[0].num) {
        form.value.award[0].num = form.value.award[0].num + "";
        if (form.value.award[0].num.indexOf("M") !== -1) {
          const newStr = form.value.award[0].num.replace("W", "");
          form.value.award[0].num = Number(newStr) * 1000000000;
        } else if (form.value.award[0].num.indexOf("W") !== -1) {
          const newStr = form.value.award[0].num.replace("W", "");
          form.value.award[0].num = Number(newStr) * 10000;
        } else if (form.value.award[0].num.indexOf("K") !== -1) {
          const newStr = form.value.award[0].num.replace("K", "");
          form.value.award[0].num = Number(newStr) * 1000;
        } else {
          form.value.award[0].num = Number(form.value.award[0].num);
        }
      }
      switch (type.value) {
        case "add":
          {
            const res = await createTack(form.value);
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
            const res = await updateTack(form.value);
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
  ElMessageBox.confirm("此操作将永久删除任务, 是否继续?", t("general.hint"), {
    confirmButtonText: t("general.confirm"),
    cancelButtonText: t("general.cancel"),
    type: "warning",
  }).then(async () => {
    const res = await deleteTack({ id: row.id });
    if (res.code === 0) {
      ElMessage({
        type: "success",
        message: "删除成功!",
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
  vertical-align: top;
}
.span2 {
  display: inline-block;
  width: calc(49% - 8px);
  text-align: left;
  padding-left: 8px;
}
.spanZ {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.spanCla {
  width: 50%;
}
.spanClass {
  display: inline;
}
.spanRi {
  margin-right: 30px;
}
</style>
