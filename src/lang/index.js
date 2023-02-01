import Vue from 'vue'
import VueI18n from 'vue-i18n'
import myZh from './zh'
import myEn from './en'
import ElementLocale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

const messages = {
    en: {
        ...myEn,
        ...enLocale
    },
    zh: {
        ...myZh,
        ...zhLocale
    }
}

const i18n = new VueI18n({
    locale: 'zh',
    messages
});

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n;