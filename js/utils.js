// 运动函数
function move(ele, options, fn = function () {}) {
  let count = 0
  for (let k in options) {
    count++
    // if (count == ele.children.length-1) return fn()
    let type = k, target = options[k]
    if (type === 'opacity') target *= 100
    const timer = setInterval(() => {
      let current
      if (type === 'opacity') {
        current = window.getComputedStyle(ele)[type] * 100
      } else {
        current = parseInt(window.getComputedStyle(ele)[type])
      }
      let distance = (target - current) / 10
      distance = distance > 0 ? Math.ceil(distance) : Math.floor(distance)
      if (current === target) {
        clearInterval(timer)
        count--
        if (!count) fn()
        return
      }
      if (type === 'opacity') {
        ele.style[type] = (current + distance) / 100
      } else {
        ele.style[type] = current + distance + 'px'
      }
    }, 10)
  }
}
