<template>
  <div>
    <en v-if="$i18n.locale === 'en'"></en>
    <zh v-if="$i18n.locale === 'zh'"></zh>
  </div>
</template>

<script>
import en from "./en.vue";
import zh from "./zh.vue";
import {getTitle} from "@/utils/general";
export default {
  created() {
    document.title = getTitle("privacyPolicy");
  },
  watch: {
    '$i18n.locale'() {
      document.title = getTitle("privacyPolicy");
    },
  },
  components: {
    en,
    zh
  }
}
</script>

<style scoped>

</style>