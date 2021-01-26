<template>
  <section
    ref="scroll_wrap"
    :style="{ height: height, width: width }"
    :class="['easy_auto_list']"
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
      spectionNode: null,
      preNode: null,
      preScrollTop: 0,
      preOffsetheight: 0,
      dir: 1, // 0上 1下
      sliding: false,
      transtionMove: false,
      canRequest: true,
      firstLoad: true,
      maxScrollTop: 0
    }
  },
  computed: {

  },
  watch: {
    haveData: {
      handler: function (newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.updateChildrenNode()
            this.canRequest = true
          })
        } else {
          // if(!this.loading)this.canRequest = true
        }
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.preNode = this.$refs.scroll_wrap.children[0].cloneNode(true)
    },
    autoScroll () {
      // offsetTop 是不变的
      if (this.isBottom()) {
        const domLen = this.$refs.scroll_wrap.children.length
        this.stopScroll()
        this.spectionOperation()
        this.preScrollTop = this.$refs.scroll_wrap.scrollTop
        this.preNode = domLen > 1 ? this.$refs.scroll_wrap.children[domLen - 1].cloneNode(true) : this.$refs.scroll_wrap.children[0].cloneNode(true)
        this.preOffsetheight = domLen > 1 ? this.getOffsetHeight() : 0
        this.canRequest = false
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
    // 什么时候可以自己控制
    scrollEvent (e) {
      const rootScroll = this.$refs.scroll_wrap
      if (!this.sliding || this.transtionMove || !this.canRequest) {
        e.preventDefault()
        return false
      }
      // 2020/1/11 存在三个ul的情况需要处理
      if (this.isBottom()) {
        const domLen = this.$refs.scroll_wrap.children.length
        this.stopScroll()
        this.spectionOperation()
        this.preScrollTop = rootScroll.scrollTop
        this.preNode = domLen > 1 ? this.$refs.scroll_wrap.children[domLen - 1].cloneNode(true) : this.$refs.scroll_wrap.children[0].cloneNode(true)
        this.preOffsetheight = domLen > 1 ? this.getOffsetHeight() : 0
        this.dir = scrollDir.down
        this.canRequest = false
        this.$emit('notice', scrollDir.down)
      }
      if (this.isTop()) {
        this.stopScroll()
        this.preScrollTop = rootScroll.scrollTop
        this.preNode = this.$refs.scroll_wrap.children[0].cloneNode(true)
        this.dir = scrollDir.up
        this.canRequest = false
        this.$emit('notice', scrollDir.up)
      }
    },
    isBottom () {
      const ele = this.$refs.scroll_wrap
      if (ele.scrollHeight - ele.scrollTop - ele.clientHeight <= 0.5) return true
      return false
    },
    isTop () {
      if (this.$refs.scroll_wrap.scrollTop < 1) return true
      return false
    },
    updateChildrenNode () {
      if (this.firstLoad) {
        this.firstLoad = false
        this.maxScrollTop = this.$refs.scroll_wrap.scrollHeight - this.$refs.scroll_wrap.clientHeight
        this.restartScroll()
        return
      }
      // 什么时候去删除子节点，会存在下一次请求的数据长度不够的情况 2020/12/29
      // insertBefore 插入的元素无法被自然消除
      if (this.$refs.scroll_wrap.children.length >= 2) {
        // 需要唯一标志判断 给ul加唯一标志
        try {
          const newData = Array.from(this.$refs.scroll_wrap.children).find(item => {
            return item.dataset.flag.toString() === this.flag.toString()
          })
          if (!newData) throw new Error('some wrong')
          this.filterChildNode(this.$refs.scroll_wrap)
        } catch (error) {
          console.log(error)
        }
      }
      if (this.dir === scrollDir.up) {
        this.$refs.scroll_wrap.insertBefore(this.preNode, null)
        this.$refs.scroll_wrap.scrollTop = this.$refs.scroll_wrap.children[0].offsetHeight
        this.transtionMove = true
        this.scrollTo(this.$refs.scroll_wrap, 0, 2500)
      } else if (this.dir === scrollDir.down) {
        const node = this.$refs.scroll_wrap.children[0]
        this.$refs.scroll_wrap.insertBefore(this.preNode, node)
        if (this.spectionNode) {
          this.$refs.scroll_wrap.insertBefore(this.spectionNode, this.$refs.scroll_wrap.children[0])
          this.spectionNode = null
        }
        // 2020/1/8 scrollTop还需要确认
        this.$refs.scroll_wrap.scrollTop = this.preScrollTop - this.preOffsetheight > 0 ? this.preScrollTop - this.preOffsetheight : this.preScrollTop
      }
      this.dir = scrollDir.down
      this.maxScrollTop = this.$refs.scroll_wrap.scrollHeight - this.$refs.scroll_wrap.clientHeight
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
    filterChildNode (parentDom) { // 记录offsetHeight 根据上、下滑动
      if (!parentDom) return
      const delectList = []
      for (const child of parentDom.children) {
        if (child.dataset.flag.toString() === this.flag.toString()) continue
        delectList.push(child)
      }
      delectList.forEach(item => {
        parentDom.removeChild(item)
      })
    },
    mouseoverEvent () {
      if (!this.canRequest) return
      this.stopScroll()
    },
    mouseleaveEvent () {
      if (!this.canRequest) return
      this.restartScroll()
    },
    spectionOperation () {
      this.spectionNode = null
      const domLen = this.$refs.scroll_wrap.children.length
      if (domLen >= 2) {
        if (this.$refs.scroll_wrap.children[domLen - 1].offsetHeight < this.$refs.scroll_wrap.offsetHeight) {
          this.spectionNode = this.$refs.scroll_wrap.children[domLen - 2].cloneNode(true)
        }
      }
    },
    getOffsetHeight () {
      const children = Array.from(this.$refs.scroll_wrap.children)
      let offsetHeight = 0
      for (let i = 0; i < children.length - 1; i++) offsetHeight += children[i].offsetHeight
      return offsetHeight
    }
  }
}
</script>

<style lang='less' scoped>
.easy_auto_list {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: overlay;
  overflow-x: hidden;
}
.noscroll {
  overflow-y: hidden;
}
</style>
