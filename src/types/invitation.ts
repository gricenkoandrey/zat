export type FoilStyle = 'rosegold' | 'gold' | 'silver' | 'amethyst';
export type EnvelopeColor = 'burgundy' | 'emerald' | 'navy' | 'rose';
export type SealSymbol = 'heart' | 'star' | 'rose' | 'gem';

export interface DateInvitation {
  to: string;
  question: string;
  dateTime: string;
  location: string;
  dressCode: string;
  message: string;
  sender: string;
  foilStyle: FoilStyle;
  envelopeColor: EnvelopeColor;
  sealSymbol: SealSymbol;
}

export const DEFAULT_INVITATION: DateInvitation = {
  to: 'Голубоглазая кудрявая заюшка 🐰💙',
  question: 'Пойдёшь со мной на свидание?',
  dateTime: '11 число, в 03:00 ночи',
  location: 'Турники 🌟 (наше место встречи)',
  dressCode: 'Твои кудряшки, уютный теплый худи и сияющие голубые глаза ✨',
  message: '11 число в 3 часа ночи на турниках... Ты шла из дома с друзьями, а я спешил из Жилгородка навстречу тебе. Момент, когда всё началось... Я тебя безумно люблю! 🤍',
  sender: 'Твой мальчик, который тебя безумно любит ⚡',
  foilStyle: 'silver',
  envelopeColor: 'navy',
  sealSymbol: 'heart',
};

export const PRESETS: { name: string; icon: string; data: Partial<DateInvitation> }[] = [
  {
    name: 'Встреча на турниках 11 числа',
    icon: '✨',
    data: {
      to: 'Голубоглазая кудрявая заюшка 🐰💙',
      question: 'Пойдёшь со мной на свидание?',
      dateTime: '11 число, в 03:00 ночи',
      location: 'Турники (наше место встречи) 🌌',
      dressCode: 'Кудряшки, теплый худи и твои голубые глаза ✨',
      message: '11 число в 3 часа ночи на турниках... Ты шла из дома с друзьями, а я спешил из Жилгородка навстречу тебе. Я тебя очень сильно люблю! Отказы строго не принимаются.',
      sender: 'Твой влюбленный зануда 🖤',
      foilStyle: 'silver',
      envelopeColor: 'navy',
    },
  },
  {
    name: 'Романтический ужин',
    icon: '🍷',
    data: {
      question: 'Пойдёшь со мной на свидание при свечах?',
      dateTime: 'Пятница, 19:30',
      location: 'Ресторан с панорамным видом на вечерний город',
      dressCode: 'Вечерний элегантный стиль',
      message: 'У нас забронирован лучший столик у окна. Обещаю много смеха, потрясающую атмосферу и вкусную еду!',
      foilStyle: 'rosegold',
      envelopeColor: 'burgundy',
    },
  },
  {
    name: 'Кофе и прогулка',
    icon: '☕',
    data: {
      question: 'Убежим вместе за самым вкусным кофе?',
      dateTime: 'Суббота, 16:00',
      location: 'Маленькая кофейня в старом переулке, затем прогулка',
      dressCode: 'Удобная обувь, теплый шарф и отличное настроение',
      message: 'Хочу не спеша гулять по осенним улочкам, греть руки о стаканчик с корицей и слушать твои истории.',
      foilStyle: 'gold',
      envelopeColor: 'emerald',
    },
  },
  {
    name: 'Кино и звезды',
    icon: '🌙',
    data: {
      question: 'Устроим вечер кино и звездного неба?',
      dateTime: 'Суббота, 20:30',
      location: 'Уютная крыша с гирляндами и мягкими пледами',
      dressCode: 'Самый мягкий и уютный свитер',
      message: 'Горячий какао с маршмеллоу, твой любимый фильм на проекторе и звездное небо над нами.',
      foilStyle: 'silver',
      envelopeColor: 'rose',
    },
  },
];
