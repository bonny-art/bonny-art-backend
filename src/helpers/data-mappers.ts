import { Language } from '../types/common-types';

export const originTranslations: {
  [key: string]: { [key in Language]: string };
} = {
  illustration: {
    en: 'illustration',
    uk: 'іллюстрації',
  },
  painting: {
    en: 'painting',
    uk: 'живопису',
  },
  photo: {
    en: 'photo',
    uk: 'фотографії',
  },
};

// TODO: Create collection in DB instead of hardcoding
export const canvasTranslations: {
  [key: string]: { [key in Language]: string };
} = {
  aida: {
    en: 'Aida',
    uk: 'Аїда',
  },
  congress: {
    en: 'Congress',
    uk: 'Страмін Конгрес',
  },
  cordova: {
    en: 'Cordova',
    uk: 'Кордова',
  },
  dmc: {
    en: 'DMC',
    uk: 'DMC',
  },
  evenweavedmc: {
    en: 'Evenweave DMC',
    uk: 'Рівномірка DMC',
  },
  goblenset: {
    en: 'Romanian mesh without marking',
    uk: 'Румунська сітка без розмітки',
  },
  hardanger: {
    en: 'Hardanger',
    uk: 'Хардангер',
  },
  lugana: {
    en: 'Lugana',
    uk: 'Лугана',
  },
  lucas: {
    en: 'Romanian mesh with marking',
    uk: 'Румунська сітка з розміткою',
  },
  monocanvas: {
    en: 'Monocanvas',
    uk: 'Моноканва',
  },
};
