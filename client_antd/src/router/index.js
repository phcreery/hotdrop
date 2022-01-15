import { createWebHistory, createRouter } from "vue-router";
import Gallery from "/src/components/Gallery.vue";
import Files from "/src/components/Files.vue";
import Upload from "/src/components/Upload.vue";
import Settings from "/src/components/Settings.vue";

const routes = [
  {
    path: "/",
    name: "landing-page",
    component: Gallery,
  },
  {
    path: "/photos",
    name: "Photos",
    component: Gallery,
  },
  {
    path: "/files",
    name: "Files",
    component: Files,
  },
  {
    path: "/upload",
    name: "Upload",
    component: Upload,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
