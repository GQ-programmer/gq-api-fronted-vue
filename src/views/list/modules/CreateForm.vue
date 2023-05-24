<template>
  <a-modal
    title="新建接口"
    :width="540"
    :visible="visible"
    :confirmLoading="loading"
    okText='提交'
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout"  :wrapper-col="wrapperCol" :label-col="labelCol">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="接口名称">
          <a-input placeholder='请输入接口名称' v-decorator="['name', {rules: [{required: true, min: 1, message: '接口名称不能为空！'}]}]" />
        </a-form-item>
        <a-form-item label="描述">
          <a-input placeholder='请输入接口描述信息' v-decorator="['description', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]" />
        </a-form-item>
        <a-form-item label="url">
          <a-input placeholder='请输入接口地址' v-decorator="['url', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]" />
        </a-form-item>
        <a-form-item label="请求方法">
          <a-select v-decorator="['method', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则描述！'}]}]" placeholder="请选择" >
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="GET">GET</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="请求头">
          <a-textarea placeholder='请输入请求头信息' :rows="3" v-decorator="['requestHeader', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]" />
        </a-form-item>
        <a-form-item label="响应头">
          <a-textarea placeholder='请输入响应头信息' :rows="3" v-decorator="['responseHeader', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['description', 'id', 'name', 'url', 'requestHeader', 'responseHeader', 'method']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      labelCol: {},
      wrapperCol: {}
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
<style>
.ant-modal-body {
  padding: 44px;
  padding-top: 24px;
  padding-bottom: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}
</style>
