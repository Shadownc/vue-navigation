<template>
  <div>
    <div class="page-header">
      <div class="header-container">
        <router-link to="/" class="back-button">
          <i class="el-icon-arrow-left"></i> 返回首页
        </router-link>
        <h2 class="page-title">推荐网站</h2>
      </div>
    </div>
    
    <div class="container">
      <el-card>
        <el-form ref="ruleForm" label-width="100px" :model="form" :rules="rules"  v-loading="formLoading">

          <el-form-item label="网站链接" prop="href">
            <el-input placeholder="http://www.baidu.com/" v-model="form.href"  :disabled="type === 'update'" @blur="getNavInfo" />
            <span style="color: red">输入链接自动爬取信息</span>
          </el-form-item>

          <el-form-item label="网站标签" prop="tags">
            <el-select
              v-model="form.tags"
              multiple
              :multiple-limit="5"
              filterable
              allow-create
              default-first-option
              placeholder="输入网站标签，最多5个">
              <el-option
                v-for="item in tags"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网站名称" prop="name">
            <el-input placeholder="输入网站名称" v-model="form.name" />
          </el-form-item>

          <el-form-item label="网站logo" prop="logo">
            <el-input placeholder="输入网站logo" v-model="form.logo" />
            <img style="max-width: 30px;" :src="form.logo" />
          </el-form-item>
          <el-form-item label="网站描述" prop="desc">
            <el-input placeholder="一句话网站描述，15个字以内" v-model="form.desc" />
          </el-form-item>
          <el-form-item label="网站分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="请选择" filterable>
              <el-option-group
                v-for="group in categorys"
                :key="group._id"
                :label="group.name"
              >
                <el-option
                  v-for="item in group.children"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐人名称" prop="authorName">
            <el-input placeholder="填写你推广的名称" v-model="form.authorName" />
          </el-form-item>
          <el-form-item label="推荐人网站" prop="authorUrl">
            <el-input placeholder="填写你要推广的链接" v-model="form.authorUrl" />
          </el-form-item>
          <el-form-item label="网站详情" prop="detail">
            <el-input type="textarea" placeholder="输入网站详情" v-model="form.detail" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="addNav('ruleForm')">
              提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
import api from "../api";

export default {
  name: "Recommend",
  data() {
    return {
      loading: false,
      formLoading: false,
      categorys: [],
      tags: [],
      type: 'add',
      form: {
        href: '',
        categoryId: '',
        name: '',
        tags: [],
        logo: '',
        desc: '',
        authorName: '',
        authorUrl: ''
      },
      rules: {
        href: [
          { required: true, message: '请输入url', trigger: 'blur' },
          {
            pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/,
            message: '请输入正确的url',
          },
        ],
        tags: [
          { required: true, message: '请输入标签', trigger: 'blur' },
        ],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' },],
        desc: [{ required: true, message: '请输入描述', trigger: 'blur' },],
        logo: [{ required: true, message: '请输入logo', trigger: 'blur' },],
        authorUrl: [
          {
            pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/,
            message: '请输入正确的url',
            trigger: 'change'
          },
        ],
        authorName: [
          {
            pattern: /^[\u4e00-\u9fa5]{2,6}$/,
            message: '作者名称在2个字到6个字以内',
            trigger: 'change'
          },
        ],
      },
      isMoreForm: false,
    }
  },
  methods: {
    async getTags() {
      try {
        const res = await api.getTagList()
        if (res.data && res.data.code === 1) {
          let data = res.data.data && res.data.data.data || [];
          data = data.map(item=> {
            item.value = item.name
            item.label = item.name
            return item
          })
          this.tags = data
        }
      } catch (error) {
        console.error(error)
        // 检查是否是跨域错误
        if (this.isCorsError(error)) {
          this.$message.error('跨域请求被拒绝，API服务器可能不允许直接访问');
        } else {
          this.$message.error('获取标签失败，请稍后重试');
        }
      }
    },
    async getCategorys() {
      try {
        const response = await api.getCategoryList()
        this.categorys = response.data.data
      } catch (error) {
        console.error(error)
        // 检查是否是跨域错误
        if (this.isCorsError(error)) {
          this.$message.error('跨域请求被拒绝，API服务器可能不允许直接访问');
        } else {
          this.$message.error('获取分类失败，请稍后重试');
        }
      }
    },
    async addNav(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const res = await api.addNav(this.form)
            if (res.data && res.data.code === 0) {
              this.$message.error(`${res.data.msg}`)
            } else {
              this.$message(`感谢您的提交，请等待后台审核通过！`)
              this.$refs.ruleForm.resetFields()
            }
          } catch (error) {
            console.error(error)
            // 检查是否是跨域错误
            if (this.isCorsError(error)) {
              this.$message.error('跨域请求被拒绝，API服务器可能不允许直接访问');
            } else {
              this.$message.error(`提交失败，请稍后再试`)
            }
          } finally {
            this.loading = false
          }
        } else {
          return false
        }
      })
    },
    async getNavInfo() {
      const { href: url } = this.form
      if (!url) return
      this.formLoading = true
      try {
        const response = await api.getNavReptile(url)
        // 获取嵌套的data
        const data = response.data && response.data.data
        let origin = url.split('/')[2] || ''
        this.form.logo = `https://icoapi.100769.xyz/favicon/${origin}.png`
        this.form.name = data && data.name
        this.form.desc = data && data.desc
      } catch (e) {
        console.error(e)
        // 检查是否是跨域错误
        if (this.isCorsError(e)) {
          this.$message.error('跨域请求被拒绝，API服务器可能不允许直接访问');
        } else {
          this.$message.error('请求超时')
        }
      } finally {
        this.formLoading = false
      }
    },
    // 检查错误是否是跨域问题
    isCorsError(error) {
      return (
        // 检查是否无响应（通常是跨域问题）
        error.message && error.message.includes('Network Error') ||
        // 检查状态码（0通常表示跨域问题）
        (error.response && error.response.status === 0) ||
        // 检查是否有CORS错误
        error.message && error.message.includes('CORS')
      );
    }
  },
  created() {
    this.getTags()
    this.getCategorys()
  },
}
</script>

<style lang="scss" scoped>
.page-header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  margin-bottom: 20px;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  color: #4700f1;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(-3px);
  }
  
  i {
    margin-right: 5px;
  }
}

.page-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 30px;
}
</style> 