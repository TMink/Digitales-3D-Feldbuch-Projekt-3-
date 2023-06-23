import { describe, it, test, expect, vi, beforeAll } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import ResizeObserver from 'resize-observer-polyfill'
/* currently throws an error, because Vitest 
doesn't recognize the vuetify components */
import Navigation from "../components/Navigation.vue";
import PlacesOverview from "../views/PlacesOverview.vue";

import { createVuetify } from "vuetify";

import { createI18n } from "vue-i18n";
import fieldbook_en from "../locales/en.mjs";
import fieldbook_de from "../locales/de.mjs";


import { createRouter, createWebHistory } from 'vue-router'



// init used plugins for the component that is being tested
const vuetify = createVuetify();
const i18n = createI18n({
  locale: "en",
  allowComposition: true,
  messages: {
    en: fieldbook_en,
    de: fieldbook_de,
  },
});


//Tests if the Navigation element renders correct
describe('Navigation', () => {
  beforeAll(() => {
    global.ResizeObserver = ResizeObserver
  });

  test('should render correctly', () => {
    const wrapper = mount(Navigation, {
      global: {
        plugins: [vuetify, i18n],
      },
    });
  })

  test("Tabs exist", () => {
    const wrapper = mount(Navigation, {
      global: {
        plugins: [vuetify, i18n],
      },
    });
    expect(wrapper.find("#activity").exists()).toBe(true)
    expect(wrapper.find("#place").exists()).toBe(true)
    expect(wrapper.find("#position").exists()).toBe(true)
  })

  test("Tabs labled correctly in english", () => {
    const wrapper = mount(Navigation, {
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const activity = wrapper.get("#activity")
    const place = wrapper.get("#place")
    const position = wrapper.get("#position")

    expect(activity.text()).toEqual("Activity")
    expect(place.text()).toEqual("Place")
    expect(position.text()).toEqual("Position")
  })

  test("Tabs labled correctly in german", () => {
    const i18n = createI18n({
      locale: "de",
      allowComposition: true,
      messages: {
        en: fieldbook_en,
        de: fieldbook_de,
      },
    });

    const wrapper = mount(Navigation, {
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const activity = wrapper.get("#activity")
    const place = wrapper.get("#place")
    const position = wrapper.get("#position")

    expect(activity.text()).toEqual("Aktivität")
    expect(place.text()).toEqual("Stelle")
    expect(position.text()).toEqual("Position")
  })
})