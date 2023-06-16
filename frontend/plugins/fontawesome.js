import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import {
  faMicrophoneLines, faCompactDisc, faMusic,
  faCircleXmark, faCircleCheck,
  faCloudArrowUp, faArrowsRotate, faTrash,
  faEye, faCartShopping, faStar,
  faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;
library.add(faMicrophoneLines, faCompactDisc, faMusic);
library.add(faCircleXmark, faCircleCheck);
library.add(faCloudArrowUp, faArrowsRotate, faTrash);
library.add(faEye, faCartShopping, faStar);
library.add(faMagnifyingGlass);

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('Icon', FontAwesomeIcon, { });
});
