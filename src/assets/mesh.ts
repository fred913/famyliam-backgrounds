import * as three from 'three'

export class ControlPoint {
  color = [0, 0, 0]
  location = [0, 0]
  uTangent = [0, 0]
  vTangent = [0, 0]
}

export function hex2float(s: string) {
  const color = new three.Color(s)
  color.convertSRGBToLinear()
  return color.toArray()
}

export function lerp(t: number, min: number, max: number) {
  return min + t * (max - min)
}

function render(canvas: string | HTMLCanvasElement, mesh: three.Mesh) {
  const cvs = typeof canvas === 'string' ? document.getElementById(canvas) : canvas
  if (!cvs) throw new Error('Canvas not found')

  const scene = new three.Scene()

  const camera = new three.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
  camera.position.z = 5

  const renderer = new three.WebGLRenderer({
    alpha: true,
    canvas: cvs,
    antialias: true,
  })
  // TODO figure out if this is necessary
  // renderer.inputColorSpace = three.SRGBColorSpace
  renderer.outputColorSpace = three.SRGBColorSpace

  scene.add(mesh)

  renderer.render(scene, camera)
}

function buildGeometry(
  points: Grid<[number, number, number]>,
  colors?: Grid<[number, number, number]>,
) {
  let vertexList: number[] = []
  let colorList: number[] = []

  for (let x = 0; x < points.width - 1; x++) {
    for (let y = 0; y < points.height - 1; y++) {
      vertexList = vertexList.concat([
        ...points.get(x, y),
        ...points.get(x + 1, y),
        ...points.get(x + 1, y + 1),

        ...points.get(x + 1, y + 1),
        ...points.get(x, y + 1),
        ...points.get(x, y),
      ])
    }
  }

  if (colors) {
    for (let x = 0; x < points.width - 1; x++) {
      for (let y = 0; y < points.height - 1; y++) {
        colorList = colorList.concat([
          ...colors.get(x, y),
          ...colors.get(x + 1, y),
          ...colors.get(x + 1, y + 1),

          ...colors.get(x + 1, y + 1),
          ...colors.get(x, y + 1),
          ...colors.get(x, y),
        ])
      }
    }
  }

  const geometry = new three.BufferGeometry()
  geometry.setAttribute('position', new three.BufferAttribute(new Float32Array(vertexList), 3))
  geometry.setAttribute('color', new three.BufferAttribute(new Float32Array(colorList), 3))

  return geometry
}

export class Grid<T> {
  elements: Array<T> = []

  width = 0

  height = 0

  constructor(width: number, height: number) {
    this.elements = new Array(width * height)
    this.height = height
    this.width = width
  }

  get(x: number, y: number) {
    return this.elements[x + y * this.width]
  }

  set(x: number, y: number, value: T) {
    this.elements[x + y * this.width] = value
  }

  foreach(block: (value: T, x: number, y: number) => void) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        block(this.elements[x + y * this.width], x, y)
      }
    }
  }
}

export class Handle {
  element: HTMLElement
  container: HTMLElement

  active: boolean
  callback: (x: number, y: number) => void
  current: [number, number]
  initialX: number
  initialY: number
  touchIndex: number
  xOffset = 0
  yOffset = 0

  currentX: number = 0
  currentY: number = 0

  dragStartListener: (e: TouchEvent | MouseEvent) => void
  dragEndListener: (e: TouchEvent | MouseEvent) => void
  dragListener: (e: DragEvent | TouchEvent | MouseEvent) => void

  constructor(selector: string, callback: (x: number, y: number) => void) {
    const elem = document.querySelector(selector)
    if (!elem) {
      console.error('Handle element not found', selector)
      throw new Error('Handle element not found')
    }
    this.element = elem as HTMLElement
    if (!this.element.parentElement) {
      console.error('Handle element has no parent', this.element)
      throw new Error('Handle element has no parent')
    }
    this.container = this.element.parentElement

    this.callback = callback

    this.active = false
    this.current = [0, 0]
    this.initialX = 0
    this.initialY = 0
    this.touchIndex = -1

    this.dragStartListener = (e: TouchEvent | MouseEvent) => this.dragStart(e)
    this.dragEndListener = (e: TouchEvent | MouseEvent) => this.dragEnd(e)
    this.dragListener = (e: DragEvent | TouchEvent | MouseEvent) => this.drag(e)

    this.initListeners()
  }

  initListeners() {
    // this.element.addEventListener('touchstart', (e) => this.dragStart(e), false)
    // this.element.addEventListener('touchend', (e) => this.dragEnd(e), false)
    // this.element.addEventListener('touchmove', (e) => this.drag(e), false)

    // this.element.addEventListener('mousedown', (e) => this.dragStart(e), false)
    // document.addEventListener('mouseup', (e) => this.dragEnd(e), false)
    // document.addEventListener('mousemove', (e) => this.drag(e), false)

    this.element.addEventListener('touchstart', this.dragStartListener, false)
    this.element.addEventListener('touchend', this.dragEndListener, false)
    this.element.addEventListener('touchmove', this.dragListener, false)

    this.element.addEventListener('mousedown', this.dragStartListener, false)
    document.addEventListener('mouseup', this.dragEndListener, false)
    document.addEventListener('mousemove', this.dragListener, false)
  }

  destroyListeners() {
    this.element.removeEventListener('touchstart', this.dragStartListener, false)
    this.element.removeEventListener('touchend', this.dragEndListener, false)
    this.element.removeEventListener('touchmove', this.dragListener, false)

    this.element.removeEventListener('mousedown', this.dragStartListener, false)
    document.removeEventListener('mouseup', this.dragEndListener, false)
    document.removeEventListener('mousemove', this.dragListener, false)
  }

  cleanup() {
    this.destroyListeners()
  }

  dragStart(e: TouchEvent | MouseEvent) {
    e.preventDefault()

    // if (e.type === 'touchstart') {
    //   this.initialX = e.targetTouches[0].clientX - this.xOffset
    //   this.initialY = e.targetTouches[0].clientY - this.yOffset
    // } else {
    //   this.initialX = e.clientX - this.xOffset - this.element.clientWidth / 2
    //   this.initialY = e.clientY - this.yOffset - this.element.clientHeight / 2
    // }
    if (e instanceof TouchEvent) {
      if (e.type === 'touchstart') {
        this.initialX = e.targetTouches[0].clientX - this.xOffset
        this.initialY = e.targetTouches[0].clientY - this.yOffset
        this.touchIndex = e.targetTouches[0].identifier
      }
    } else {
      this.initialX = e.clientX - this.xOffset - this.element.clientWidth / 2
      this.initialY = e.clientY - this.yOffset - this.element.clientHeight / 2
    }

    if (e.target === this.element) {
      this.active = true
    }

    if (e.type === 'mousedown') {
      document.body.classList.add('dragging')
    }

    return false
  }

  dragEnd(e: TouchEvent | MouseEvent) {
    if (!this.active) return

    e.preventDefault()

    this.initialX = this.currentX
    this.initialY = this.currentY

    this.active = false

    if (e.type === 'mouseup') {
      document.body.classList.remove('dragging')
    }
  }

  drag(e: DragEvent | TouchEvent | MouseEvent) {
    if (!this.active) return

    e.preventDefault()

    if (e.type === 'touchmove') {
      if (!(e instanceof TouchEvent)) throw new Error('Expected TouchEvent')
      this.currentX = e.targetTouches[0].clientX - this.initialX
      this.currentY = e.targetTouches[0].clientY - this.initialY
    } else {
      if (!(e instanceof MouseEvent)) throw new Error('Expected MouseEvent')
      this.currentX = e.clientX - this.initialX - this.element.clientWidth / 2
      this.currentY = e.clientY - this.initialY - this.element.clientHeight / 2
    }

    this.xOffset = this.currentX
    this.yOffset = this.currentY

    let x = this.currentX / this.container.clientWidth
    let y = -this.currentY / this.container.clientHeight

    x = Math.max(0, Math.min(x, 1))
    y = Math.max(0, Math.min(y, 1))

    this.callback(x, y)

    this.setPosition(this.currentX, this.currentY)
  }

  setFraction(x: number, y: number) {
    this.xOffset = x * this.container.clientWidth
    this.yOffset = y * -this.container.clientHeight

    this.setPosition(this.xOffset, this.yOffset)
  }

  setPosition(xPos: number, yPos: number) {
    xPos = Math.max(0, Math.min(xPos, this.container.clientWidth))
    yPos = Math.max(-this.container.clientHeight, Math.min(yPos, 0))

    this.element.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)'
  }

  setBackgroundColor(hex: string) {
    this.element.style.backgroundColor = hex
  }
}

const M_h = new three.Matrix4()
M_h.set(2, -2, 1, 1, -3, 3, -2, -1, 0, 0, 1, 0, 1, 0, 0, 0)

const M_hT = M_h.clone().transpose()

function surfacePoint(
  u: number,
  v: number,
  X: three.Matrix4,
  Y: three.Matrix4,
): [number, number, number] {
  const Ux = new three.Vector4(u * u * u, u * u, u, 1)
  const Uy = new three.Vector4(u * u * u, u * u, u, 1)

  const V = new three.Vector4(v * v * v, v * v, v, 1)

  const xAcc = X.clone().transpose().premultiply(M_h).multiply(M_hT)

  Ux.applyMatrix4(xAcc)
  const x = V.dot(Ux)

  const yAcc = Y.clone().transpose().premultiply(M_h).multiply(M_hT)

  Uy.applyMatrix4(yAcc)
  const y = V.dot(Uy)

  return [x, y, 0]
}

function colorPoint(
  u: number,
  v: number,
  X: three.Matrix4,
  Y: three.Matrix4,
  Z: three.Matrix4,
): [number, number, number] {
  const Ux = new three.Vector4(u * u * u, u * u, u, 1)
  const Uy = new three.Vector4(u * u * u, u * u, u, 1)
  const Uz = new three.Vector4(u * u * u, u * u, u, 1)

  const V = new three.Vector4(v * v * v, v * v, v, 1)

  const xAcc = X.clone().transpose().premultiply(M_h).multiply(M_hT)
  Ux.applyMatrix4(xAcc)
  const x = V.dot(Ux)

  const yAcc = Y.clone().transpose().premultiply(M_h).multiply(M_hT)
  Uy.applyMatrix4(yAcc)
  const y = V.dot(Uy)

  const zAcc = Z.clone().transpose().premultiply(M_h).multiply(M_hT)
  Uz.applyMatrix4(zAcc)
  const z = V.dot(Uz)

  return [x, y, z]
}

function meshCoefficients(
  p00: ControlPoint,
  p01: ControlPoint,
  p10: ControlPoint,
  p11: ControlPoint,
  axis: number,
) {
  const l = (p: ControlPoint) => p.location[axis]
  const u = (p: ControlPoint) => p.uTangent[axis]
  const v = (p: ControlPoint) => p.vTangent[axis]

  const result = new three.Matrix4()
  result.set(
    l(p00),
    l(p01),
    v(p00),
    v(p01),
    l(p10),
    l(p11),
    v(p10),
    v(p11),
    u(p00),
    u(p01),
    0,
    0,
    u(p10),
    u(p11),
    0,
    0,
  )

  return result
}

function colorCoefficients(
  p00: ControlPoint,
  p01: ControlPoint,
  p10: ControlPoint,
  p11: ControlPoint,
  axis: number,
) {
  const c = (p: ControlPoint) => p.color[axis]

  const result = new three.Matrix4()
  result.set(c(p00), c(p01), 0, 0, c(p10), c(p11), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)

  return result
}

export function resetHandles(handles: Grid<Handle>, grid: Grid<ControlPoint>) {
  handles.foreach((handle, x, y) => {
    const controlPoint = grid.get(x, y)
    const [u, v] = controlPoint.location
    handle.setFraction((u + 1) / 2, (v + 1) / 2)
  })
}

let showWireframe = false

export function toggleWireframe() {
  showWireframe = !showWireframe

  if (showWireframe) {
    document.body.classList.add('wireframe-mode')
  } else {
    document.body.classList.remove('wireframe-mode')
  }

  // update()
}

export function meshMain(
  grid: Grid<ControlPoint>,
  subdivisions: number,
  points: Grid<[number, number, number]>,
  colors: Grid<[number, number, number]>,
  canvasOrId: string | HTMLCanvasElement,
) {
  for (let x = 0; x < grid.width - 1; x++) {
    for (let y = 0; y < grid.height - 1; y++) {
      const p00 = grid.get(x, y)
      const p01 = grid.get(x, y + 1)
      const p10 = grid.get(x + 1, y)
      const p11 = grid.get(x + 1, y + 1)

      const X = meshCoefficients(p00, p01, p10, p11, 0)
      const Y = meshCoefficients(p00, p01, p10, p11, 1)

      const R = colorCoefficients(p00, p01, p10, p11, 0)
      const G = colorCoefficients(p00, p01, p10, p11, 1)
      const B = colorCoefficients(p00, p01, p10, p11, 2)

      for (let u = 0; u < subdivisions; u++) {
        for (let v = 0; v < subdivisions; v++) {
          points.set(
            x * subdivisions + u,
            y * subdivisions + v,
            surfacePoint(u / (subdivisions - 1), v / (subdivisions - 1), X, Y),
          )

          colors.set(
            x * subdivisions + u,
            y * subdivisions + v,
            colorPoint(u / (subdivisions - 1), v / (subdivisions - 1), R, G, B),
          )
        }
      }
    }
  }

  const geometry = buildGeometry(points, colors)
  const material = new three.MeshBasicMaterial({
    color: 0xffffff,
    vertexColors: true,
    wireframe: showWireframe,
  })
  const mesh = new three.Mesh(geometry, material)

  render(canvasOrId, mesh)
}

// window.addEventListener('resize', () => {
//   resetHandles()
// })

// window.addEventListener('DOMContentLoaded', () => {
//   update()
//   resetHandles()
// })
