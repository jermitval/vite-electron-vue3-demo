import { ComponentCustomProperties } from "vue"
import { Store } from "vuex"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    /** Vuex store for this.$store */
    $store: Store<VRState>
  }
}
