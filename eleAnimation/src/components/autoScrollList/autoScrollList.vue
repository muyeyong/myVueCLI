<template>
  <section
    ref="scroll_wrap"
    class="easy_auto_list"
    :style="{ height: height, width: width }"
    @mouseover="mouseoverEvent"
    @mouseleave="mouseleaveEvent"
    @scroll="scrollEvent"
  >
    <slot />
  </section>
</template>

<script>
import { scrollDir } from './config'

export default {
  // 需要注意的点：更新的数据的位置 上滑后需要改变状态
  // 2021/1/7 滑动的时候，移开鼠标会触发restart事件，不应该，解决办法：移除鼠标监听事事件，等数据加载完在重新监听
  // or 加一层判断 stopScroll  restartScroll 不直接调用方法
  name: 'AutoScroll',
  props: {
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    },
    haveData: Boolean,
    loading: Boolean,
    flag: {
      type: [String, Number],
      required: true
    }
  },
  emits: ['notice'],
  data () {
    return {
      timeInterval: null,
      firstNode: null,
      secondNode: null,
      preNode: null,
      preScrollTop: 0,
      preOffsetheight: 0,
      dir: 1, // 0上 1下
      listenChildChange: false, // 判断是否监听childrenDom变化
      end: false,
      start: false,
      sliding: false,
      transtionMove: false,
      canRequest: true
    }
  },
  watch: {
    haveData: {
      handler (newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.canRequest = true
            this.updateChildrenNode()
          })
        } else if (!this.loading) this.canRequest = true
      },
      deep: true
    },
    loading: {
      handler (newVal) {
        if (!newVal) {
          // this.canRequest = true
        }
      },
      deep: true
    }

  },
  mounted () {
    // this.listener()
    this.init()
  },
  methods: {
    init () {
      this.preNode = this.$refs.scroll_wrap.children[0].cloneNode(true)
      this.timeInterval = setInterval(() => {
        this.autoScroll()
      }, 15)
    },
    autoScroll () {
      // offsetTop 是不变的
      if (this.isBottom()) {
        this.stopScroll()
        this.preScrollTop = this.$refs.scroll_wrap.scrollTop
        this.preNode = this.$refs.scroll_wrap.children.length > 1 ? this.$refs.scroll_wrap.children[1].cloneNode(true) : this.$refs.scroll_wrap.children[0].cloneNode(true)
        this.$emit('notice', scrollDir.down)
      } else {
        this.$refs.scroll_wrap.scrollTop++
      }
    },
    stopScroll () {
      this.sliding = true
      this.timeInterval && clearInterval(this.timeInterval)
    },
    restartScroll () {
      this.sliding = false
      this.dir = scrollDir.down
      this.timeInterval && clearInterval(this.timeInterval)
      this.timeInterval = setInterval(() => {
        // 重启 secondNode firstNode的scrollTop scrollHeight需要考虑 2020/12/28
        this.autoScroll()
      }, 15)
    },
    // 判断滑动方向，是否到底/顶
    scrollEvent () {
      const rootScroll = this.$refs.scroll_wrap
      if (!this.sliding || this.transtionMove || !this.canRequest) return
      if (rootScroll.scrollTop - this.preScrollTop > 0) {
        if (this.isBottom()) {
          this.stopScroll()
          this.preNode = this.$refs.scroll_wrap.children.length > 1 ? this.$refs.scroll_wrap.children[1].cloneNode(true) : this.$refs.scroll_wrap.children[0].cloneNode(true)
          this.dir = scrollDir.down
          this.canRequest = false
          this.$emit('notice', scrollDir.down)
        }
      } else if (this.isTop()) {
        this.stopScroll()
        this.dir = scrollDir.up
        this.preNode = this.$refs.scroll_wrap.children[0].cloneNode(true)
        this.canRequest = false
        this.$emit('notice', scrollDir.up)
      }
      this.preScrollTop = rootScroll.scrollTop
    },
    isBottom () {
      const ele = this.$refs.scroll_wrap
      if (ele.scrollHeight - ele.scrollTop - ele.clientHeight <= 1) return true
      return false
    },
    isTop () {
      if (this.$refs.scroll_wrap.scrollTop < 1) return true
      return false
    },
    updateChildrenNode () {
      // 什么时候去删除子节点，会存在下一次请求的数据长度不够的情况 2020/12/29
      // insertBefore 插入的元素无法被自然消除
      if (this.$refs.scroll_wrap.children.length >= 2) {
        // 需要唯一标志判断 给ul加唯一标志
        try {
          const newData = Array.from(this.$refs.scroll_wrap.children).find((item) => item.dataset.flag.toString() === this.flag.toString())
          if (!newData) throw new Error('some wrong')
          this.filterChildNode(this.$refs.scroll_wrap, newData)
        } catch (error) {
          console.log(error)
        }
      }
      if (this.dir === scrollDir.up) {
        this.$refs.scroll_wrap.insertBefore(this.preNode, null)
        this.$refs.scroll_wrap.scrollTop = Math.abs(this.preScrollTop - this.preOffsetheight)
        this.transtionMove = true
        this.scrollTo(this.$refs.scroll_wrap, 0, 2000)
      } else if (this.dir === scrollDir.down) {
        const node = this.$refs.scroll_wrap.children[0]
        this.$refs.scroll_wrap.insertBefore(this.preNode, node)
        this.$refs.scroll_wrap.scrollTop = this.preScrollTop - this.preOffsetheight
      }
      this.dir = scrollDir.down
      // this.canRequest = true
      this.restartScroll()
    },
    scrollTo (element, to, duration) {
      if (duration <= 0) {
        setTimeout(() => {
          this.transtionMove = false
        }, 100)
        return
      }
      const difference = to - element.scrollTop
      const perTick = difference / duration * 10
      setTimeout(() => {
        element.scrollTop += perTick
        if (element.scrollTop === to) {
          setTimeout(() => {
            this.transtionMove = false
          }, 100)
          return
        }
        this.scrollTo(element, to, duration - 10)
      }, 10)
    },
    filterChildNode (parentDom, spectionDom) {
      if (!parentDom) return
      for (const child of parentDom.children) {
        if (child === spectionDom) continue
        this.preOffsetheight = child.offsetHeight
        parentDom.removeChild(child)
      }
    },
    mouseoverEvent () {
      if (!this.canRequest) return
      this.stopScroll()
    },
    mouseleaveEvent () {
      if (!this.canRequest) return
      this.restartScroll()
    }
  }
}
</script>

<style lang='less' scoped>
.easy_auto_list {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: auto;
  background: #fff;
}
</style>
