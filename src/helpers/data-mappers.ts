import { Language } from '../types/patterns-type';

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

export const genreTranslations: {
  [key: string]: { [key in Language]: string };
} = {
  animalism: {
    en: 'animalism',
    uk: 'анімалізм',
  },
  architecture: {
    en: 'architecture',
    uk: 'архітектура',
  },
  cityscape: {
    en: 'cityscape',
    uk: 'міський пейзаж',
  },
  fantasy: {
    en: 'fantasy',
    uk: 'фентезі',
  },
  floral: {
    en: 'floral',
    uk: 'квітковий',
  },
  genepainting: {
    en: 'genre painting',
    uk: 'побутовий жанр',
  },
  historical: {
    en: 'historical',
    uk: 'історичний',
  },
  landscape: {
    en: 'landscape',
    uk: 'пейзаж',
  },
  mythological: {
    en: 'mythological',
    uk: 'міфологічний',
  },
  nude: {
    en: 'nude',
    uk: 'ню',
  },
  portrait: {
    en: 'portrait',
    uk: 'портрет',
  },
  religious: {
    en: 'religious',
    uk: 'релігійний',
  },
  scene: {
    en: 'scene',
    uk: 'жанрова сцена',
  },
  seascape: {
    en: 'seascape',
    uk: 'морський пейзаж',
  },
  stilllife: {
    en: 'stilllife',
    uk: 'натюрморт',
  },
  wildlife: {
    en: 'wildlife',
    uk: 'дика природа',
  },
  other: {
    en: 'other',
    uk: 'інше',
  },
};
