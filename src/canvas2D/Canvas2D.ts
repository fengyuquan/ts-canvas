class Canvas2D {
  context: CanvasRenderingContext2D | null

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')
  }

  drawText(text: string): void {
    // Canvas2D和webGL这种底层绘图API都是状态机模式
    //
    // 每次绘制前调用save将即将要修改的状态记录下来
    // 每次绘制后调用restore将已修改的状态丢弃，恢复到初始化时的状态
    //
    // 这样的好处是状态不会混乱
    // 假设当前绘制文本使用红色，如果你没有使用save/restore配对函数的话
    // 则下次调用其他绘图函数时，如果你没更改颜色，则会继续使用上次设置的红色进行绘制
    // 随着程序越来越复杂，如不使用save/restore来管理，最后整个渲染状态会极其混乱
    // 请时刻保持使用save / restore配对函数来管理渲染状态
    if (this.context !== null) {
      this.context.save()

      // 让要绘制的文本居中对齐
      this.context.textBaseline = 'middle'
      this.context.textAlign = 'center'

      // 计算canvas的中心坐标
      let centerX: number = this.context.canvas.width * 0.5
      let centerY: number = this.context.canvas.height * 0.5

      // 红色填充
      this.context.fillStyle = 'red'
      //调用文字填充命令
      this.context.fillText(text, centerX, centerY)

      //绿色描边
      this.context.strokeStyle = 'green'
      //调用文字描边命令
      this.context.strokeText(text, centerX, centerY)

      //将上面context中的textAlign, extBaseLine, fillStyle, strokeStyle状态恢复到初始化状态
      this.context.restore()
    }
  }

  drawCircle(
    x: number,
    y: number,
    radius: number,
    isFill: boolean = true,
    color: string = 'white',
    shadowOp?: {
      shadowColor?: string
      shadowBlur?: number
      shadowOffsetX?: number
      shadowOffsetY?: number
    }
  ): void {
    // Canvas2D和webGL这种底层绘图API都是状态机模式
    //
    // 每次绘制前调用save将即将要修改的状态记录下来
    // 每次绘制后调用restore将已修改的状态丢弃，恢复到初始化时的状态
    //
    // 这样的好处是状态不会混乱
    if (this.context !== null) {
      this.context.save()

      if (typeof shadowOp?.shadowColor === 'string') {
        this.context.shadowColor = shadowOp.shadowColor
      }
      if (typeof shadowOp?.shadowBlur === 'number') {
        this.context.shadowBlur = shadowOp.shadowBlur
      }
      if (typeof shadowOp?.shadowOffsetX === 'number') {
        this.context.shadowOffsetX = shadowOp.shadowOffsetX
      }
      if (typeof shadowOp?.shadowOffsetY === 'number') {
        this.context.shadowOffsetY = shadowOp.shadowOffsetY
      }

      this.context.beginPath() // 起始一条路径，或重置当前路径
      this.context.arc(x, y, radius, 0, Math.PI * 2) // 创建弧/曲线
      this.context.closePath() // 创建从当前点回到起始点的路径

      if (isFill) {
        this.context.fillStyle = color // 设置或返回用于填充绘画的颜色、渐变或模式
        this.context.fill() // 填充当前绘图（路径）
      } else {
        this.context.strokeStyle = color
        this.context.stroke()
      }

      //将上面context中的textAlign, extBaseLine, fillStyle, strokeStyle状态恢复到初始化状态
      this.context.restore()
    }
  }

  drawDot(x: number, y: number, color: string = 'white') {
    this.drawCircle(x, y, 1, true, color)
  }

  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    lineWidth: number = 1,
    color: string = 'white'
  ): void {
    if (this.context !== null) {
      this.context.save()

      this.context.beginPath()
      this.context.lineWidth = lineWidth
      this.context.moveTo(x1, y1)
      this.context.lineTo(x2, y2)
      this.context.strokeStyle = color
      this.context.stroke()

      //将上面context中的textAlign, extBaseLine, fillStyle, strokeStyle状态恢复到初始化状态
      this.context.restore()
    }
  }

  drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    isFill: boolean = true,
    color: string = 'white'
  ): void {
    // Canvas2D和webGL这种底层绘图API都是状态机模式
    //
    // 每次绘制前调用save将即将要修改的状态记录下来
    // 每次绘制后调用restore将已修改的状态丢弃，恢复到初始化时的状态
    //
    // 这样的好处是状态不会混乱
    if (this.context !== null) {
      this.context.save()

      this.context.beginPath() // 起始一条路径，或重置当前路径
      if (isFill) {
        this.context.fillStyle = color // 设置或返回用于填充绘画的颜色、渐变或模式
        this.context.fillRect(x, y, w, h)
      } else {
        this.context.strokeStyle = color
        this.context.strokeRect(x, y, w, h)
      }

      //将上面context中的textAlign, extBaseLine, fillStyle, strokeStyle状态恢复到初始化状态
      this.context.restore()
    }
  }
}

export { Canvas2D }
