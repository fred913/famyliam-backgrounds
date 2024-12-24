<template>
  <div class="example-4-page">
    <div class="canvas-holder-colors">
      <span
        ><label for="example-2-color02">
          <input id="example-2-color02" @input="updateColor()" type="color" value="#F4061D" />
          <span class="chevron"
            ><svg
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L4.5 4L8 1" stroke="#808893" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span>
        </label>
        <label for="example-2-color01">
          <input id="example-2-color01" @input="updateColor()" type="color" value="#F5119F" />
          <span class="chevron"
            ><svg
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L4.5 4L8 1" stroke="#808893" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span>
        </label>
        <label for="example-2-color00">
          <input id="example-2-color00" @input="updateColor()" type="color" value="#FA224D" />
          <span class="chevron"
            ><svg
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L4.5 4L8 1" stroke="#808893" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span> </label
      ></span>
      <span
        ><label for="example-2-color12">
          <input id="example-2-color12" @input="updateColor()" type="color" value="#2B15F4" />
          <span class="chevron"
            ><svg
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L4.5 4L8 1" stroke="#808893" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span>
        </label>
        <label for="example-2-color11">
          <input id="example-2-color11" @input="updateColor()" type="color" value="#645BE6" />
          <span class="chevron"
            ><svg
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L4.5 4L8 1" stroke="#808893" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span>
        </label>
        <label for="example-2-color10">
          <input id="example-2-color10" @input="updateColor()" type="color" value="#3A67E7" />
          <span class="chevron"
            ><svg
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L4.5 4L8 1" stroke="#808893" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span> </label
      ></span>
      <span
        ><label for="example-2-color22">
          <input id="example-2-color22" @input="updateColor()" type="color" value="#2615F5" />
          <span class="chevron"
            ><svg
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L4.5 4L8 1" stroke="#808893" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span>
        </label>
        <label for="example-2-color21">
          <input id="example-2-color21" @input="updateColor()" type="color" value="#00F6CD" />
          <span class="chevron"
            ><svg
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L4.5 4L8 1" stroke="#808893" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span>
        </label>
        <label for="example-2-color20">
          <input id="example-2-color20" @input="updateColor()" type="color" value="#F6FA00" />
          <span class="chevron"
            ><svg
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L4.5 4L8 1" stroke="#808893" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span> </label
      ></span>
    </div>
    <div class="canvas-holder">
      <!-- <canvas height="512px" id="example-4-canvas" width="512px"> </canvas> -->
      <canvas :height="height" :id="'example-4-canvas'" :width="width"> </canvas>
      <div class="handle-block" id="example-4-canvas-handle-00"></div>
      <div class="handle-block" id="example-4-canvas-handle-01"></div>
      <div class="handle-block" id="example-4-canvas-handle-02"></div>
      <div class="handle-block" id="example-4-canvas-handle-10"></div>
      <div class="handle-block" id="example-4-canvas-handle-11"></div>
      <div class="handle-block" id="example-4-canvas-handle-12"></div>
      <div class="handle-block" id="example-4-canvas-handle-20"></div>
      <div class="handle-block" id="example-4-canvas-handle-21"></div>
      <div class="handle-block" id="example-4-canvas-handle-22"></div>
    </div>
    <!-- <div class="buttons-list">
      <button class="show-mesh" @click="toggleWireframe()">
        <p>Toggle Wireframe View</p>
      </button>
      <button class="show-mesh" @click="toggleWireframe()">
        <p>Toggle Wireframe View</p>
      </button>
    </div> -->
    <button class="btn" @click="toggleWireframe()">Show Wireframe View</button>
    <button class="btn" @click="refreshMesh()">Refresh Mesh</button>
  </div>
</template>

<script lang="ts" setup>
import * as meshLib from '@/assets/mesh'
import { ControlPoint, Grid, Handle, lerp, meshMain } from '@/assets/mesh'
import { debounce } from '@/utils'

import { onMounted, ref, watch } from 'vue'

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
  refreshMesh()
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
let points: Grid<[number, number, number]> = new Grid(
  (grid.width - 1) * subdivisions.value,
  (grid.height - 1) * subdivisions.value,
)
let colors: Grid<[number, number, number]> = new Grid(
  (grid.width - 1) * subdivisions.value,
  (grid.height - 1) * subdivisions.value,
)

function reinitMesh() {
  points = new Grid((grid.width - 1) * subdivisions.value, (grid.height - 1) * subdivisions.value)
  colors = new Grid((grid.width - 1) * subdivisions.value, (grid.height - 1) * subdivisions.value)
}

const colorWells: Grid<HTMLInputElement> = new Grid(3, 3)
const handles: Grid<Handle> = new Grid(3, 3)

const allHandlesForGc: Handle[] = []

function clearAllHandles() {
  allHandlesForGc.forEach((handle) => {
    handle.cleanup()
  })
  allHandlesForGc.length = 0
}

function refreshMesh() {
  clearAllHandles()

  grid.foreach((controlPoint: ControlPoint, x, y) => {
    const handle = new Handle(`#example-4-canvas-handle-${x | 0}${y | 0}`, (u, v) => {
      controlPoint.location = [u * 2 - 1, v * 2 - 1]

      requestAnimationFrame(() => {
        meshMainWithArgs()
      })
    })

    allHandlesForGc.push(handle)

    const [u, v] = controlPoint.location
    handle.setFraction((u + 1) / 2, (v + 1) / 2)

    handles.set(x, y, handle)

    const colorWell = document.querySelector(`#example-2-color${x | 0}${y | 0}`) as HTMLInputElement
    colorWells.set(x, y, colorWell)
  })
}

onMounted(() => {
  refreshMesh()

  meshLib.resetHandles(handles, grid)

  meshMainWithArgs()

  refreshMesh()
})

function updateColor() {
  // refreshMesh()
  update()
}

function meshMainWithArgs() {
  colorWells.foreach((colorWell, x, y) => {
    if (!colorWell) throw new Error('Color well not found')
    const hexColor = colorWell.value
    grid.get(x, y).color = meshLib.hex2float(hexColor)
    handles.get(x, y).setBackgroundColor(hexColor)
  })

  return meshMain(grid, subdivisions.value, points, colors, 'example-4-canvas')
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
}

defineExpose({
  toggleWireframe,
  refreshMesh,
  reinitMesh,
  updateColor,
  updateSize,
})
</script>

<style scoped>
.example-4-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canvas-container {
  position: relative;
  width: 500px;
  height: 500px;
  margin-bottom: 20px;
}

#example-4-canvas {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}

.canvas-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #ff0000;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.color-controls {
  display: flex;
  gap: 10px;
}

.color-control {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn {
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}

.handle-block {
  --color-selection-handle-size: 20px;
  box-sizing: border-box;

  position: absolute;
  width: var(--color-selection-handle-size);
  height: var(--color-selection-handle-size);
  display: block;
  margin-left: calc(var(--color-selection-handle-size) / -2);
  margin-top: calc(var(--color-selection-handle-size) / -2);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  border-radius: 50%;

  user-select: none;
  cursor: grab;
}
</style>
