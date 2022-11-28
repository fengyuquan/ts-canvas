import { Canvas2D } from './Canvas2D'

export function basicUse() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const context = canvas.getContext('2d')
  if (canvas === null) {
    alert('无法获取HTMLCanvasElement ! ! ! ')
    throw new Error('无法获取HTMLCanvasElement ! ! ! ')
  }
  
  // const canvas2d = new Canvas2D(canvas)
  // canvas2d.drawText('Hello World')

  // canvas2d.drawCircle(100, 100, 50, true, '#fff', {
  //   shadowBlur: 20,
  //   shadowColor: '#fff',
  // })
  // canvas2d.drawDot(100, 200)
  // canvas2d.drawLine(100, 300, 300, 300)
  // canvas2d.drawRect(100, 400, 50, 50, false)

  if (context !== null) {
    // 渐变
    // const grd = context.createLinearGradient(400, 100, 500, 300)
    // grd.addColorStop(0, 'pink')
    // grd.addColorStop(1, 'white')
    // context.fillStyle = grd
    // context.fillRect(500, 100, 200, 200)
    // 缩放
    // 在设置 scale() 方法之后再设置的矩形，无论是线条的宽度还是坐标的位置，都被放大了。并且 scale() 的效果是可以叠加的，也就是说，我们在上面的例子中使用了两次 scale(2,2) 那么，最后一个矩形相对于第一个矩形长和宽，以及坐标的位置就放大了 4 倍。
    // context.strokeStyle = 'white'
    // context.strokeRect(5, 5, 50, 25)
    // context.scale(2, 2)
    // context.strokeRect(5, 5, 50, 25)
    // context.scale(2, 2)
    // context.strokeRect(5, 5, 50, 25)
    // 旋转
    // 旋转了 20°，在进行图形变换的时候，我们需要画布旋转，然后再绘制图形。
    // 这样的结果是，我们使用的图形变换的方法都是作用在画布上的，既然对画布进行了变换，那么在接下来绘制的图形都会变换。这点是需要注意的。
    // context.fillStyle = 'white'
    // context.rotate((20 * Math.PI) / 180)
    // context.fillRect(70, 30, 200, 100)
  }
}
