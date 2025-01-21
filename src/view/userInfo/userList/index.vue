<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item :label="t('tableColumn.accountId')">
          <el-input
            @blur="searchChange($event, 'accountId')"
            clearable
            v-model="searchInfo.accountId"
            placeholder="ID"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="t('tableColumn.accountType')">
          <el-select
            clearable
            v-model="searchInfo.accountType"
            :placeholder="t('tableColumn.placeholder')"
            @change="searchChange()"
            style="width: 200px"
          >
            <el-option
              v-for="item in accountTypeOption"
              :key="item.value"
              :label="t(`tableColumn.${item.label}`)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <DataTime
          v-model="value2"
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
      <!-- <div class="gva-btn-list">
        <el-button type="success" icon="plus" @click="openDialog('add')">
          新增
        </el-button>
      </div> -->
      <div class="gva-btn-list">
        <el-button type="success" icon="plus" @click="sendMail()">
          {{ t("tableColumn.sendAnEmail") }}
        </el-button>
      </div>
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
        <el-table-column type="selection" align="center" width="60" />
        <el-table-column
          align="center"
          :label="t('user.avatar')"
          min-width="75"
        >
          <template #default="scope">
            <CustomPic style="margin-top: 8px" :pic-src="scope.row.headerImg" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.accountId')"
          prop="accountId"
        >
          <template #default="scope">
            <el-link
              type="primary"
              @click="clickBetDetail(scope.row.accountId)"
              >{{ scope.row.accountId }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.username')"
          min-width="90"
          prop="username"
        />
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.invitationCode')"
          prop="invitationCode"
        >
        </el-table-column>
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.accountType')"
          prop="accountType"
        >
          <template #default="scope">
            <div>
              {{
                scope.row.accountType === 1
                  ? t("tableColumn.normal")
                  : scope.row.accountType === 2
                  ? t("tableColumn.visitor")
                  : scope.row.accountType
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="150"
          :label="t('tableColumn.clientId')"
          prop="clientId"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.avatarId')"
          prop="avatarId"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.country')"
          prop="country"
        >
          <template #default="scope">
            <div>
              {{
                scope.row.country === "EN"
                  ? t("tableColumn.EN")
                  : scope.row.country === "CN"
                  ? t("tableColumn.CN")
                  : scope.row.country === "ID"
                  ? t("tableColumn.ID")
                  : scope.row.country === "JA"
                  ? t("tableColumn.JA")
                  : scope.row.country === "KM"
                  ? t("tableColumn.KM")
                  : scope.row.country === "KO"
                  ? t("tableColumn.KO")
                  : scope.row.country === "MS"
                  ? t("tableColumn.MS")
                  : scope.row.country === "MY"
                  ? t("tableColumn.MY")
                  : scope.row.country === "PT"
                  ? t("tableColumn.PT")
                  : scope.row.country === "TH"
                  ? t("tableColumn.TH")
                  : scope.row.country === "VI"
                  ? t("tableColumn.VI")
                  : scope.row.country
              }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          min-width="180"
          :label="t('tableColumn.createAt')"
          prop="createAt"
        >
          <template #default="scope">
            <div>
              {{ dataGet(scope.row.createAt) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.diamond')"
          prop="diamond"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.experience')"
          prop="experience"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.followOnlineNotify')"
          prop="followOnlineNotify"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.gender')"
          prop="gender"
        >
          <template #default="scope">
            {{
              scope.row.gender == 0
                ? t("tableColumn.Conceal")
                : scope.row.gender == 1
                ? t("tableColumn.Male")
                : scope.row.gender == 2
                ? t("tableColumn.female")
                : ""
            }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.ipaddr')"
          prop="ipaddr"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.like')"
          prop="like"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.providerId')"
          prop="providerId"
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
          :label="t('tableColumn.vip')"
          prop="vip"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.subAgentId')"
          prop="subAgentId"
        >
        </el-table-column>

        <el-table-column
          align="center"
          :label="t('tableColumn.phone')"
          min-width="90"
          prop="phone"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.email')"
          min-width="200"
          prop="email"
        >
        </el-table-column>

        <el-table-column
          align="center"
          :label="t('tableColumn.status')"
          min-width="150"
          prop="status"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              inline-prompt
              style="
                --el-switch-on-color: #4caf50;
                --el-switch-off-color: #ff4949;
              "
              :active-value="0"
              :inactive-value="1"
              @change="
                () => {
                  switchStatus(scope.row);
                }
              "
            />
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          :label="t('general.operations')"
          min-width="200"
        >
          <template #default="scope">
            <!-- <el-button
              type="primary"
              size="small"
              @click="editTackFunc(scope.row)"
            >
              {{ t("general.edit") }}
            </el-button> -->
            <el-button type="success" size="small" @click="sendMail(scope.row)">
              {{ t("tableColumn.sendAnEmail") }}
            </el-button>

            <!-- <el-button type="warning" size="small"> 封禁 </el-button>
            <el-button type="info" size="small"> 黑名单 </el-button>
            <el-button size="small">
              {{ t("general.delete") }}
            </el-button> -->
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
      append-to-body
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
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.accountId')" prop="accountId">
              <el-input v-model="form.accountId" disabled autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="t('tableColumn.invitationCode')"
              prop="invitationCode"
            >
              <el-input
                disabled
                v-model="form.invitationCode"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.nickname')" prop="nickname">
              <el-input disabled v-model="form.nickname" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.vip')" prop="vip">
              <el-input disabled v-model="form.vip" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="t('tableColumn.accountType')"
              prop="accountId"
            >
              <el-select
                v-model="form.accountType"
                style="width: 100%"
                :placeholder="t('general.pleaseSelect')"
              >
                <el-option
                  v-for="item in accountTypeOption"
                  :key="item.value"
                  :label="t(`tableColumn.${item.label}`)"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="t('tableColumn.providerId')"
              prop="providerId"
            >
              <el-input v-model="form.providerId" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.siteId')" prop="siteId">
              <el-input-number
                :min="0"
                v-model="form.siteId"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.username')" prop="username">
              <el-input v-model="form.username" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.createAt')" prop="createAt">
              <el-date-picker
                v-model="form.createAt"
                type="datetime"
                disabled
                placeholder="请选择登出时间"
                @change="handleDateChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.updated')" prop="updated">
              <el-date-picker
                v-model="form.updated"
                disabled
                type="datetime"
                placeholder="请选择更新时间"
                @change="handleDateChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.login')" prop="login">
              <el-date-picker
                v-model="form.login"
                type="datetime"
                disabled
                placeholder="请选择登录时间"
                @change="handleDateChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.logout')" prop="logout">
              <el-date-picker
                v-model="form.logout"
                type="datetime"
                disabled
                placeholder="请选择登出时间"
                @change="handleDateChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="t('tableColumn.lastUpdate')"
              prop="lastUpdate"
            >
              <el-date-picker
                v-model="form.lastUpdate"
                type="datetime"
                disabled
                placeholder="请选择登出时间"
                @change="handleDateChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.clientId')" prop="clientId">
              <el-input disabled v-model="form.clientId" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.avatarId')" prop="avatarId">
              <el-input-number
                disabled
                :min="0"
                v-model="form.avatarId"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="t('tableColumn.subAgentId')"
              prop="subAgentId"
            >
              <el-input-number
                disabled
                :min="0"
                v-model="form.subAgentId"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item :label="t('tableColumn.email')">
              <el-input v-model="form.email" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.country')">
              <el-select
                v-model="form.country"
                style="width: 100%"
                :placeholder="t('general.pleaseSelect')"
              >
                <el-option
                  v-for="item in searchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.diamond')" prop="diamond">
              <el-input v-model="form.diamond" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="t('tableColumn.experience')"
              prop="experience"
            >
              <el-input v-model="form.experience" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="t('tableColumn.followOnlineNotify')"
              prop="followOnlineNotify"
            >
              <el-input v-model="form.followOnlineNotify" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.gender')" prop="gender">
              <el-input v-model="form.gender" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item :label="t('tableColumn.ipaddr')" prop="ipaddr">
              <el-input disabled v-model="form.ipaddr" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.like')" prop="like">
              <el-input disabled v-model="form.like" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.level')" prop="level">
              <el-input disabled v-model="form.level" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.phone')" prop="phone">
              <el-input disabled v-model="form.phone" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('tableColumn.status')" prop="status">
          <el-switch
            v-model="form.status"
            inline-prompt
            style="
              --el-switch-on-color: #4caf50;
              --el-switch-off-color: #ff4949;
            "
            :active-value="0"
            :inactive-value="1"
          />
        </el-form-item>
        <el-form-item :label="t('tableColumn.signature')" prop="status">
          <SignaturePad />
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-drawer
      v-if="sendMailVisible"
      v-model="sendMailVisible"
      size="50%"
      :before-close="closeMail"
      :show-close="false"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ dialogTitle }}</span>
          <div>
            <el-button @click="closeMail"> {{ t("general.close") }} </el-button>
            <el-button type="primary" @click="enterMail">
              {{ t("general.confirm") }}
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        class="myForm"
        ref="mailForm"
        :model="formMail"
        :rules="rulesMail"
        label-width="80px"
      >
        <el-row class="w-full">
          <el-col :span="15">
            <el-form-item
              :label="t('tableColumn.user')"
              prop="complete"
              v-if="oneSend"
            >
              <el-input
                v-model="formMail.receivers"
                disabled
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div style="padding: 0 0 20px 40px; color: black; font-size: 16px">
          {{ t("tableColumn.award") }}
        </div>
        <template v-for="(item, index) in formMail.items" :key="index">
          <el-row class="w-full">
            <el-col :span="6">
              <el-form-item
                :label="t('tableColumn.code')"
                :prop="`items.${index}.code`"
                :rules="rules['items.code']"
              >
                <!-- <el-input v-model="item.code" autocomplete="off" /> -->
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
            <el-col :span="15">
              <el-form-item
                :label="t('tableColumn.num')"
                :prop="`items.${index}.num`"
                :rules="rules['items.num']"
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

        <template v-for="(item, index) in formMail.content" :key="index">
          <el-row class="w-full">
            <el-col :span="15">
              <el-form-item
                :label="t('tableColumn.lang')"
                :prop="`content.${index}.lang`"
                :rules="rules['content.lang']"
              >
                <el-select
                  v-model="item.lang"
                  style="width: 100%"
                  :placeholder="t('general.pleaseSelect')"
                >
                  <el-option
                    v-for="item in completeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item
                :label="t('tableColumn.title')"
                :prop="`content.${index}.title`"
                :rules="rules['content.title']"
              >
                <el-input :min="0" v-model="item.title" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-button
              style="margin-left: 20px"
              icon="delete"
              @click="delContent(index)"
            >
              {{ t("general.delete") }}
            </el-button>
            <el-col :span="15">
              <el-form-item
                :label="t('tableColumn.message')"
                :prop="`content.${index}.message`"
                :rules="rules['content.message']"
              >
                <el-input :min="0" v-model="item.message" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-form-item>
          <el-button type="success" icon="plus" @click="addContent()">
            {{ t("general.add") }}
          </el-button>
        </el-form-item>
        <el-form-item :label="t('tableColumn.status')" prop="status">
          <el-switch
            v-model="formMail.status"
            :disabled="oneSend"
            style="
              --el-switch-on-color: #4caf50;
              --el-switch-off-color: #ff4949;
            "
            inline-prompt
            :active-value="0"
            :inactive-value="1"
          />
        </el-form-item>
        <!-- <el-form-item :label="t('tableColumn.expired')" prop="expired">
          <el-date-picker
            v-model="formMail.expired"
            type="datetime"
            :placeholder="t('tableColumn.PleaseTime')"
            @change="handleDateChange"
          />
        </el-form-item> -->
        <SingleTime
          v-model="valueExpired"
          :title="t('tableColumn.expired')"
        ></SingleTime>
      </el-form>
    </el-drawer>
  </div>
</template>
  
  <script setup>
import {
  getUserList,
  setUserInfo,
  deleteTack,
  updateTack,
  createTack,
  enterSyncApi,
  sendMailGo,
} from "@/api/userInfo";
import { virtualItemGetList } from "@/api/tack";
import { setUserAuthorities } from "@/api/user";
import SingleTime from "@/components/DataTime/singleTime.vue";
import DataTime from "@/components/DataTime/index.vue";
import CustomPic from "@/components/customPic/index.vue";
import SignaturePad from "@/components/preview/index.vue";
import { ref, watch, watchEffect } from "vue";
import { getAuthorityList } from "@/api/authority";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const router = useRouter();

defineOptions({
  name: "userInfo",
});
const value2 = ref([]);
const valueExpired = ref("");
const apis = ref([]);
const form = ref({
  status: "",
  email: "",
  nickname: "",
  username: "",
  updated: "",
  logout: "",
  login: "",
  lastUpdate: 0,
  accountId: "",
  accountType: null,
  clientId: "",
  avatarId: "",
  country: "",
  createAt: "",
  diamond: "",
  experience: "",
  followOnlineNotify: "",
  gender: "",
  invitationCode: "",
  ipaddr: "",
  like: "",
  level: "",
  phone: "",
  providerId: "",
  siteId: "",
  vip: "",
  subAgentId: "",
});
const codeOptions = ref([]);
const type = ref("");
const rules = ref({
  id: [{ required: true, message: "请输入id", trigger: "blur" }],
  desc: [{ required: true, message: "请输入desc", trigger: "blur" }],
  complete: [{ required: true, message: "请选择类型", trigger: "blur" }],
  award: [{ required: true, message: "请选择类型", trigger: "blur" }],
  expired: [{ required: true, message: "请选择过期时间", trigger: "blur" }],
  "items.code": [{ required: true, message: "请输入code", trigger: "blur" }],
  "items.num": [{ required: true, message: "请输入数量", trigger: "blur" }],
  "content.lang": [{ required: true, message: "请选择语言", trigger: "blur" }],
  "content.title": [{ required: true, message: "请输入标题", trigger: "blur" }],
  "content.message": [
    { required: true, message: "请输入内容", trigger: "blur" },
  ],
});
const showTimes = ref(false);
const paramsValue = ref(false);
const searchChange = (e, params) => {
  if (params && e.target.value == "") {
    searchInfo.value[params] = null;
  }
  onSubmit();
};

const formMail = ref({
  receivers: [],
  expired: "",
  items: [
    {
      code: "",
      num: null,
    },
  ],
  content: [
    {
      lang: "en",
      title: "",
      message: "",
    },
  ],
  status: 0,
});

const rulesMail = ref({
  id: [{ required: true, message: "请输入id", trigger: "blur" }],
  "content.lang": [{ required: true, message: "请选择语言", trigger: "blur" }],
  "content.title": [
    { required: true, message: "请选输入标题", trigger: "blur" },
  ],
  "content.message": [
    { required: true, message: "请选输入内容", trigger: "blur" },
  ],
  expired: [{ required: true, message: "请选择过期时间", trigger: "blur" }],
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const searchInfo = ref({});
const completeOptions = ref([
  { label: "EN", value: "en" },
  { label: "CN", value: "cn" },
  { label: "ID", value: "id" },
  { label: "JA", value: "ja" },
  { label: "KM", value: "km" },
  { label: "KO", value: "ko" },
  { label: "MS", value: "ms" },
  { label: "MY", value: "my" },
  { label: "PT", value: "pt" },
  { label: "TH", value: "th" },
  { label: "VI", value: "vi" },
]);
const accountTypeOption = ref([
  { label: "normal", value: 1 },
  { label: "visitor", value: 2 },
]);
const handleDateChange = () => {
  if (formMail.value.expired) {
    const isoDate = dayjs(formMail.value.expired).format(
      "YYYY-MM-DDTHH:mm:ssZ"
    );
    formMail.value.expired = isoDate;
  }
};
watch(
  () => tableData.value,
  () => {
    setAuthorityIds();
  }
);
const handleDateChangeSearch = (params, index) => {
  if (index === 0) {
    const isoDate = dayjs(params).format("YYYY-MM-DDTHH:mm:ssZ");
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
const setAuthorityIds = () => {
  tableData.value &&
    tableData.value.forEach((user) => {
      user.authorityIds =
        user.authorities &&
        user.authorities.map((i) => {
          return i.authorityId;
        });
    });
};
const authOptions = ref([]);
const setOptions = (authData) => {
  authOptions.value = [];
  setAuthorityOptions(authData, authOptions.value);
};
const tempAuth = {};
const changeAuthority = async (row, flag, removeAuth) => {
  if (flag) {
    if (!removeAuth) {
      tempAuth[row.ID] = [...row.authorityIds];
    }
    return;
  }
  await nextTick();
  const res = await setUserAuthorities({
    ID: row.ID,
    authorityIds: row.authorityIds,
  });
  if (res.code === 0) {
    ElMessage({ type: "success", message: "角色设置成功" });
  } else {
    if (!removeAuth) {
      row.authorityIds = [...tempAuth[row.ID]];
      delete tempAuth[row.ID];
    } else {
      row.authorityIds = [removeAuth, ...row.authorityIds];
    }
  }
};

const clickBetDetail = (id) => {
  let query = {};
  query["id"] = id;
  router.push({ name: "userItemInOut", query });
};
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

const handleChange = (number, index, params, params2) => {
  if (params == "v4") {
    if (number >= 1000000000) {
      if (params2) {
        return number / 1000000000 + "B";
      } else {
        return (formMail.value.items[index].num = number / 1000000000 + "B");
      }
    } else if (number >= 1000000) {
      if (params2) {
        return number / 1000000 + "M";
      } else {
        return (formMail.value.items[index].num = number / 1000000 + "M");
      }
    } else if (number >= 1000) {
      if (params2) {
        return number / 1000 + "K";
      } else {
        return (formMail.value.items[index].num = number / 1000 + "K");
      }
    } else {
      if (params2) {
        return number.toString();
      } else {
        return (formMail.value.items[index].num = number.toString());
      }
    }
  }
};
const delContent = (index) => {
  formMail.value.content.splice(index, 1);
};
const addContent = () => {
  formMail.value.content.push({
    lang: "en",
    title: "",
    message: "",
  });
};

// 初始化相关
const setAuthorityOptions = (AuthorityData, optionsData) => {
  AuthorityData &&
    AuthorityData.forEach((item) => {
      if (item.children && item.children.length) {
        const option = {
          authorityId: item.authorityId,
          authorityName: item.authorityName,
          children: [],
        };
        setAuthorityOptions(item.children, option.children);
        optionsData.push(option);
      } else {
        const option = {
          authorityId: item.authorityId,
          authorityName: item.authorityName,
        };
        optionsData.push(option);
      }
    });
};
const switchStatus = async (row) => {
  let myUserInfo = JSON.parse(JSON.stringify(row));

  let params = {
    accountId: myUserInfo.accountId,
    status: myUserInfo.status,
  };
  const res = await setUserInfo(params);
  if (res.code === 0) {
    ElMessage({
      type: "success",
      message: `${
        params.status === 0
          ? t("user.enabledSuccessfully")
          : t("user.disabledSuccessfully")
      }`,
    });
    await getTableData();
  }
};
const syncing = ref(false);

const enterSyncDialog = async () => {
  syncing.value = true;
  const res = await enterSyncApi(syncApiData.value);
  syncing.value = false;
  if (res.code === 0) {
    ElMessage({
      type: "success",
      message: res.msg,
    });
    syncApiFlag.value = false;
    getTableData();
  }
};
const addItem = () => {
  formMail.value.items.push({
    code: "",
    num: null,
  });
};
const delItem = (index) => {
  formMail.value.items.splice(index, 1);
};

const onReset = () => {
  searchInfo.value = {};
  value2.value = [];
  paramsValue.value = true;
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
    // value2.value.forEach((item, index) => {
    //   handleDateChangeSearch(item, index);
    // });
  } else {
    searchInfo.value.start = null;
    searchInfo.value.end = null;
  }
  const table = await getUserList({
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
  const res = await getAuthorityList({
    page: 1,
    pageSize: 999,
  });
  setOptions(res.data.list);
  const itemData = await virtualItemGetList({
    page: page.value,
    pageSize: 9999,
  });
  if (itemData.code === 0) {
    codeOptions.value = itemData.data.list;
  }
};

initPage();

// 批量操作
const handleSelectionChange = (val) => {
  if (val.length > 0) {
    let arr = [];
    val.forEach((item) => {
      arr.push(item.accountId);
    });
    formMail.value.receivers = arr;
  }
};
const multipleTable = ref(null);

const syncApiData = ref({
  newApis: [],
  deleteApis: [],
  ignoreApis: [],
});

const syncApiFlag = ref(false);

// 弹窗相关
const apiForm = ref(null);
const initForm = () => {
  apiForm.value.resetFields();
  form.value = {
    status: "",
    email: "",
    nickname: "",
    username: "",
    updated: "",
    logout: "",
    login: "",
    lastUpdate: 0,
    accountId: "",
    accountType: null,
    clientId: "",
    avatarId: "",
    country: "",
    createAt: "",
    diamond: "",
    experience: "",
    followOnlineNotify: "",
    gender: "",
    invitationCode: "",
    ipaddr: "",
    like: "",
    level: "",
    phone: "",
    providerId: "",
    siteId: "",
    vip: "",
    subAgentId: "",
  };
};
// 弹窗相关
const mailForm = ref(null);
const initMailForm = () => {
  mailForm.value.resetFields();
  formMail.value = {
    receivers: [],
    expired: "",

    items: [
      {
        code: "",
        num: null,
      },
    ],
    content: [
      {
        lang: "en",
        title: "",
        message: "",
      },
    ],
    status: 0,
  };
};

const dialogTitle = ref(t("general.add"));
const dialogFormVisible = ref(false);
const sendMailVisible = ref(false);
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
const oneSend = ref(false);
const sendMail = (key) => {
  if (key !== undefined) {
    oneSend.value = true;
    formMail.value.receivers = [];
    formMail.value.receivers.push(key.accountId);
  } else {
    oneSend.value = false;
  }
  sendMailVisible.value = true;
};

const closeMail = () => {
  initMailForm();
  multipleTable.value.clearSelection();
  sendMailVisible.value = false;
  valueExpired.value = "";
};

function isJSON(str) {
  if (typeof str !== "string") {
    return false;
  } else {
    return true;
  }
}
const editTackFunc = async (row) => {
  let rows = JSON.parse(JSON.stringify(row));
  form.value = rows;
  openDialog("edit");
};

const enterDialog = async () => {
  apiForm.value.validate(async (valid) => {
    if (valid) {
      switch (type.value) {
        case "add":
          {
            // form.value.id = Number(form.value.id);
            // const res = await createTack(form.value);
            // if (res.code === 0) {
            //   ElMessage({
            //     type: "success",
            //     message:  t("user.userAddedNote"),
            //     showClose: true,
            //   });
            // }
            // getTableData();
            // closeDialog();
          }

          break;
        case "edit":
          {
            // const res = await updateTack(form.value);
            // if (res.code === 0) {
            //   ElMessage({
            //     type: "success",
            //     message:  t("user.userEditedNote") ,
            //     showClose: true,
            //   });
            // }
            // getTableData();
            // closeDialog();
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
const enterMail = async () => {
  mailForm.value.validate(async (valid) => {
    if (valid) {
      if (formMail.value.items != null && formMail.value.items.length) {
        formMail.value.items.map((item, index) => {
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

      if (valueExpired.value) {
        formMail.value.expired = valueExpired.value;
      } else {
        return ElMessage.warning(
          t("tableColumn.placeholder") + t("tableColumn.expired")
        );
      }
      const res = await sendMailGo(formMail.value);
      if (res.code === 0) {
        ElMessage({
          type: "success",
          message: t(`tableColumn.sentSuccessfully`),
          showClose: true,
        });
        closeMail();
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
    const res = await deleteTack({ id: row.id });
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
  padding-bottom: 50px;
}
</style>
  