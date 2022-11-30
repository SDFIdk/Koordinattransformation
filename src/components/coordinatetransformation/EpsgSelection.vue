<template>
  <article class="coordinate-selection">
    <section
      @click="toggleDropdown"
      class="selected-input"
      :class="[
        { inputActive: inputActive },
        { isOutput: isOutput },
        { outputNotSelected: outputNotSelected }]"
    >
      <span class="input-crs">
        <Icon v-if="isOutput && outputNotSelected"
          icon="HashtagIcon"
          :width="2"
          :height="2"
          :color="colors.white"
        />
        <Icon v-else
          icon="HashtagIcon"
          :width="2"
          :height="2"
          :color="colors.turquoise"
        />
        <div class="epsg-code">
          {{ chosenInput }}
        </div>
      </span>
      <Icon v-if="isOutput && outputNotSelected"
        icon="ExpandIcon"
        :width="2.5"
        :height="2.5"
        :color="colors.white"
        :stroke-width="0.75"
        class="expand-icon"
      />
      <Icon v-else
        icon="ExpandIcon"
        :width="2.5"
        :height="2.5"
        :color="colors.turquoise"
        :stroke-width="0.75"
        class="expand-icon"
      />
    </section>
    <section v-show="inputActive" class="crs-selection">
      <article class="selection-list" :class="{ isOutput: isOutput }">
        <ul v-for="CRS in filteredCRS" :key="CRS">
          <li
            @click="
              chosenInput = CRS.title_short;
              inputActive = false;
              if (isOutput)
                outputSelected(CRS);
              epsgChanged(CRS);
            "
          >
            {{ CRS.title_short }}
          </li>
        </ul>
      </article>
    </section>
  </article>
</template>

<script>
/**
 * CoordinateSelection er drop-down menuen af EPSG-koder i både input- og outputkomponenterne
 */
import { onMounted, ref, inject } from 'vue'

export default {
  name: 'EpsgSelectionComponent',

  props: {
    // Er vi i input- eller outputkomponentet?
    isOutput: {
      type: Boolean,
      default () {
        return false
      }
    }
  },

  methods: {
    outputSelected (code) {
      /** Der styles forskelligt alt efter om en EPSG-kode i outputmenuen er valgt, eller ej
      I første instans er der ikke valgt nogen, men når først den er valgt, vil den blive ved med at være valgt. */
      this.outputNotSelected = false
      this.$emit('output-selected', code)
    },

    epsgChanged (code) {
      /** Hvis af en EPSG-koderne ændres, skal der foretages en passende ændring af input- og/eller outputkoordinaterne */
      this.$emit('epsg-changed', code)
    },

    toggleDropdown () {
      console.log('toggle dropdown')
      this.inputActive = !this.inputActive
    }
  },

  setup (props) {
    const colors = inject('themeColors')
    const chosenInput = ref('')
    const inputActive = ref(false)
    const outputNotSelected = ref(true)

    onMounted(() => {
    })

    return {
      colors,
      chosenInput,
      inputActive,
      outputNotSelected
    }
  }
}
</script>

<style scoped>
.epsg-code {
  display: inline-flex;
  padding-left: 0.25rem;
}
.coordinate-selection {
  width: 100%;
}
.selected-input {
  width: 100%;
  display: inline-flex;
  border: var(--darkSteel) solid 1px;
  border-radius: 25px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.selected-input.isOutput {
  background: var(--white);
}
.selected-input.isOutput.outputNotSelected {
  background: var(--action);
  color: var(--white);
}
.selected-input.inputActive {
  border-radius: 25px 25px 0 0;
  border-bottom: none;
  width: 100%;
}
.input-crs {
  padding: 0 0 0 0.5rem;
  display: inline-flex;
  align-items: center;
}
.expand-icon {
  align-self: center;
  margin: 0 0 0 auto;
  transform: rotate(90deg);
}
.crs-selection {
  width: 100%;
  position: relative;
}
.selection-list {
  height: 63vh;
  width: 100%;
  background: var(--white);
  position: absolute;
  border: var(--darkSteel) solid 1px;
  border-radius: 0 0 25px 25px;
  z-index: 4;
  overflow-y: auto;
}
@media screen and (max-width: 44rem) {
  .selection-list {
    height: 30vh;
  }
}
.selection-list.isOutput {
  background: var(--lightSteel);
}
li {
  list-style-type: none;
  padding: 0.5rem;
  margin: 0;
  border-bottom: var(--action) solid 1px;
}
li:hover {
  background-color: var(--action);
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
