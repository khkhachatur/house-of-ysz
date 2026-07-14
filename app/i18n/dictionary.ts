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
    shippingReturns: "Shipping & Returns",
    shippingText: "Worldwide shipping available. Returns accepted within 14 days.",
    defaultDescription: "Premium heavyweight fabric. Designed and printed by YZS.",
    photo: "photo",
  },
  cart: {
    title: "Shopping Bag",
    empty: "Your bag is empty.",
    remove: "Remove",
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
    shippingReturns: "Доставка и возврат",
    shippingText: "Доставка по всему миру. Возврат в течение 14 дней.",
    defaultDescription: "Премиальная плотная ткань. Разработано и напечатано YZS.",
    photo: "фото",
  },
  cart: {
    title: "Корзина",
    empty: "Ваша корзина пуста.",
    remove: "Удалить",
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
