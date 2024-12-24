<template>
  <canvas :height="height" ref="cnv" :width="width"> </canvas>
</template>

<script lang="ts" setup>
import * as meshLib from '@/assets/mesh'
import { ControlPoint, Grid, lerp, meshMain } from '@/assets/mesh'
import { debounce } from '@/utils'

import { ref, watch, type Ref } from 'vue'

const cnv = ref<HTMLCanvasElement>() as Ref<HTMLCanvasElement>

const props = defineProps({
  width: {
    type: Number,
    default: 512,
  },
  height: {
    type: Number,
    default: 512,
  },
  subdivisions: {
    type: Number,
    default: 32,
  },
})

const width = ref(props.width)
const height = ref(props.height)
const subdivisions = ref(props.subdivisions)

watch([width, height, subdivisions], () => {
  reinitMesh()
})

const grid: Grid<ControlPoint> = new Grid(3, 3)
for (let x = 0; x < grid.width; x++) {
  for (let y = 0; y < grid.height; y++) {
    const controlPoint = new ControlPoint()
    controlPoint.location = [lerp(x / (grid.width - 1), -1, 1), lerp(y / (grid.height - 1), -1, 1)]

    controlPoint.uTangent[0] = 2 / (grid.width - 1)
    controlPoint.vTangent[1] = 2 / (grid.height - 1)

    grid.set(x, y, controlPoint)
  }
}
let pointGrid: Grid<[number, number, number]> = new Grid(
  (grid.width - 1) * subdivisions.value,
  (grid.height - 1) * subdivisions.value,
)
let colorGrid: Grid<[number, number, number]> = new Grid(
  (grid.width - 1) * subdivisions.value,
  (grid.height - 1) * subdivisions.value,
)

function reinitMesh() {
  pointGrid = new Grid(
    (grid.width - 1) * subdivisions.value,
    (grid.height - 1) * subdivisions.value,
  )
  colorGrid = new Grid(
    (grid.width - 1) * subdivisions.value,
    (grid.height - 1) * subdivisions.value,
  )
}

// const ctrlPntColors: Grid<[number, number, number]> = new Grid(3, 3)

// function refreshMesh() {
//   for (let x = 0; x < grid.width; x++) {
//     for (let y = 0; y < grid.height; y++) {
//       const controlPoint = grid.get(x, y)
//       // just assign #ff0000
//       const color: [number, number, number] = [1, 0, 0]
//       controlPoint.color = color
//       // location, x and y: [-1, 1]
//       controlPoint.location = [x - 1, y - 1]
//       console.log(controlPoint.location, color)
//       ctrlPntColors.set(x, y, color)
//     }
//   }
// }

function meshMainWithArgs() {
  return meshMain(grid, subdivisions.value, pointGrid, colorGrid, cnv.value)
}

function updateGrid(
  newGrid: Grid<{
    location: [number, number]
    color: [number, number, number]
  }>,
) {
  // must be a 3x3 grid
  if (newGrid.width !== 3 || newGrid.height !== 3) {
    throw new Error('Grid must be 3x3')
  }

  for (let x = 0; x < newGrid.width; x++) {
    for (let y = 0; y < newGrid.height; y++) {
      const controlPoint = grid.get(x, y)
      const color = newGrid.get(x, y).color
      controlPoint.color = color
      controlPoint.location = newGrid.get(x, y).location
    }
  }

  // refreshMesh()

  // refreshMesh()
  // update()
  // update()
}

const update = debounce(
  () => {
    meshMainWithArgs()
  },
  50,
  true,
)

function toggleWireframe() {
  meshLib.toggleWireframe()
  update()
}

function updateSize(w: number, h: number) {
  width.value = w
  height.value = h

  cnv.value.width = w
  cnv.value.height = h

  reinitMesh()
  update()
}

defineExpose({
  toggleWireframe,
  reinitMesh,
  updateSize,
  update,
  meshMainWithArgs,
  updateGrid,
})
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  padding: 0;
  pointer-events: none;
}
</style>
