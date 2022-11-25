import { Canvas2D } from './canvas2D/Canvas2D'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
if (canvas === null) {
  alert('无法获取HTMLCanvasElement ! ! ! ')
  throw new Error('无法获取HTMLCanvasElement ! ! ! ')
}
const canvas2d = new Canvas2D(canvas)
canvas2d.drawText('Hello World')
