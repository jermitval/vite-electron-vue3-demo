<template>
  <Main>
    <div class="container" flex-col>
      <div class="hd" flex-row>
        <div class="title">
          <i
            v-show="form.category"
            class="iconfont icon-arrow-left"
            @click="change({ category: '' })"
          />
          <span>我的记账本</span>
          <span>{{ showForm ? " - 新增账单" : "" }}</span>
        </div>
        <!-- 操作栏 -->
        <div flex-row class="action" v-show="!showForm">
          <ElSelect
            :model-value="String(Route.query.month ?? '')"
            class="select-month"
            placeholder="筛选月份"
            size="default"
            :fit-input-width="true"
            :clearable="true"
            @change="v => change({ month: v })"
          >
            <ElOption
              v-for="item in months"
              :key="item.v"
              :label="item.n"
              :value="item.v"
            >
            </ElOption>
          </ElSelect>
          <Button
            class="btn"
            @click="handler"
            data-action="add"
            text="新增账单"
            success
            v-show="!showForm"
          />
        </div>
        <div class="action" @click="handler" v-show="showForm">
          <Button
            class="btn"
            v-loading="prevent"
            data-action="submit"
            text="保存"
            success
          />
          <Button class="btn" data-action="cancel" text="取消" danger />
        </div>
      </div>

      <div class="bd" flex-row>
        <!-- 左侧 -->
        <div class="left" flex-col>
          <!-- 类型列表 -->
          <div class="list" scrollable>
            <i
              :class="['iconfont', 'icon-desc', sorted ? 'sorted' : '']"
              title="排序"
              @click="sort(!sorted)"
            />

            <div
              ref="LeftRows"
              :class="[
                'row',
                item.id == form.category ? typee[item.type] : false
              ]"
              flex-row
              v-for="item in categories"
              :title="typec[item.type]"
              @click="change({ category: item.id })"
              :data-id="item.id"
            >
              <div>{{ item.name }}</div>
              <div right :class="['text', typec[item.type]]" v-show="item.sum">
                <span>{{ cfloat(item.sum) }} 元</span>
              </div>
            </div>
          </div>

          <!-- 金额统计 -->
          <div class="summary" v-show="!form.category && !showForm">
            <div class="text in">
              <span>收入</span>
              <span>{{ cfloat(totalIn) }} 元</span>
            </div>
            <div>
              <span>支出</span>
              <span>{{ cfloat(totalOut) }} 元</span>
            </div>
          </div>
        </div>

        <!-- 右侧 - 账单列表 -->
        <div class="right list" scrollable v-show="!showForm && list?.length">
          <div class="row" flex-row v-for="item in list">
            <div justify>
              <div v-if="item.category" v-show="!form.category">
                {{ categoriesEnum[item?.category] }}
              </div>
              <div>{{ cdatetime(item.time) }}</div>
            </div>
            <div :class="['col', typee[item.type]]" v-show="!form.category">
              <span>{{ typec[item.type] }}</span>
            </div>
            <div right>{{ cfloat(item.amount) }} 元</div>
          </div>
        </div>
        <div class="right bg" v-if="!showForm && !list?.length">
          <span>当前无账单记录</span>
        </div>

        <ElForm
          ref="Form"
          :hide-required-asterisk="true"
          :model="form"
          :rules="rules"
          label-position="top"
          class="right form custom"
          v-show="showForm"
          @submit.native.prevent
        >
          <ElFormItem label="所属分类" prop="category">
            <ElSelect
              ref="SelectCategory"
              :model-value="form.category"
              class="select-category"
              placeholder="选择分类"
              size="default"
              :fit-input-width="true"
              :clearable="true"
              @change="v => change({ category: v })"
            >
              <ElOption
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </ElOption>
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="账单金额(元)" prop="amount">
            <ElInputNumber
              ref="InputAmount"
              v-model="form.amount"
              :precision="2"
              :controls="false"
              :disabled="prevent"
            />
            <div
              flex-row
              v-if="form.category && lastAmount && form.amount != lastAmount"
            >
              <i class="iconfont icon-arrow-left" />
              <div
                class="btn"
                @click="form.amount = Number(lastAmount)"
                title="快速填入最近账单金额"
              >
                <span>{{ lastAmount }} 元</span>
              </div>
            </div>
          </ElFormItem>
        </ElForm>
      </div>
    </div>
  </Main>
</template>

<script setup lang="ts">
import { bill } from "@/api"
import { cfloat, cdatetime } from "@/util/filter"
import * as APP from "@/util/app"
import * as VR from "@/util/vr"
import { onMounted, ref, reactive, nextTick } from "vue"
import { useRoute, onBeforeRouteUpdate } from "vue-router"
import { ElNotification } from "element-plus"
import type { FormInstance } from "element-plus"

const Form = ref<FormInstance>()

const Route = useRoute()

/** 所有月份 */
const months = Array.from({ length: 12 }, (v, k) => ({
  v: k + 1,
  n: k + 1 + "月"
}))

/** 账单分类列表 */
const categories = ref([] as Array<Category>)
/** 账单分类列表(缓存;用于恢复默认排序) */
let categoriesCache: Array<Category> = []
/** 账单列表 */
const list = ref([] as Array<Bill>)
/** 账单分类中文对照 */
const categoriesEnum = {} as { [key: string]: string }
/** 合计收入 */
const totalIn = ref(0)
/** 合计支出 */
const totalOut = ref(0)
/** 账单分类下最近一次金额 */
const lastAmount = ref()
/** 显示表单 */
const showForm = ref(false)
/** 是否排序 */
const sorted = ref(true)
/** 表单数据 */
const form = reactive({
  /** 账单分类 */
  category: "",
  /** 账单金额 */
  amount: 0
})
/** 防抖 */
const prevent = ref(false)
/** 表单校验规则 */
const rules = reactive({
  category: [{ required: true, trigger: "change", message: "请在选择分类" }],
  amount: [
    {
      validator: (r: any, v: any, c: any) =>
        v == 0 ? c("金额不能等于0") : true,
      trigger: "change"
    }
  ]
})
/** 分类选择器 */
const SelectCategory = ref()
/** 金额输入框 */
const InputAmount = ref()
/** 左侧分类列表 */
const LeftRows = ref()

/** 类型中文对照 */
const typec: { [key: number]: string } = { 1: "收入", 0: "支出" }
/** 类型英文对照 */
const typee: { [key: number]: string } = { 1: "in", 0: "out" }

/**
 * 分类列表排序
 */
const sort = (val: boolean) => {
  sorted.value = val
  if (!LeftRows.value) return

  const sortedList = sorted.value
    ? categories.value.slice().sort((a, b) => (b.sum || 0) - (a.sum || 0))
    : null

  LeftRows.value.map((r: any, i: number) => {
    if (sortedList) {
      const idx = sortedList.findIndex(f => f.id == r.dataset.id)
      const y = LeftRows.value[idx].offsetTop - LeftRows.value[i].offsetTop
      LeftRows.value[i].style = `transform:translate(0, ${y}px`
      return
    }

    LeftRows.value[i].style = `transform:translate(0, 0)` // 默认排序
  })
}

/**
 * 获取账单分类列表
 * @param params
 */
const getCategories = async (params?: any) => {
  try {
    // 判断是否只有分类发生改变
    if (
      Route.query.category != params?.category &&
      Route.query.type == params?.type &&
      Route.query.month == params?.month
    ) {
      form.amount = 0
      lastAmount.value = categories.value.find(
        r => r.id == params?.category
      )?.lastAmount
      return
    }

    const r1 = await bill.getCategories({
      type: params?.type,
      month: params?.month
    })

    categories.value = r1.rows

    // 生成中文对照表
    r1.rows?.map((r: Category) => (categoriesEnum[r.id] = r.name))

    lastAmount.value = r1.rows.find(r => r.id == params?.category)?.lastAmount

    totalIn.value = r1.rows
      .filter(r => Number(r.type))
      .map(r => r.sum || 0)
      .reduce((a, b) => a + b)

    totalOut.value = r1.rows
      .filter(r => !Number(r.type))
      .map(r => r.sum || 0)
      .reduce((a, b) => a + b)
  } catch (error) {
    // todo notification
  }
}

/**
 * 获取账单列表
 * @param params
 */
const getList = async (params?: any) => {
  try {
    const r1 = await bill.getList({
      offset: params?.offset ?? 0,
      type: params?.type ?? null,
      month: Number(params?.month ?? 0),
      category: params?.category
    })

    list.value = r1.rows
  } catch (error) {
    // todo notification
  }
}

/**
 * 改变路由参数
 * @param que
 */
const change = (que: {
  /** 账单类型(1:收入;0;支出) */
  type?: number
  /** 月份 */
  month?: number
  /** 账单分类ID */
  category?: string
}) => {
  const query: any = { ...Route.query, ...que }
  for (let i in que) if (Route.query[i] == query[i]) query[i] = undefined
  form.category = query.category
  VR.replace({ query: query })
}

/** 表单验证封装 */
const validateForm = () =>
  new Promise((res, rej) =>
    Form.value?.validate((v, e) => {
      v ? res(true) : rej(new Error("表单校验失败"))
    })
  )

/**
 * 新增账单
 */
const addBil = async () => {
  try {
    await validateForm()

    if (prevent.value) return
    prevent.value = true
    await bill.addBill(APP.DEEPCOPY(form))

    await getCategories(Route.query)
    await getList(Route.query)

    await APP.SLEEP(800)
    ElNotification({
      type: "success",
      title: "系统提示",
      message: "新增成功"
    })
    prevent.value = false
    showForm.value = false
    form.amount = 0
  } catch (error) {
    prevent.value = false
    ElNotification({
      type: "error",
      title: "系统提示",
      message: error.message
    })
  }
}

/**
 * 操作栏点击事件处理器
 * @param e
 */
const handler = async (e: any) => {
  const action =
    e?.target?.getAttribute("data-action") ||
    e?.target?.parentElement?.getAttribute("data-action")

  switch (action) {
    case "add":
      showForm.value = true

      nextTick(() => {
        form.category ? InputAmount.value.focus() : SelectCategory.value.focus()
      })
      break
    case "cancel":
      showForm.value = false
      break

    case "submit":
      addBil()
      break

    default:
      break
  }
}

/**
 * 刷新数据
 * @param params
 */
const refresh = async (params: any) => {
  await getCategories(params)
  await getList(params)
}

// 挂载
onMounted(async () => {
  form.category = String(Route.query.category ?? "")

  await refresh(Route.query)
  await APP.SLEEP(300)
  sort(sorted.value)
})

// 路由改变之前
onBeforeRouteUpdate(async route => {
  await refresh(route.query)
  sort(sorted.value)
})
</script>

<style lang="scss" scoped>
$width-left: 300px;
$width-right: 430px;

[right] {
  text-align: right;
}

[flex-row] {
  display: flex;
  flex-flow: row nowrap;
}

[flex-col] {
  display: flex;
  flex-direction: column;
}

[justify] {
  font-family: "Helvetica Neue";
  flex-shrink: 0;
  width: auto !important;
}

Main {
  flex-flow: row nowrap !important;
  align-items: center;
  justify-content: center;
}

.container {
  background: $-gl-color-bg-block;
  border-radius: 4px;
  overflow: hidden;
  height: 80%;
}

// 头部
.hd {
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 0.5px solid $-gl-color-border;
  .icon-arrow-left {
    border-radius: 4px;
    margin-right: 10px;
    padding: 5px 5px;
    cursor: pointer;
    &:hover {
      background: $-gl-color-bg-block-hover;
    }
  }
  .title {
    font-weight: bold;
  }

  .select-month {
    width: 120px;
  }
  .action {
    Button {
      padding: 6.75px 10px;
    }
    & > div,
    & > Button {
      margin-left: 10px;
    }
  }
}

// 内容
.bd {
  height: 100%;
  overflow: hidden;
}

.list {
  .row {
    margin: 10px;
    border-radius: 6px;
    overflow: hidden;

    & > div {
      width: 100%;
      white-space: nowrap;

      &:not(:first-of-type) {
        margin-left: 10px;
      }
    }
    &:hover {
      background: $-gl-color-bg-block-hover;
      filter: brightness(0.95);
    }
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
  }
}

// 左侧区域
.left {
  width: $width-left;

  .list {
    position: relative;
    height: 100%;
    .row {
      transition: transform 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);
      cursor: pointer;
    }

    .icon-desc {
      opacity: 0;
      pointer-events: none;
    }
    &:hover {
      .icon-desc {
        opacity: 1;
        pointer-events: auto;
      }
    }
  }

  .iconfont {
    cursor: pointer;

    position: absolute;
    top: 0;
    left: 0;
    padding: 4px;
    z-index: 2;
    &:hover {
      background: $-gl-color-bg-block-hover;
      filter: brightness(0.95);
    }

    &.sorted {
      transform: rotateX(180deg);
    }
  }

  .summary {
    padding: 10px;
    border-top: 0.5px solid $-gl-color-border;
    & > div {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      padding: 5px 10px;
    }
  }
}
// 右侧区域
.right {
  border-left: 0.5px solid $-gl-color-border;
  box-sizing: border-box;
  width: $width-right;
}

.bg {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $-gl-color-lowkey;
  font-size: 22px;
  font-weight: 300;
}

// 收入支出样式
.col {
  border-radius: 4px;
  padding: 2px 10px;
}
.in,
.out {
  color: white;
}
.row.in,
.col.in {
  background: $-gl-color-orange !important;
}
.row.out,
.col.out {
  background: $-gl-color-red !important;
}

.text.in {
  color: $-gl-color-orange !important;
}
.text.out {
  color: $-gl-color-red !important;
}

.form {
  padding: 20px 25px;
  .icon-arrow-left {
    margin-left: 10px;
  }
}

.btn {
  background: $-gl-color-bg;
  border-radius: 4px;
  padding: 0 10px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background: $-gl-color-bg-hover;
  }
}
</style>
