module.exports = `<template>
  <div class="form-{{name_snake_case}}">
    <form-create :rule="rule" v-model="fApi" :option="options" />
    <div class="form-btn" v-if="type == 'edit' || type == 'insert'">
      <el-button type="primary" plain @click="submit">保存</el-button>
      <el-button plain @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
import { mapRequest } from 'rd-http';
export default {
  name: 'Form{{nameCamelCase}}',
  props: {
    formData: Object,
    type: {
      type: String,
      // edit, insert, view
      default: 'view'
    }
  },
  data() {
    return {
      fApi: {},
      options: {
        submitBtn: false
      },
      rule: [
        {{#each rules ~}}
        {
          type: '{{type}}',
          field: '{{field}}',
          title: '{{title}}',
          validate: [
            {{#each validate ~}}
            { {{#each this ~}}
            {{@key}}: 
              {{~#if (isstring this) ~}}
                '{{this}}'
              {{~else~}}
                {{this}}
              {{~/if~}},
            {{~/each}} },
            {{/each}}
          ],
          props: {
            disabled: this.type === 'view',
            {{#each props ~}}
            {{@key}}: {{this}},
            {{/each}}
          }
        },
        {{~/each}}
      ]
    };
  },
  mounted() {
    if (this.type == 'edit') {
      this.getDetail();
    } else if (this.type == 'insert') {
      // TODO: 有需要可以填, 没有可以把这个if删掉
    } else if (this.type == 'view') {
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      this.{{api_detail}}(
        this.$qs.stringify({
          // TODO: 接口参数
        })
      ).then(res => {
        // TODO: 初始化表单值
        // this.setFormVlue(res.data);
      });
    },
    submit() {
      this.fApi.submit((formData, $f) => {
        // console.log($f, formData, JSON.stringify(formData), 'fapi');
        if (this.type == 'edit') {
          this.{{api_edit}}(this.$qs.stringify(formData)).then(res => {
            this.$message.success(res.msg);
            this.$emit('confirm', '编辑成功');
          });
        } else if (this.type == 'insert') {
          // console.log(formData);
          this.{{api_add}}(this.$qs.stringify(formData)).then(res => {
            this.$message.success(res.msg);
            this.$emit('confirm', '新增成功');
          });
        }
      });
    },
    reset() {
      this.fApi.resetFields();
    },
    ...mapRequest(['{{api_detail}}', '{{api_edit}}', '{{api_add}}'])
  }
};
</script>
`;
