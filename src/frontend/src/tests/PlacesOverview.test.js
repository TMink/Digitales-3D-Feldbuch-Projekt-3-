/*
 * Created Date: 17.07.2023 12:03:32
 * Author: Methusshan Elankumaran
 * 
 * Last Modified: 15.12.2023 14:10:49
 * Modified By: Julian Hardtung
 * 
 * Description: Unit tests for the PlacesOverview page
 */

import { describe, it, test, expect, vi, beforeAll } from 'vitest';
import { mount, shallowMount, flushPromises } from '@vue/test-utils';
import ResizeObserver from 'resize-observer-polyfill'
/* currently throws an error, because Vitest 
doesn't recognize the vuetify components */
import PlacesOverview from "../views/PlacesOverview.vue";
import ActivitiesOverview from "../views/ActivitiesOverview.vue";
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'


import { createVuetify } from "vuetify";

import { createI18n } from "vue-i18n";
import fieldbook_en from "../locales/en.mjs";
import fieldbook_de from "../locales/de.mjs";

import { VueRouterMock, createRouterMock, injectRouterMock } from 'vue-router-mock'

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

const router = createRouterMock({
    spy: {
      create: fn => vi.fn(fn),
      reset: spy => spy.mockReset(),
    }
  })

//Tests if the Navigation element renders correct
describe('PlacesOverview', () => {
    beforeAll(() => {
        global.ResizeObserver = ResizeObserver
        injectRouterMock(router)
    });

    test('should render correctly', () => {
        const wrapperPlace = mount(PlacesOverview, {
            global: {
                plugins: [vuetify, i18n],
            },
        });

        expect(wrapperPlace.exists()).toBe(true)
    })

    test('add new Place', async () => {
        const wrapperPlace = mount(PlacesOverview, {
            global: {
                plugins: [vuetify, i18n],
            },
        });

        const wrapperActivity = mount(ActivitiesOverview, {
            global: {
                plugins: [vuetify, i18n],
            },
        });

        const testActivity = {
            branchOffice : "Gummersbach",
            year : "2023",
            number : "2504"
        }
        
        const spyActivity = vi.spyOn(wrapperActivity.vm, 'saveActivity')
        await fromOfflineDB.syncLocalDBs()
        await wrapperActivity.vm.saveActivity(testActivity)
        expect(spyActivity).toHaveBeenCalled()

        await wrapperActivity.vm.setActivity(wrapperActivity.vm.activities[0]._id)
        
        const spy = vi.spyOn(wrapperPlace.vm, 'addPlace')
        await fromOfflineDB.syncLocalDBs()
        await wrapperPlace.vm.addPlace()
        expect(spy).toHaveBeenCalled()
        expect(wrapperPlace.vm.places.length).toBe(1)
    })

    test('move to place does work', async () => {
        const wrapperPlace = mount(PlacesOverview, {
            global: {
                plugins: [vuetify, i18n],
            },
        });

        const wrapperActivity = mount(ActivitiesOverview, {
            global: {
                plugins: [vuetify, i18n],
            },
        });

        const testActivity = {
            branchOffice : "Gummersbach",
            year : "2023",
            number : "2504"
        }
        
        const spyActivity = vi.spyOn(wrapperActivity.vm, 'saveActivity')
        await fromOfflineDB.syncLocalDBs()
        await wrapperActivity.vm.saveActivity(testActivity)
        expect(spyActivity).toHaveBeenCalled()

        await wrapperActivity.vm.setActivity(wrapperActivity.vm.activities[0]._id)
        
        const spy2 = vi.spyOn(wrapperPlace.vm, 'addPlace')
        await fromOfflineDB.syncLocalDBs()
        await wrapperPlace.vm.addPlace()
        expect(spy2).toHaveBeenCalled()
        expect(wrapperPlace.vm.places.length).toBeGreaterThan(0)

        const spy = vi.spyOn(wrapperPlace.vm, 'moveToPlace')
        await fromOfflineDB.syncLocalDBs()
        await wrapperPlace.vm.moveToPlace(wrapperPlace.vm.places[0]._id)
        expect(spy).toHaveBeenCalledWith(wrapperPlace.vm.places[0]._id)
   
    })

})