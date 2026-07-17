export type Locale = "en" | "ru";

export const LOCALE_COOKIE = "locale";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ru";
}

export function pick(locale: Locale, en: string, ru?: string | null): string {
  return locale === "ru" && ru ? ru : en;
}

const en = {
  nav: {
    story: "Brand's Story",
    saved: "Saved",
    bag: "Bag",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    search: "Search",
    account: "Account",
    cart: "Cart",
  },
  hero: {
    collection: "COLLECTION",
    shopNow: "Shop Now",
    exploreMore: "Explore More",
  },
  home: {
    newIn: "New In",
    accessories: "Accessories",
    collections: "Collections",
    explore: "Explore",
    bagAlt: "yzs Bag",
  },
  footer: {
    newsletter:
      "Join the collective. Subscribe for exclusive releases, early access, and inside stories.",
    emailPlaceholder: "EMAIL ADDRESS",
    submit: "Submit",
    shop: "Shop",
    support: "Support",
    contact: "Contact",
    socials: "Socials",
    shippingReturns: "Shipping & Returns",
    sizeGuide: "Size Guide",
    faq: "FAQ",
    rights: "All Rights Reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },
  catalog: {
    filters: "Filters",
    sortBy: "Sort By",
    sortNewest: "Newest",
    sortPriceAsc: "Price ↑",
    sortPriceDesc: "Price ↓",
    size: "Size",
    color: "Color",
    availability: "Availability",
    inStockOnly: "In stock only",
    comingSoon: "Collection arriving soon.",
    noMatches: "No items match your filters.",
  },
  product: {
    selectSize: "Select Size",
    sizeGuide: "Size Guide",
    sizeError: "Please select a size",
    addToCart: "Add To Cart",
    description: "Description",
    fabric: "Fabric & Care",
    shippingReturns: "Shipping & Returns",
    shippingText: "Worldwide shipping available. Returns accepted within 14 days.",
    defaultDescription: "Premium heavyweight fabric. Designed and printed by YZS.",
    photo: "photo",
  },
  cart: {
    title: "Shopping Bag",
    empty: "Your bag is empty.",
    remove: "Remove",
    quantity: "Quantity",
    increase: "Increase quantity",
    decrease: "Decrease quantity",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    calculated: "Calculated at checkout",
    total: "Total",
    checkout: "Proceed to Checkout",
  },
  saved: {
    title: "Saved Items",
    empty: "Your wishlist is empty.",
  },
  toast: {
    added: "Added to bag",
  },
  search: {
    placeholder: "Search products…",
    noResults: "Nothing found",
  },
  newsletter: {
    success: "You're in. Welcome to the collective.",
    invalid: "Please enter a valid email address.",
    error: "Something went wrong — please try again.",
  },
  notFound: {
    text: "This page doesn't exist.",
    home: "Back to home",
  },
  story: {
    title: "Brand's Story",
    eyebrow: "Est. 2024 — Yerevan, Armenia",
    scroll: "Scroll",
    chapters: [
      {
        n: "01",
        h: "The House",
        p: [
          "YZS is a fashion house founded in Armenia in 2024 by Karapetyan F. and Jagatspanyan E.",
          "It opened easily enough — carried by the founders' enthusiasm and their appetite to try.",
        ],
      },
      {
        n: "02",
        h: "Inspiration",
        p: [
          "Many things fed the work, but the strongest pull was the will to make something of our own — that, and the standards both founders hold themselves to. Kanye West above all.",
        ],
      },
      {
        n: "03",
        h: "The Future",
        p: [
          "The house of YZS is loyal to its vision of the future, whatever the present weighs.",
          "The founders set themselves one task: to raise something new — not only in the local market, but in the world.",
        ],
      },
    ],
    quoteLabel: "The idea",
    quote: "Make clothes true to the gut, and strike everyone with the work — ourselves included.",
    foundersLabel: "Founders",
    founders: ["Karapetyan F.", "Jagatspanyan E."],
    ctaLabel: "Follow the house",
    instagram: "Instagram",
    shop: "Shop the collections",
    alts: {
      hero: "A figure in a white YZS hoodie standing beneath a carved stone sun",
      plaza: "A figure in a white YZS hoodie in a concrete plaza at night",
      scrawl: "Two figures against concrete, YZS drawn beside them in blue marker",
      collage: "A solarised photo of the founders, marked up in blue",
      mark: "YZS drawn by hand in blue marker",
    },
  },
  shipping: {
    title: "Shipping & Returns",
    sections: [
      {
        h: "Delivery in Armenia",
        p: "Orders within Yerevan are usually delivered in 1–3 business days. Delivery across the rest of Armenia takes 2–5 business days.",
      },
      {
        h: "International delivery",
        p: "We ship worldwide. International orders typically arrive within 7–14 business days. Shipping costs depend on your location and are confirmed with your order.",
      },
      {
        h: "Returns",
        p: "Returns are accepted within 14 days of delivery, as long as the item is unworn, unwashed, and has its original tags. Email us at houseofyzs@gmail.com to start a return.",
      },
      {
        h: "Exchanges",
        p: "Exchanges are possible within the same 14-day window, subject to stock availability. Contact us and we'll sort it out.",
      },
    ],
  },
  sizeGuide: {
    title: "Size Guide",
    sections: [
      {
        h: "Fit",
        p: "Most YZS pieces have a relaxed, oversized fit. If you prefer a regular fit and you're between sizes, we recommend sizing down.",
      },
      {
        h: "How to choose",
        p: "Compare with a similar garment you own: lay it flat and measure across the chest and down the length. Available sizes for each item are shown on its product page.",
      },
      {
        h: "Exact measurements",
        p: "Detailed per-garment measurement tables are coming soon. Until then, message us on Instagram or email houseofyzs@gmail.com — we're happy to help you pick a size.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        h: "What we collect",
        p: "Your email address if you subscribe to our newsletter, and the contact details you share with us when placing an order.",
      },
      {
        h: "Cookies",
        p: "We use a single cookie to remember your language preference. We do not use tracking or advertising cookies.",
      },
      {
        h: "How we use your data",
        p: "Only to fulfil your orders and send you updates you asked for. We never sell or share your personal data with third parties.",
      },
      {
        h: "Your rights",
        p: "You can ask us to delete your data at any time — just email houseofyzs@gmail.com.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    sections: [
      {
        h: "About the store",
        p: "yzs.am is operated by YZS, an independent clothing brand based in Armenia.",
      },
      {
        h: "Prices and orders",
        p: "All prices are listed in USD and may change without notice. Orders are confirmed by our team; if an item turns out to be unavailable, we will cancel and refund it.",
      },
      {
        h: "Returns",
        p: "Returns and exchanges are governed by our Shipping & Returns policy: 14 days from delivery for unworn items with original tags.",
      },
      {
        h: "Content",
        p: "All designs, photos, and text on this site are the property of YZS and may not be used commercially without permission.",
      },
      {
        h: "Contact",
        p: "Questions about these terms: houseofyzs@gmail.com.",
      },
    ],
  },
  faq: {
    title: "FAQ",
    items: [
      {
        q: "How long does delivery take?",
        a: "Orders within Yerevan are usually delivered in 1–3 business days. Delivery across Armenia takes 2–5 business days, and international orders arrive within 7–14 business days.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes — we ship worldwide. Shipping costs are calculated at checkout based on your location.",
      },
      {
        q: "Can I return or exchange an item?",
        a: "Yes. Returns and exchanges are accepted within 14 days of delivery, as long as the item is unworn, unwashed, and has its original tags.",
      },
      {
        q: "How do I pick the right size?",
        a: "Most of our pieces have a relaxed, oversized fit. Check the size guide on each product page, and if you're between sizes, we recommend sizing down for a regular fit.",
      },
      {
        q: "How should I care for my items?",
        a: "Wash inside out in cold water, and avoid tumble drying and ironing directly on the print to keep colors and graphics sharp.",
      },
      {
        q: "How can I contact you?",
        a: "Email us at houseofyzs@gmail.com, call ARM: 077 250 201, or message us on Instagram @the.yzs — we usually reply within 24 hours.",
      },
    ],
  },
};

const ru: typeof en = {
  nav: {
    story: "История бренда",
    saved: "Избранное",
    bag: "Корзина",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    search: "Поиск",
    account: "Аккаунт",
    cart: "Корзина",
  },
  hero: {
    collection: "КОЛЛЕКЦИЯ",
    shopNow: "Купить сейчас",
    exploreMore: "Узнать больше",
  },
  home: {
    newIn: "Новинки",
    accessories: "Аксессуары",
    collections: "Коллекции",
    explore: "Смотреть",
    bagAlt: "Сумка yzs",
  },
  footer: {
    newsletter:
      "Присоединяйтесь к комьюнити. Подписывайтесь, чтобы первыми узнавать об эксклюзивных релизах, раннем доступе и жизни бренда.",
    emailPlaceholder: "ВАШ EMAIL",
    submit: "Отправить",
    shop: "Магазин",
    support: "Поддержка",
    contact: "Контакты",
    socials: "Соцсети",
    shippingReturns: "Доставка и возврат",
    sizeGuide: "Таблица размеров",
    faq: "Вопросы и ответы",
    rights: "Все права защищены.",
    privacy: "Политика конфиденциальности",
    terms: "Условия использования",
  },
  catalog: {
    filters: "Фильтры",
    sortBy: "Сортировка",
    sortNewest: "Сначала новые",
    sortPriceAsc: "Цена ↑",
    sortPriceDesc: "Цена ↓",
    size: "Размер",
    color: "Цвет",
    availability: "Наличие",
    inStockOnly: "Только в наличии",
    comingSoon: "Коллекция скоро появится.",
    noMatches: "Ничего не найдено по выбранным фильтрам.",
  },
  product: {
    selectSize: "Выберите размер",
    sizeGuide: "Таблица размеров",
    sizeError: "Пожалуйста, выберите размер",
    addToCart: "Добавить в корзину",
    description: "Описание",
    fabric: "Состав и уход",
    shippingReturns: "Доставка и возврат",
    shippingText: "Доставка по всему миру. Возврат в течение 14 дней.",
    defaultDescription: "Премиальная плотная ткань. Разработано и напечатано YZS.",
    photo: "фото",
  },
  cart: {
    title: "Корзина",
    empty: "Ваша корзина пуста.",
    remove: "Удалить",
    quantity: "Количество",
    increase: "Увеличить количество",
    decrease: "Уменьшить количество",
    orderSummary: "Ваш заказ",
    subtotal: "Сумма товаров",
    shipping: "Доставка",
    calculated: "Рассчитывается при оформлении",
    total: "Итого",
    checkout: "Оформить заказ",
  },
  saved: {
    title: "Избранное",
    empty: "Ваш список желаний пуст.",
  },
  toast: {
    added: "Добавлено в корзину",
  },
  search: {
    placeholder: "Поиск товаров…",
    noResults: "Ничего не найдено",
  },
  newsletter: {
    success: "Готово. Добро пожаловать в комьюнити.",
    invalid: "Пожалуйста, введите корректный email.",
    error: "Что-то пошло не так — попробуйте ещё раз.",
  },
  notFound: {
    text: "Такой страницы не существует.",
    home: "На главную",
  },
  story: {
    title: "История бренда",
    eyebrow: "Основан в 2024 — Ереван, Армения",
    scroll: "Листайте",
    chapters: [
      {
        n: "01",
        h: "Дом",
        p: [
          "«YZS» — дом моды, основанный в Армении в 2024 году. Основатели — Карапетян Ф. и Джагацпанян Э.",
          "Дом открылся довольно легко — благодаря энтузиазму владельцев и желанию пробовать.",
        ],
      },
      {
        n: "02",
        h: "Вдохновение",
        p: [
          "На вдохновение влияло много факторов, но наибольшее влияние оказало желание создавать что-то своё, а также эталоны обоих создателей — в частности, Канье Уэст.",
        ],
      },
      {
        n: "03",
        h: "Будущее",
        p: [
          "Дом «YZS» предан своему видению будущего, несмотря на тяжести в настоящем.",
          "Главная задача владельцев — воспитать что-то новое не только на местном рынке, но и в мире.",
        ],
      },
    ],
    quoteLabel: "Идея",
    quote: "Сотворить одежду по нутру и стараться поражать всех в своих работах, включая нас самих.",
    foundersLabel: "Основатели",
    founders: ["Карапетян Ф.", "Джагацпанян Э."],
    ctaLabel: "Следите за домом",
    instagram: "Instagram",
    shop: "Смотреть коллекции",
    alts: {
      hero: "Фигура в белом худи YZS под каменным резным солнцем",
      plaza: "Фигура в белом худи YZS на бетонной площади ночью",
      scrawl: "Две фигуры у бетонной стены, рядом надпись YZS синим маркером",
      collage: "Соляризованное фото основателей с рисунками синим маркером",
      mark: "YZS, нарисованное от руки синим маркером",
    },
  },
  shipping: {
    title: "Доставка и возврат",
    sections: [
      {
        h: "Доставка по Армении",
        p: "Заказы по Еревану обычно доставляются за 1–3 рабочих дня. Доставка по остальной Армении занимает 2–5 рабочих дней.",
      },
      {
        h: "Международная доставка",
        p: "Мы доставляем по всему миру. Международные заказы обычно приходят за 7–14 рабочих дней. Стоимость доставки зависит от адреса и подтверждается вместе с заказом.",
      },
      {
        h: "Возврат",
        p: "Возврат возможен в течение 14 дней с момента получения, если вещь не носилась, не стиралась и сохранены оригинальные бирки. Напишите на houseofyzs@gmail.com, чтобы оформить возврат.",
      },
      {
        h: "Обмен",
        p: "Обмен возможен в те же 14 дней при наличии нужного размера. Свяжитесь с нами — всё решим.",
      },
    ],
  },
  sizeGuide: {
    title: "Таблица размеров",
    sections: [
      {
        h: "Посадка",
        p: "Большинство вещей YZS имеют свободный оверсайз-крой. Если вы предпочитаете обычную посадку и находитесь между размерами, советуем взять на размер меньше.",
      },
      {
        h: "Как выбрать",
        p: "Сравните с похожей вещью из вашего гардероба: разложите её и измерьте ширину по груди и длину. Доступные размеры каждой вещи указаны на её странице.",
      },
      {
        h: "Точные замеры",
        p: "Подробные таблицы замеров по каждой вещи скоро появятся. А пока напишите нам в Instagram или на houseofyzs@gmail.com — с радостью поможем с размером.",
      },
    ],
  },
  privacy: {
    title: "Политика конфиденциальности",
    sections: [
      {
        h: "Что мы собираем",
        p: "Ваш email, если вы подписались на рассылку, и контактные данные, которые вы указываете при оформлении заказа.",
      },
      {
        h: "Cookies",
        p: "Мы используем один cookie — для запоминания выбранного языка. Мы не используем трекинговые и рекламные cookies.",
      },
      {
        h: "Как мы используем данные",
        p: "Только для выполнения заказов и отправки обновлений, на которые вы подписались. Мы никогда не продаём и не передаём ваши данные третьим лицам.",
      },
      {
        h: "Ваши права",
        p: "Вы можете попросить удалить ваши данные в любой момент — напишите на houseofyzs@gmail.com.",
      },
    ],
  },
  terms: {
    title: "Условия использования",
    sections: [
      {
        h: "О магазине",
        p: "yzs.am — сайт независимого бренда одежды YZS из Армении.",
      },
      {
        h: "Цены и заказы",
        p: "Все цены указаны в долларах США и могут меняться без предупреждения. Заказы подтверждаются нашей командой; если вещи не окажется в наличии, мы отменим заказ и вернём деньги.",
      },
      {
        h: "Возврат",
        p: "Возврат и обмен регулируются нашей политикой доставки и возврата: 14 дней с момента получения для неношеных вещей с бирками.",
      },
      {
        h: "Контент",
        p: "Все дизайны, фотографии и тексты на сайте принадлежат YZS и не могут использоваться в коммерческих целях без разрешения.",
      },
      {
        h: "Контакты",
        p: "Вопросы по условиям: houseofyzs@gmail.com.",
      },
    ],
  },
  faq: {
    title: "Вопросы и ответы",
    items: [
      {
        q: "Сколько занимает доставка?",
        a: "Заказы по Еревану обычно доставляются за 1–3 рабочих дня. Доставка по Армении занимает 2–5 рабочих дней, международные заказы — 7–14 рабочих дней.",
      },
      {
        q: "Есть ли международная доставка?",
        a: "Да, мы доставляем по всему миру. Стоимость доставки рассчитывается при оформлении заказа в зависимости от адреса.",
      },
      {
        q: "Можно ли вернуть или обменять товар?",
        a: "Да. Возврат и обмен возможны в течение 14 дней с момента получения, если вещь не носилась, не стиралась и сохранены оригинальные бирки.",
      },
      {
        q: "Как выбрать правильный размер?",
        a: "Большинство наших вещей имеют свободный оверсайз-крой. Смотрите таблицу размеров на странице товара; если вы между размерами, советуем взять на размер меньше для обычной посадки.",
      },
      {
        q: "Как ухаживать за вещами?",
        a: "Стирайте вещи, вывернув наизнанку, в холодной воде. Не сушите в машине и не гладьте по принту — так рисунок и цвет дольше останутся яркими.",
      },
      {
        q: "Как с вами связаться?",
        a: "Напишите нам на houseofyzs@gmail.com, позвоните по номеру ARM: 077 250 201 или напишите в Instagram @the.yzs — обычно мы отвечаем в течение 24 часов.",
      },
    ],
  },
};

export const dictionaries: Record<Locale, typeof en> = { en, ru };

export type Dict = typeof en;
