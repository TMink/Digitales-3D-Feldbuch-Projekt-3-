/*
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 08.12.2023 12:30:00
 * Modified By: Julian Hardtung
 * 
 * Description: Router paths to the different vue pages
 */


import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import ActivitiesOverview from "@/views/ActivitiesOverview.vue";
import PlacesOverview from "@/views/PlacesOverview.vue";
import PlaceForm from "@/views/PlaceForm.vue";
import PositionsOverview from "@/views/PositionsOverview.vue";
import PositionForm from "@/views/PositionForm.vue";
import ModelViewer from "@/views/3DView.vue";
import OnlineSync from "@/views/OnlineSync.vue";
import DataExport from "@/views/DataExport.vue";
import DataBackup from "@/components/DataBackup.vue";
import Landingpage from "@/views/Landingpage.vue";
import Login from "@/views/Login.vue";
import Registration from "@/views/Registration.vue";

const router = createRouter({
  history: createWebHashHistory(),
  //history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Landingpage",
      component: Landingpage,
    },
    {
      path: "/activities",
      name: "ActivitiesOverview",
      component: ActivitiesOverview,
    },
    {
      path: "/activities/:activityID",
      name: "ActivityCreation",
    },
    {
      path: "/positions",
      name: "PositionsOverview",
      component: PositionsOverview,
    },
    {
      path: "/positions/:positionID",
      name: "PositionCreation",
      component: PositionForm,
    },
    {
      path: "/places",
      name: "PlacesOverview",
      component: PlacesOverview,
    },
    {
      path: "/places/:placeID",
      name: "PlaceCreation",
      component: PlaceForm,
    },
    {
      path: "/3DView",
      name: "3D-Ansicht",
      component: ModelViewer,
    },
    /* {
      path: "/onlineSync",
      name: "OnlineSync",
      component: OnlineSync,
    }, */
    {
      path: "/dataExport",
      name: "DataExport",
      component: DataExport,
    },
    {
      path: "/dataBackup",
      name: "DataBackup",
      component: DataBackup,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/registration",
      name: "Registration",
      component: Registration,
    },
  ],
});

export default router
