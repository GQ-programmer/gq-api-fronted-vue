<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="接口名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="2">
                  <a-select-option value="2">全部</a-select-option>
                  <a-select-option value="0">关闭</a-select-option>
                  <a-select-option value="1">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="请求方法">
                  <a-select v-model="queryParam.method" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="POST">POST</a-select-option>
                    <a-select-option value="GET">GET</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="middle"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
        :scroll="{ x: 800}"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :color='text | stausColorFilter' :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="time" slot-scope="text">
          {{$formatDate(text)}}
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <template v-if='record.status === 0'>
              <a-divider type="vertical" />
              <a @click="handleOnline(record)" >发布</a>
              <a-divider type="vertical" />
            </template>
            <template v-if='record.status === 1'>
              <a-divider type="vertical" />
              <a @click="handleOffline(record)" >下线</a>
              <a-divider type="vertical" />
            </template>
            <a @click="handleSub(record)" style='color:red;'>删除</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import {
  deleteInterface,
  getInterfaceList,
  getRoleList, offlineInterface,
  onlineInterface,
  saveInterface,
  updateInterface
} from '@/api/manage'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
    width: '70px'
  },
  {
    title: '接口名称',
    dataIndex: 'name',
    width: '100px'
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: '200px',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: 'url',
    dataIndex: 'url',
    needTotal: true,
    width: '200px',
    scopedSlots: { customRender: 'description' }
    // customRender: (text) => text + ' 次'
  },
  {
    title: '请求方法',
    dataIndex: 'method',
    width: '100px'
  },
  {
    title: '请求参数',
    dataIndex: 'requestParams',
    scopedSlots: { customRender: 'description' },
    width: '200px'
  },
  {
    title: '请求头',
    dataIndex: 'requestHeader',
    scopedSlots: { customRender: 'description' },
    width: '200px'
  },
  {
    title: '响应头',
    dataIndex: 'responseHeader',
    scopedSlots: { customRender: 'description' },
    width: '200px'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    width: '100px'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: (a, b) => Date.parse(a.createTime) - Date.parse(b.createTime),
    scopedSlots: { customRender: 'time' },
    width: '160px'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    sorter: (a, b) => Date.parse(a.createTime) - Date.parse(b.createTime),
    scopedSlots: { customRender: 'time' },
    width: '160px'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

const statusMap = {
  0: {
    status: 'error',
    text: '关闭',
    color: '#f50'
  },
  1: {
    status: 'processing',
    text: '运行中',
    color: '#87d068'
  },
  2: {
    status: 'success',
    text: '已上线',
    color: '#108ee9'
  },
  3: {
    status: 'error',
    text: '异常',
    color: '#f50'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getInterfaceList(requestParameters)
          .then(res => {
            console.log(res.data)
            res.data.total = res.data.total - 0
            res.data.size = res.data.size - 0
            res.data.current = res.data.current - 0
            res.data.pages = res.data.pages - 0
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    stausColorFilter (type) {
      return statusMap[type].color
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    getRoleList({ t: new Date() })
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            updateInterface(values)
              .then(res => {
                console.log(res)
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
                if (res.code === 0 && res.data !== null) {
                  this.$message.success('修改成功')
                } else {
                  this.$message.error(res.message)
                }
              })
          } else {
            // 新增
            saveInterface(values)
              .then(res => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
                if (res.code === 0 && res.data !== null) {
                  this.$message.success('新增成功')
                } else {
                  this.$message.error(res.message)
                }
              })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      this.$confirm({
        title: '确定删除该接口吗？',
        class: 'test',
        content: `接口名称：${record.name}`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          deleteInterface(record).then(res => {
            if (res.code === 0 && res.data !== null) {
              this.$message.success('删除成功')
            } else {
              this.$message.error(res.message)
            }
            this.$refs.table.refresh()
          })
        }
      })
    },
    handleOnline (record) {
      this.$confirm({
        title: '确定发布该接口吗？',
        class: 'test',
        content: `接口名称：${record.name}`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          onlineInterface(record).then(res => {
            if (res.code === 0 && res.data !== null) {
              this.$message.success('发布接口成功')
            } else {
              this.$message.error(res.message)
            }
            this.$refs.table.refresh()
          })
        }
      })
    },
    handleOffline (record) {
      this.$confirm({
        title: '确定下线该接口吗？',
        class: 'test',
        content: `接口名称：${record.name}`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          offlineInterface(record).then(res => {
            if (res.code === 0 && res.data !== null) {
              this.$message.success('接口下线成功')
            } else {
              this.$message.error(res.message)
            }
            this.$refs.table.refresh()
          })
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>

<style>

</style>
