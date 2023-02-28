import Vue from "vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
    faLanguage,
    faEllipsisVertical,
    faMagnifyingGlass,
    faBookOpen,
    faHouse,
    faFolderTree,
    faUser,
    faRightToBracket,
    faGear,
    faCircleInfo,
    faCircleQuestion,
    faCircleCheck,
    faCircleMinus,
    faCircleXmark
} from '@fortawesome/free-solid-svg-icons';

import {
    faCopyright
} from '@fortawesome/free-regular-svg-icons';

import {
    faGoogle
} from '@fortawesome/free-brands-svg-icons';

library.add(faCopyright);
library.add(faLanguage);
library.add(faEllipsisVertical);
library.add(faMagnifyingGlass);
library.add(faBookOpen);
library.add(faHouse);
library.add(faFolderTree);
library.add(faUser);
library.add(faRightToBracket);
library.add(faGear);
library.add(faGoogle);
library.add(faCircleInfo);
library.add(faCircleQuestion);
library.add(faCircleCheck);
library.add(faCircleMinus);
library.add(faCircleXmark);

Vue.component('font-awesome-icon', FontAwesomeIcon);