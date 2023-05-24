<template>
<!--  <page-header-wrapper>-->
  <a-card :bordered="false" title='接口详情'>
    <div>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-card :bordered='false'>
            <a-descriptions >
              <a-descriptions-item label="接口名称" :span="3">{{ data.name }}</a-descriptions-item>
              <a-descriptions-item label="描述" :span="3">{{ data.description }}</a-descriptions-item>
              <a-descriptions-item label="请求方式" :span="3">{{ data.method }}</a-descriptions-item>
              <a-descriptions-item label="请求地址" :span="3">{{ data.url }}</a-descriptions-item>
              <a-descriptions-item label="请求参数" :span="3">{{ data.requestParams }}</a-descriptions-item>
              <a-descriptions-item label="请求头" :span="3">{{ data.requestHeader }}</a-descriptions-item>
              <a-descriptions-item label="响应头" :span="3">{{ data.responseHeader }}</a-descriptions-item>
              <a-descriptions-item label="状态" :span="3">
                <a-badge :color="data.status | statusColorFilter" :status="data.status | statusTypeFilter" :text="data.status | statusFilter" />
              </a-descriptions-item>
              <a-descriptions-item label="创建时间" :span="3">{{ $formatDate(data.createTime) }}</a-descriptions-item>
              <a-descriptions-item label="更新时间" :span="3">{{ $formatDate(data.updateTime) }}</a-descriptions-item>
              {{data}}
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card :bordered="false">
            <a-row>
              <a-col :xl="4" :sm="4" :xs="24" style='width: 12%'>
                <a-button class="invoke-button" type="text">POST</a-button>
              </a-col>
              <a-col :xl="16" :sm="16" :xs="24">
                <a-input class="invoke-input" style='pointer-events: none;' :placeholder="data.url"></a-input>
              </a-col>
              <a-col :xl="5" :sm="5" :xs="24">
                <a-button type='primary' style='float: right' :loading="invokeLoading" @click="invokeInterface">在线调用</a-button>
              </a-col>
            </a-row>
            <p style='font-weight: bold'></p>
            <a-form>
              <a-form-item label="请求参数" :validate-status="requestParamStatus" :help="requestParamHelp">
                <a-textarea placeholder='请输入请求参数'  style='height: 80px' v-model="userRequestParams" :rows="3"></a-textarea>
              </a-form-item>
              <a-form-item label="返回结果" style='margin-bottom: 0px;'>
                <a-textarea style="pointer-events: none;height: 200px" :value="requestResult" :rows="3"></a-textarea>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <template #actions>
      <a-button style='float: right' @click="$router.back()">返回</a-button>
    </template>
    </a-card>
<!--  </page-header-wrapper>-->
</template>

<script>
import { STable } from '@/components'
import { getInterfaceDetail, invokInface } from '@/api/manage'

export default {
  components: {
    STable
  },
  data () {
    return {
      data: {},
      userRequestParams: '',
      requestResult: '',
      invokeLoading: false,
      requestParamStatus: 'success',
      requestParamHelp: ''
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: {
          status: 'default',
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
      return statusMap[status].text
    },
    statusColorFilter (type) {
      const statusMap = {
        0: {
          status: 'default',
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
      return statusMap[type].color
    },
    statusTypeFilter (type) {
      const statusMap = {
        0: {
          status: 'default',
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
      return statusMap[type].status
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  watch: {
    userRequestParams (newValue, oldValue) {
      console.log('newValue:' + newValue)
      if (newValue === '') {
        this.requestParamStatus = 'error'
        this.requestParamHelp = '请求参数不能为空'
      } else {
        this.requestParamStatus = ''
        this.requestParamHelp = ''
      }
    }
  },
  created () {
    getInterfaceDetail({ id: this.$route.params.id }).then(res => {
      this.data = res.data
    })
  },
  methods: {
    invokeInterface () {
      if (this.userRequestParams === '' || this.userRequestParams === null) {
        this.requestParamStatus = 'error'
        this.requestParamHelp = '请求参数不能为空'
        return
      }
      this.invokeLoading = true
      const paramter = {
        id: this.data.id,
        userRequestParams: this.userRequestParams
      }
      invokInface(paramter).then(res => {
        setTimeout(() => {
          this.invokeLoading = false
          this.requestResult = JSON.stringify(res.data)
        }, 1500)
      }).catch(() => {
        this.invokeLoading = false
      })
    }
  }

}
</script>

<style lang="less" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  :deep(.ant-card-head-title) {
    display: block;
    float: left;
    padding-right: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 18px;
    line-height: 32px;
  }
  :deep(.ant-descriptions-item-label){
    font-weight: bold;
  }
  .ant-descriptions{
      width: 60%;
      margin: auto;
  }
  :deep(.ant-card-actions) {
    margin: 0;
    padding: 5px;
    padding-right: 40px;
    list-style: none;
    background: white;
    border-top: 1px solid #e8e8e8;
    zoom: 1;
  }
  .invoke-button {
    background-color: #49cc90;
    color: white;
    border: 1px #DAE2F3;
    box-shadow: none;
  }
  .invoke-input {
    box-shadow: none;
    border: 1px solid #d9d9d9;
  }
  :deep(.ant-col-4) {
    display: block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
