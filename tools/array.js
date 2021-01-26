// 找到最后一个小于等于给定值的元素下标
export const findLastLessValue = (arr, target) => {
  if (!arr || arr.length <= 0) return -1
  let low = 0; let
    high = arr.length - 1
  while (low <= high) {
    const mid = low + ((high - low) >> 1)
    if (arr[mid] > target) high = mid - 1
    else {
      if (mid === arr.length - 1 || arr[mid + 1] > target) {
        if (mid === arr.length - 1) return arr.length - 1
        return mid
      } low = mid + 1
    }
  }
  return -1
}
