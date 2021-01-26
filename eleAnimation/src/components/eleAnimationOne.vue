<template>
  <div class="wrap">
    <header class="header">
      <h1>饿了么动画效果演示</h1>
    </header>
    <section class="main">
      <section id="foodMenu" ref="foodMenu" class="foodMenu">
        <ul>
          <li
            v-for="(item, index) in foods"
            :key="index"
            :class="index === activeMenuIndex ? 'activeMenu' : ''"
            @click="handleMenuClick(index)"
          >
            {{ item.menuName }}
          </li>
        </ul>
      </section>
      <section id="foodList" ref="foodList" class="foodList">
        <div class="foodList_wrap">
          <ul v-for="(item, index) in foods" :key="index">
            <span class="menuName">{{ item.menuName }}</span>
            <li v-for="(food, foodIndex) in item.menuList" :key="foodIndex">
              {{ food.name }}
              <section class="operation">
                <transition name="showReduce">
                  <span
                    v-if="food.count"
                    @click="removeCar(item.menuName, foodIndex)"
                  >
                    <svg-icon class="reduce_icon" icon-class="reduce" />
                  </span>
                </transition>
                <transition name="fade">
                  <span v-if="food.count">{{ food.count }}</span>
                </transition>
                <span @click="addCar(item.menuName, foodIndex, $event)">
                  <svg-icon class="add_icon" icon-class="add" />
                </span>
              </section>
            </li>
          </ul>
        </div>
      </section>
    </section>
    <footer class="footer">
      <section class="car_contain">
        <section
          ref="carContain"
          :class="{ car_icon: true, moveDone: dotMoveDone }"
        >
          <span class="count">{{ totalCount }}</span>
          <svg-icon class="buyCar_icon" icon-class="buyCar" />
        </section>
      </section>
      <section :class="{ pay: true, canPay: totalCount > 0 }">
        <span>广告位招租</span>
      </section>
    </footer>
    <transition
      v-for="(v, index) in moveDotList"
      :key="index"
      appear
      @after-appear="dotAfterEnter"
      @before-appear="dotBeforeEnter"
    >
      <span v-if="v" class="move_dot">
        <svg-icon class="add_icon" icon-class="add" />
      </span>
    </transition>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { foods } from '../../mockData/index'
import { findLastLessValue } from '../../tools/array'

export default {
  name: 'Elem',
  data () {
    return {
      foods,
      foodsLisTop: [], // 食品大类距离顶部的距离
      foodScroll: null,
      activeMenuIndex: 0,
      moveDotList: [],
      elBottom: 0,
      elLeft: 0,
      windowHeight: null,
      dotMoveDone: false,
      totalCount: 0,
      menuClickEvent: false
    }
  },
  mounted () {
    this.windowHeight = window.innerHeight
    this.getFoodListHeight()
  },
  methods: {
    getFoodListHeight () {
      const foodListContainer = this.$refs.foodList
      if (foodListContainer) {
        const listArr = Array.from(foodListContainer.children[0].children)
        listArr.forEach((item, index) => {
          this.foodsLisTop[index] = item.offsetTop
        })
        this.listenScroll(foodListContainer)
      }
    },
    listenScroll (element) {
      this.foodScroll = new BScroll(element, {
        probeType: 3,
        deceleration: 0.001,
        bounce: false,
        swipeTime: 2000,
        click: true
      })
      const menuScroll = new BScroll('#foodMenu', {
        click: true
      })
      const menuHeight = this.$refs.foodMenu.clientHeight
      this.foodScroll.on('scroll', (pos) => {
        if (!this.$refs.foodMenu) return
        const targetIndex = findLastLessValue(this.foodsLisTop, Math.abs(Math.round(pos.y)))
        if (targetIndex !== -1 && !this.menuClickEvent) {
          this.activeMenuIndex = targetIndex
          const nextMenu = this.$refs.foodMenu.querySelectorAll('.activeMenu')[0]
          menuScroll.scrollToElement(nextMenu, 800, 0, -(menuHeight / 2 - 50))
        }
      })
    },
    handleMenuClick (index) {
      this.menuClickEvent = true
      this.activeMenuIndex = index
      this.foodScroll.scrollTo(0, -this.foodsLisTop[index], 400)
      this.foodScroll.on('scrollEnd', () => {
        this.menuClickEvent = false
      })
    },
    removeCar (fatherName, childIndex) {
      const target = this.foods.find((item) => item.menuName === fatherName)
      if (target) {
        const { count } = target.menuList[childIndex]
        this.totalCount = this.totalCount > 0 ? this.totalCount - 1 : 0
        target.menuList[childIndex].count = count > 0 ? count - 1 : 0
      }
    },
    addCar (fatherName, childIndex, event) {
      const target = this.foods.find((item) => item.menuName === fatherName)
      if (target) {
        this.totalCount += 1
        this.elLeft = event.target.getBoundingClientRect().left
        this.elBottom = event.target.getBoundingClientRect().bottom
        this.moveDotList.push(true)
        const { count } = target.menuList[childIndex]
        target.menuList[childIndex].count = count + 1
      }
    },
    listenInCart () {
      if (!this.dotMoveDone) {
        this.dotMoveDone = true
        this.$refs.carContain.addEventListener('animationend', () => {
          this.dotMoveDone = false
        })
        this.$refs.carContain.addEventListener('webkitAnimationend', () => {
          this.dotMoveDone = false
        })
      }
    },
    dotAfterEnter (el) {
      el.style.transform = 'translate3d(0,0,0)'
      el.children[0].style.transform = 'translate3d(0,0,0)'
      el.style.transition = 'transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)'
      el.children[0].style.transition = 'transform .55s linear'
      // eslint-disable-next-line no-unused-vars
      this.moveDotList = this.moveDotList.map((item) => false)
      el.children[0].style.opacity = 1
      el.children[0].addEventListener('transitionend', () => {
        this.listenInCart()
      })
      el.children[0].addEventListener('webkitAnimationEnd', () => {
        this.listenInCart()
      })
    },
    dotBeforeEnter (el) {
      el.style.transform = `translate3d(0,${37 + this.elBottom - this.windowHeight}px,0)`
      el.children[0].style.transform = `translate3d(${this.elLeft - 30}px,0,0)`
      el.children[0].style.opacity = 0
    }
  }
}
</script>

<style lang='less' scoped >
* {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
}
@keyframes carScale {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.75);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@-webkit-keyframes carScale {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.75);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
.wrap {
  background: #529bda;
  .header {
    position: static;
    top: 0;
    h1 {
      width: 100%;
      height: 1.066667rem;
      line-height: 1.066667rem;
      font-size: 0.533333rem;
      text-align: center;
    }
  }
  .main {
    position: absolute;
    top: 1.333333rem;
    bottom: 1.333333rem;
    display: flex;
    overflow: hidden;
    width: 100%;
    max-width: 10rem;
    min-width: 4.266667rem;
    .foodMenu {
      flex: 2;
      overflow: auto;
      overflow-x: hidden;
      background: #f2f4f6;
      ul {
        li {
          width: 100%;
          height: 1.333333rem;
          line-height: 1.333333rem;
          border-bottom: 0.013333rem solid #ccc;
          text-align: left;
          font-size: 0.466667rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding-left: 0.133333rem;
        }
        .activeMenu {
          border-left: 0.106667rem solid #529bda;
        }
      }
    }
    .foodList {
      flex: 6;
      overflow: auto;
      overflow-x: hidden;
      background: #fff;
      ul {
        .menuName {
          display: block;
          width: 100%;
          height: 1rem;
          padding-left: 0.133333rem;
          line-height: 1rem;
          font-size: 0.533333rem;
        }
        li {
          position: relative;
          height: 1.2rem;
          line-height: 1.2rem;
          font-size: 0.666667rem;
          margin: 0 0.4rem;
          border-bottom: 0.013333rem solid #ccc;
          .operation {
            position: absolute;
            top: 0;
            right: 0;
            text-align: center;
            display: flex;
            justify-content: flex-end;
            width: 2rem;
            align-items: center;
          }
        }
      }
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 1.333333rem;
  background: rgb(61, 61, 63);
  max-width: 10rem;
  min-width: 4.266667rem;
  .moveDone {
    animation: carScale 0.5s ease-in-out;
  }
  .car_contain {
    position: relative;
    float: left;
    width: 70%;
    height: 100%;
    .car_icon {
      display: flex;
      width: 0.933333rem;
      height: 0.933333rem;
      .count {
        position: absolute;
        top: 0;
        left: 0.566667rem;
        display: block;
        width: 0.5rem;
        height: 0.5rem;
        text-align: center;
        border-radius: 50%;
        color: #fff;
        font-size: 0.4rem;
        background: #ec5728;
      }
    }
  }
  .pay {
    float: right;
    width: 30%;
    height: 1.333333rem;
    text-align: center;
    line-height: 1.333333rem;
    font-size: 0.666667rem;
    color: #fff;
    background: #535356;
  }
  .canPay {
    background: #529bda;
  }
}
.move_dot {
  position: fixed;
  bottom: 30px;
  left: 30px;
  .add_icon {
    width: 0.266667rem;
    height: 0.266667rem;
  }
}

.showReduce-enter-active,
.showReduce-leave-active {
  transition: all 0.3s ease-out;
}
.showReduce-enter,
.showReduce-leave-active {
  opacity: 0;
  transform: translateX(1rem);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
