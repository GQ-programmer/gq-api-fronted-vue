<template>
  <page-header-wrapper>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="接口列表">

      <a-list size="large" :pagination="pagination">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.description">
<!--            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>-->
            <a slot="title">{{ item.name }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="doDetail(item)">详情</a>
          </div>
<!--          <div class="list-content">-->
<!--            <div class="list-content-item">-->
<!--              <span>Owner</span>-->
<!--              <p>{{ item.owner }}</p>-->
<!--            </div>-->
<!--            <div class="list-content-item">-->
<!--              <span>开始时间</span>-->
<!--              <p>{{ item.startAt }}</p>-->
<!--            </div>-->
<!--            <div class="list-content-item">-->
<!--              <a-progress :percent="item.progress.value" :status="!item.progress.status ? null : item.progress.status" style="width: 180px" />-->
<!--            </div>-->
<!--          </div>-->
        </a-list-item>
      </a-list>
    </a-card>
  </page-header-wrapper>
</template>
<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import TaskForm from '../interface/modules/TaskForm'
import Info from './components/Info'
import { getInterfaceList } from '@/api/manage'

export default {
  name: 'Index',
  components: {
    TaskForm,
    Info
  },
  data () {
    return {
      data: [],
      status: 'all',
      pagination: {
        size: 'small',
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        total: 1,
        current: 1,
        onChange: (page) => {
          this.pagination.current = page
          this.paginationChange(page)
        }
      }
    }
  },
  methods: {
    doDetail (record) {
      this.$router.push({
        name: 'interfaceDetail',
        params: {
          id: record.id
        }
      })
    },
    paginationChange (page) {
      getInterfaceList(this.pagination)
        .then(res => {
          console.log(res.data)
          this.pagination.total = res.data.total
          this.data = res.data.records
        })
    }
  },
  created () {
    getInterfaceList(this.pagination)
      .then(res => {
        this.data = res.data.records
      })
  }
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
  width: 48px;
  height: 48px;
  line-height: 48px;
}

.list-content-item {
  color: rgba(0, 0, 0, .45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
  span {
    line-height: 20px;
  }
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}

.ant-list-item-meta-title {
  margin-bottom: 4px;
  color: black;
  font-size: 16px;
  line-height: 22px;
  font-weight: bold;
}
</style>
