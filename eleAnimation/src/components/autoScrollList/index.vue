<template>
  <section class="wrap">
    <header class="header">
      <h1>自动滚动列表</h1>
    </header>
    <section class="bd">
      <auto-scroll
        height="200px"
        width="130px"
        :haveData="moreData"
        s
        :loading="loading"
        :flag="page"
        @notice="loadData"
      >
        <ul class="test_scroll" :data-flag="page">
          <li v-for="(item, index) in list" :key="index">
            {{ item }}
          </li>
        </ul>
      </auto-scroll>
    </section>
  </section>
</template>
<script>
import autoScroll from './autoScrollList'
import { scrollDir } from './config'
export default {
  components: { autoScroll },
  data () {
    return {
      list: ['1', '1', '1', '1', '1', '1', '1'],
      moreData: false,
      loading: false,
      firstLoad: true,
      uid: 0,
      page: 0,
      cityList: [
        ['1', '1', '1', '1', '1', '1', '1'],
        ['2', '2', '2', '2', '2', '2', '2'],
        ['3', '3', '3', '3', '3', '3', '3'],
        ['4', '4', '4', '4', '4', '4', '4'],
        ['5', '5', '5', '5', '5', '5', '5'],
        ['6', '6', '6', '6', '6', '6', '6'],
        ['7', '7', '7', '7']
      ],
      startPage: -1,
      endPage: 0
    }
  },
  watch: {
    startPage (value) {
      console.log('startPage', value, this.loading)
    },
    endPage (value) {
      console.log('endPage', value)
    }
  },
  mounted () { },
  methods: {
    loadData (type) {
      this.loading = true
      this.moreData = false
      if (type === scrollDir.up) {
        if (this.startPage <= 0) {
          this.moreData = false
          this.loading = false
          return
        }
      }
      if (type === scrollDir.down) {
        if (this.endPage === this.cityList.length - 1) {
          this.moreData = false
          this.loading = false
          return
        }
      }
      setTimeout(() => {
        this.list = this.getCity(type)
        this.moreData = true
        this.loading = false
      }, 1000)
    },
    delay () { },
    getCity (type) {
      let result
      this.page++
      if (type === scrollDir.down) {
        this.endPage++
        this.startPage++

        result = this.cityList[this.endPage % this.cityList.length]
      } else if (type === scrollDir.up) {
        this.endPage = this.endPage - 1 > 0 ? this.endPage - 1 : 0
        this.startPage = this.startPage - 1 > 0 ? this.startPage - 1 : 0
        result = this.cityList[
          (this.startPage > 0 ? this.startPage : 0) % this.cityList.length
        ]
      }
      return result
    }
  }
}
</script>

<style lang="less" scoped>
.wrap {
  .header {
    width: 100%;
    height: 1.333333rem;
    text-align: center;
    line-height: 1.333333rem;
    font-size: 0.666667rem;
    color: #fff;
    background: chocolate;
  }
  .bd {
    padding: 0.666667rem;
    .test_scroll {
      li {
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        background: #f5f5f5;
        border-bottom: 1px solid;
        &:nth-child(2n) {
          background: #c0c0c0;
        }
      }
    }
  }
}
</style>
