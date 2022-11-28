export function createRandomParticleFullScreen(
  initRoundPopulation: number = 1000
) {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const context = canvas.getContext('2d')
  if (canvas === null) {
    alert('无法获取HTMLCanvasElement ! ! ! ')
    throw new Error('无法获取HTMLCanvasElement ! ! ! ')
  }

  const WIDTH = document.documentElement.clientWidth
  const HEIGHT = document.documentElement.clientHeight

  canvas.width = WIDTH
  canvas.height = HEIGHT

  if (context !== null) {
    const roundor = new createRound(context, initRoundPopulation, WIDTH, HEIGHT)
    roundor.animate()
  }
}

class createRound {
  round: RoundItem[] = []
  w: number
  h: number
  ctx: CanvasRenderingContext2D

  constructor(
    context: CanvasRenderingContext2D,
    initRoundPopulation: number,
    w: number,
    h: number
  ) {
    this.ctx = context
    this.w = w
    this.h = h

    for (let i = 0; i < initRoundPopulation; i++) {
      this.round[i] = new RoundItem(i, Math.random() * w, Math.random() * h)
      this.round[i].draw(context)
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.w, this.h)

    for (let i in this.round) {
      if (this.round[i] instanceof RoundItem) {
        this.round[i].move(this.ctx, this.w, this.h)
      }
    }
    requestAnimationFrame(this.animate.bind(this))
  }
}

class RoundItem {
  index: number // 为了区分不同的圆，设置一个唯一的 index 参数。
  x: number // x 坐标
  y: number // y 坐标
  r: number // 半径
  color: string // 颜色

  constructor(index: number, x: number, y: number) {
    this.index = index
    this.x = x
    this.y = y
    this.r = Math.random() * 2 + 1
    const alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2
    this.color = `rgba(255, 255, 255, ${alpha})`
  }

  draw(context: CanvasRenderingContext2D) {
    context.save()
    context.fillStyle = this.color
    context.shadowBlur = this.r * 2
    context.beginPath()
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
    context.closePath()
    context.fill()
    context.restore()
  }

  move(context: CanvasRenderingContext2D, width: number, height: number) {
    this.x -= 1
    this.y -= 1
    if (this.x <= -10) {
      this.x = width + 10
    }
    if (this.y <= -10) {
      this.y = height + 10
    }
    this.draw(context)
  }
}
