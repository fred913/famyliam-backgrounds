<template>
  <div class="fs-view-cnt">
    <GradientMeshCanvas ref="cnv" :width="1920" :height="1080" :subdivisions="16" />
  </div>
</template>

<script lang="ts" setup>
import { Grid } from '@/assets/mesh'
import GradientMeshCanvas from '@/components/GradientMeshCanvas.vue'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  fullscreen: {
    type: Boolean,
    default: false,
  },
})

const cnv = ref<typeof GradientMeshCanvas | null>(null)
const fullscreen = computed(() => props.fullscreen)

function applyScreenSize() {
  if (!fullscreen.value) return
  const w = window.innerWidth
  const h = window.innerHeight
  cnv.value?.updateSize(w, h)
  cnv.value?.reinitMesh()
  cnv.value?.refreshMesh()
}

const gradGrid: Grid<{
  location: [number, number]
  color: [number, number, number]
}> = new Grid(3, 3)

onMounted(() => {
  if (cnv.value) {
    window.addEventListener('resize', () => {
      if (fullscreen.value) applyScreenSize()
      console.log('resize')
    })
    applyScreenSize()

    const showCnv = () => {
      if (!cnv.value) return
      cnv.value.reinitMesh()
      cnv.value.refreshMesh()
      cnv.value.meshMainWithArgs()
    }
    // for somehow it needs to be called twice
    showCnv()
    showCnv()

    setTimeout(() => {
      if (!cnv.value) return

      for (let x = 0; x < gradGrid.width; x++) {
        for (let y = 0; y < gradGrid.height; y++) {}
      }

      cnv.value.updateGrid(gradGrid)
    }, 1000)
  }
})
</script>

<style>
html,
body,
.fs-view-cnt,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.fs-view-cnt {
  /* filter: blur(20px); */
  overflow: hidden;
}
</style>
