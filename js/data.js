// All store content in one place: products, flavours, fruits by season, branches.

export const FREE_SHIPPING = 150;
export const DELIVERY_FEE = 25;
export const WHATSAPP = '972501234567';
export const PHONE = '03-555-7473';

export const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

export const CATEGORIES = [
  { id: 'home', name: 'גלידה לבית', from: 39, img: 'p-tub', tint: 'peach' },
  { id: 'yogurt', name: 'יוגורט', from: 26, img: 'p-yog-berry', tint: 'pink' },
  { id: 'cups', name: 'כוסות וגביעים', from: 18, img: 'p-cone', tint: 'lemon' },
  { id: 'cakes', name: 'עוגות גלידה', from: 139, img: 'p-cake', tint: 'mint' },
  { id: 'gift', name: 'כרטיס מתנה', from: 50, img: null, tint: 'lilac' },
];

// type: 'pack' = flavours are picked on the product page; 'simple' = add straight from the card.
// A variant with stock:false can't be added anywhere.
export const PRODUCTS = [
  { id: 'pack', cat: 'home', type: 'pack', name: 'מארז גלידה לבית', desc: 'בוחרים טעמים, אנחנו ממלאים טרי מהבוקר', img: 'p-tub', tags: ['נמכר ביותר'], tint: 'peach',
    variants: [{ label: '500 מ"ל', note: '2 טעמים', price: 39 }, { label: '1 ליטר', note: '3 טעמים', price: 69 }, { label: '2.5 ליטר', note: '5 טעמים', price: 149 }] },
  { id: 'season-pack', cat: 'home', type: 'simple', name: 'סורבה רימון ותפוז דם', desc: 'הטעם העונתי, רק עד סוף דצמבר', img: 'p-tub-season', tags: ['עונתי', 'טבעוני'], tint: 'pink',
    variants: [{ label: '500 מ"ל', price: 42 }, { label: '1 ליטר', price: 74 }] },
  { id: 'chef-ripe', cat: 'yogurt', type: 'simple', name: 'יוגורט RIPE', desc: 'רימון, אפרסמון, תמר טרי וגרנולה', img: 'hero-ripe', tags: ['עונתי'], tint: 'peach',
    variants: [{ label: 'קטן', price: 28 }, { label: 'בינוני', price: 36 }, { label: 'גדול', price: 44 }] },
  { id: 'chef-choco', cat: 'yogurt', type: 'simple', name: 'יוגורט שוקו-לוז', desc: 'ממרח לוז, אגוזי לוז קלויים ובראוניז', img: 'p-yog-choco', tags: [], tint: 'lilac',
    variants: [{ label: 'קטן', price: 28 }, { label: 'בינוני', price: 36 }, { label: 'גדול', price: 44 }] },
  { id: 'chef-tropic', cat: 'yogurt', type: 'simple', name: 'יוגורט טרופי', desc: 'מנגו, אננס, פסיפלורה וקוקוס קלוי', img: 'p-yog-tropic', tags: ['ללא גלוטן'], tint: 'lemon',
    variants: [{ label: 'קטן', price: 28 }, { label: 'בינוני', price: 36 }, { label: 'גדול', price: 44 }] },
  { id: 'cone', cat: 'cups', type: 'simple', name: 'כוס או גביע', desc: 'טעמים לבחירה בסניף, מוכן תוך 15 דקות', img: 'p-cone', tags: ['רק באיסוף'], pickupOnly: true, tint: 'lemon',
    variants: [{ label: 'כדור 1', price: 18 }, { label: '2 כדורים', price: 26 }, { label: '3 כדורים', price: 32 }] },
  { id: 'cake', cat: 'cakes', type: 'simple', name: 'עוגת פיסטוק ופטל', desc: 'שכבות גלידת פיסטוק, פטל טרי ופיסטוק קלוי', img: 'p-cake', tags: ['חדש'], tint: 'mint',
    variants: [{ label: '8 סועדים', price: 139 }, { label: '12 סועדים', price: 189 }] },
  { id: 'pops', cat: 'cakes', type: 'simple', name: 'ארטיקים בעבודת יד', desc: '4 ארטיקים במארז, ישר למקפיא', img: 'p-popsicles', tags: [], tint: 'mint',
    variants: [{ label: 'פיסטוק', price: 48 }, { label: 'שוקולד', price: 48 }, { label: 'פירות יער', price: 48, stock: false }] },
  { id: 'gift', cat: 'gift', type: 'simple', name: 'כרטיס מתנה', desc: 'נשלח במייל או ב-WhatsApp, תקף שנה בכל הסניפים ובאתר', img: 'gift-card', tags: [], tint: 'lilac',
    variants: [{ label: '50 ₪', price: 50 }, { label: '100 ₪', price: 100 }, { label: '200 ₪', price: 200 }] },
];

// featured = the 8 shown on the home page; the ice-cream page shows all 24.
// allergens use the icon keys in ALLERGENS.
export const FLAVOURS = [
  { id: 'pistachio', name: 'פיסטוק ברונטה', type: 'milk', img: 's-pistachio', tags: ['ללא גלוטן'], featured: true, desc: 'פיסטוק סיצילייני קלוי שנטחן לממרח אצלנו. עמוק, מלוח-מתוק וירוק באמת.', ingredients: 'חלב, שמנת, פיסטוק ברונטה (18%), סוכר, חלבון חלב', allergens: ['milk', 'nuts'] },
  { id: 'chocolate', name: 'שוקולד בלגי מריר', type: 'milk', img: 's-chocolate', tags: ['ללא גלוטן'], featured: true, desc: 'שוקולד 70% שנמס לאט. מריר, חלק ולא מתוק מדי.', ingredients: 'חלב, שוקולד מריר 70% (22%), שמנת, סוכר, קקאו', allergens: ['milk', 'soy'] },
  { id: 'vanilla', name: 'וניל מדגסקר', type: 'milk', img: 's-vanilla', tags: ['ללא גלוטן'], featured: true, desc: 'תרמילי וניל שלמים שנפתחים ביד. רואים את הגרגרים בכל כף.', ingredients: 'חלב, שמנת, סוכר, תרמילי וניל בורבון', allergens: ['milk'] },
  { id: 'pretzel', name: 'בייגלה מלוח וקרמל', type: 'milk', img: 's-pretzel', tags: [], featured: true, desc: 'קרמל שרוף בעדינות, ובייגלה פריך שנשאר פריך עד הסוף.', ingredients: 'חלב, שמנת, סוכר, קרמל, בייגלה (קמח חיטה), מלח ים', allergens: ['milk', 'gluten'] },
  { id: 'biscuit', name: 'עוגת ביסקוויטים וקרם וניל', type: 'milk', img: 's-biscuit', tags: [], desc: 'כמו העוגה של סבתא: ביסקוויטים טבולים, קרם וניל ושכבות קקאו.', ingredients: 'חלב, שמנת, ביסקוויטים (קמח חיטה), סוכר, קקאו, וניל', allergens: ['milk', 'gluten', 'eggs'] },
  { id: 'white-cookies', name: 'שוקולד לבן ועוגיות', type: 'milk', img: 's-white-cookies', tags: [], desc: 'שוקולד לבן קטיפתי עם פירורים של עוגיות קקאו כהות.', ingredients: 'חלב, שוקולד לבן (16%), שמנת, עוגיות קקאו (קמח חיטה), סוכר', allergens: ['milk', 'gluten', 'soy'] },
  { id: 'hazelnut-wafer', name: 'וופל לוז', type: 'milk', img: 's-hazelnut-wafer', tags: [], desc: 'אגוזי לוז קלויים ושברי וופל פריכים. הטעם של הממתק האהוב, בגלידה.', ingredients: 'חלב, שמנת, ממרח לוז (14%), שברי וופל (קמח חיטה), סוכר', allergens: ['milk', 'nuts', 'gluten'] },
  { id: 'coconut-almond', name: 'קוקוס ושקדים קלויים', type: 'milk', img: 's-coconut-almond', tags: ['ללא גלוטן'], desc: 'קוקוס לבן ונקי עם פתיתים קלויים ושקדים פריכים.', ingredients: 'חלב, חלב קוקוס, קוקוס קלוי, שקדים (8%), סוכר', allergens: ['milk', 'nuts'] },
  { id: 'cashew-caramel', name: 'קשיו וקרמל מלוח', type: 'milk', img: 's-cashew-caramel', tags: ['ללא גלוטן'], desc: 'קשיו קלוי שלם וסרטים של קרמל מלוח. מתוק, מלוח וממכר.', ingredients: 'חלב, שמנת, קשיו (10%), קרמל, מלח ים, סוכר', allergens: ['milk', 'nuts'] },
  { id: 'meringue-berries', name: 'מרנג ופירות יער', type: 'milk', img: 's-meringue-berries', tags: ['ללא גלוטן'], desc: 'שברי מרנג פריכים ורוטב פירות יער חמצמץ, כמו פבלובה קרה.', ingredients: 'חלב, שמנת, מרנג (חלבון ביצה, סוכר), פירות יער (12%)', allergens: ['milk', 'eggs'] },
  { id: 'cherry-choc', name: 'דובדבן ושוקולד מריר', type: 'milk', img: 's-cherry-choc', tags: ['ללא גלוטן'], desc: 'שוקולד מריר עם דובדבני אמרנה וסירופ דובדבנים.', ingredients: 'חלב, שוקולד מריר, דובדבני אמרנה (10%), שמנת, סוכר', allergens: ['milk', 'soy'] },
  { id: 'mint-choc', name: 'מנטה ושברי שוקולד', type: 'milk', img: 's-mint-choc', tags: ['ללא גלוטן'], desc: 'נענע טרייה שהושרתה בחלב כל הלילה, עם שברי שוקולד מריר. בלי צבע מאכל.', ingredients: 'חלב, שמנת, נענע טרייה, שוקולד מריר, סוכר', allergens: ['milk', 'soy'] },
  { id: 'strawberry', name: 'תות ומסקרפונה', type: 'milk', img: 's-strawberry', tags: ['ללא גלוטן'], featured: true, desc: 'מסקרפונה עשירה עם ריבת תותים ביתית בפסים.', ingredients: 'חלב, מסקרפונה (15%), ריבת תות, שמנת, סוכר', allergens: ['milk'] },
  { id: 'bubblegum', name: 'מסטיק כחול', type: 'milk', img: 's-bubblegum', tags: ['ללא גלוטן'], desc: 'הטעם שהילדים הכי מבקשים, בצבע טבעי מספירולינה.', ingredients: 'חלב, שמנת, סוכר, תמצית מסטיק, ספירולינה כחולה', allergens: ['milk'] },
  { id: 'halva', name: 'חלבה וסילאן', type: 'milk', img: 's-halva', tags: ['ללא גלוטן'], featured: true, desc: 'חלבה מפוררת ופסים של סילאן תמרים. הטעם הכי ישראלי שיש לנו.', ingredients: 'חלב, שמנת, חלבה (12%), סילאן, סוכר', allergens: ['milk', 'sesame'] },
  { id: 'dulce', name: 'ריבת חלב', type: 'milk', img: 's-dulce', tags: ['ללא גלוטן'], desc: 'ריבת חלב שמבשלים אצלנו שעות, עד שהיא מקבלת צבע של קרמל.', ingredients: 'חלב, ריבת חלב (20%), שמנת, סוכר', allergens: ['milk'] },
  { id: 'espresso', name: 'אספרסו', type: 'milk', img: 's-espresso', tags: ['ללא גלוטן'], desc: 'אספרסו כפול מקלייה מקומית. מושלם אחרי ארוחה.', ingredients: 'חלב, שמנת, אספרסו, סוכר', allergens: ['milk'] },
  { id: 'lemon', name: 'לימון ונענע', type: 'sorbet', img: 's-lemon', tags: ['טבעוני', 'ללא סוכר'], featured: true, desc: 'לימונים סחוטים טרי ונענע מהערוגה. מתוק בסטביה, רענן כמו לימונענע.', ingredients: 'מים, מיץ לימון (25%), נענע, סטביה, סיבים תזונתיים', allergens: [] },
  { id: 'mango', name: 'מנגו אלפונסו', type: 'sorbet', img: 's-mango', tags: ['טבעוני'], featured: true, desc: 'מנגו אלפונסו בשל, כמעט חצי מכל כדור. טרופי ועשיר.', ingredients: 'מחית מנגו אלפונסו (45%), מים, סוכר, מיץ לימון', allergens: [] },
  { id: 'strawberry-field', name: 'תות שדה', type: 'sorbet', img: 's-strawberry-field', tags: ['טבעוני'], desc: 'תותים מהשרון, רק פרי, מים וקצת סוכר.', ingredients: 'תותים (50%), מים, סוכר, מיץ לימון', allergens: [] },
  { id: 'passion', name: 'פסיפלורה', type: 'sorbet', img: 's-passion', tags: ['טבעוני'], desc: 'חמוץ, ארומטי ומלא גרעינים פריכים.', ingredients: 'פסיפלורה (35%), מים, סוכר', allergens: [] },
  { id: 'grapefruit', name: 'אשכולית אדומה ורוזמרין', type: 'sorbet', img: 's-grapefruit', tags: ['טבעוני', 'ללא סוכר'], desc: 'אשכולית אדומה עם נגיעה של רוזמרין. מריר-מתוק ומבוגר.', ingredients: 'מיץ אשכולית אדומה (40%), מים, רוזמרין, סטביה', allergens: [] },
  { id: 'berries', name: 'פירות יער', type: 'sorbet', img: 's-berries', tags: ['טבעוני'], desc: 'אוכמניות, פטל ותות, בצבע סגול עמוק.', ingredients: 'פירות יער (45%), מים, סוכר, מיץ לימון', allergens: [] },
  { id: 'pomegranate-blood', name: 'רימון ותפוז דם', type: 'sorbet', img: 's-pomegranate-blood', tags: ['טבעוני', 'עונתי'], desc: 'הטעם העונתי: רימון טרי ותפוז דם. רק עד סוף דצמבר.', ingredients: 'מיץ רימון (30%), מיץ תפוז דם (15%), מים, סוכר', allergens: [] },
];
export const FLAVOUR_COUNT = FLAVOURS.length;

export const ALLERGENS = { milk: 'חלב', nuts: 'אגוזים', gluten: 'גלוטן', eggs: 'ביצים', soy: 'סויה', sesame: 'שומשום' };

// months are 1-12; a range that wraps the year (10→1) is allowed. featured = shown in the home mini builder.
export const FRUITS = [
  { id: 'pomegranate', name: 'רימון', img: 'fruit-pomegranate', from: 9, to: 12, origin: 'קיבוץ גלעד', tint: 'pink', featured: true },
  { id: 'persimmon', name: 'אפרסמון', img: 'fruit-persimmon', from: 10, to: 1, origin: 'עמק יזרעאל', tint: 'peach', featured: true },
  { id: 'date', name: 'תמר טרי', img: 'fruit-date', from: 8, to: 11, origin: 'בקעת הירדן', tint: 'lemon', featured: true },
  { id: 'grapes', name: 'ענבים', img: 'fruit-grapes', from: 6, to: 10, origin: 'לכיש', tint: 'lilac', featured: true },
  { id: 'kiwi', name: 'קיווי', img: 'fruit-kiwi', from: 10, to: 3, origin: 'עמק החולה', tint: 'mint', featured: true },
  { id: 'banana', name: 'בננה', img: 'fruit-banana', from: 1, to: 12, origin: 'כנרת', tint: 'lemon', featured: true },
  { id: 'strawberry', name: 'תות', img: 'fruit-strawberry', from: 12, to: 4, origin: 'השרון', tint: 'pink' },
  { id: 'mango', name: 'מנגו', img: 'fruit-mango', from: 6, to: 9, origin: 'עמק בית שאן', tint: 'peach' },
  { id: 'pineapple', name: 'אננס', img: 'fruit-pineapple', from: 1, to: 12, origin: 'קוסטה ריקה', tint: 'lemon' },
  { id: 'blueberries', name: 'אוכמניות', img: 'fruit-blueberries', from: 1, to: 12, origin: 'רמת הגולן', tint: 'lilac' },
];

// the full builder: every part has a real cut-out that lands on the cup (top-*, crunch-*), sauces swap the cup photo
export const BUILD = {
  sizes: [
    { id: 's', name: 'קטן', ml: 250, included: 2, price: 26, scale: .84 },
    { id: 'm', name: 'בינוני', ml: 350, included: 3, price: 34, scale: .92 },
    { id: 'l', name: 'גדול', ml: 500, included: 4, price: 42, scale: 1 },
  ],
  bases: [
    { id: 'natural', name: 'יוגורט טבעי', note: '3% שומן, חמצמץ' },
    { id: 'vegan', name: 'טבעוני קוקוס', note: 'על בסיס חלב קוקוס' },
    { id: 'nosugar', name: 'ללא סוכר', note: 'ממותק בסטביה' },
  ],
  crunch: [
    { id: 'granola', name: 'גרנולה ביתית', img: 'deco-granola' },
    { id: 'pistachio', name: 'פיסטוק קלוי', img: 'crunch-pistachio' },
    { id: 'pecan', name: 'פקאן מסוכר', img: 'crunch-pecan' },
    { id: 'coconut', name: 'קוקוס קלוי', img: 'crunch-coconut' },
    { id: 'halva', name: 'חלבה', img: 'crunch-halva' },
    { id: 'brownie', name: 'שברי בראוניז', img: 'crunch-brownie' },
  ],
  sauces: [
    { id: 'silan', name: 'סילאן', img: 'sauce-silan', cup: 'build-cup-silan' },
    { id: 'chocolate', name: 'שוקולד חם', img: 'sauce-chocolate', cup: 'build-cup-chocolate' },
    { id: 'caramel', name: 'קרמל מלוח', img: 'sauce-caramel', cup: 'build-cup-caramel' },
    { id: 'pistachio', name: 'ממרח פיסטוק', img: 'sauce-pistachio', cup: 'build-cup-pistachio' },
    { id: 'berry', name: 'רוטב פירות יער', img: 'sauce-berry', cup: 'build-cup-berry' },
  ],
  extra: 4,
  chef: [
    { name: 'RIPE של עונה', size: 'm', base: 'natural', fruits: ['pomegranate', 'persimmon', 'date'], crunch: ['granola'], sauce: 'silan' },
    { name: 'טרופי', size: 'm', base: 'vegan', fruits: ['pineapple', 'kiwi', 'banana'], crunch: ['coconut'], sauce: null },
    { name: 'שוקו-בננה', size: 'l', base: 'natural', fruits: ['banana', 'blueberries'], crunch: ['brownie', 'pecan'], sauce: 'chocolate' },
  ],
};

export const FAQ = [
  { cat: 'הזמנות', items: [
    ['כמה זמן לוקחת הזמנה?', 'איסוף עצמי מוכן תוך 15 דקות. משלוח מהיר מגיע תוך 30–45 דקות מהסניף הקרוב. אפשר גם לבחור שעה מסוימת בקופה.'],
    ['אפשר להזמין לאירוע או למשרד?', 'כן. מארזים גדולים, עוגות גלידה ועמדת יוגורט לאירועים: שלחו לנו הודעה ב-WhatsApp ונחזור אליכם עם הצעה.'],
    ['איך משלמים?', 'בכרטיס אשראי או ב-Bit, בתשלום מאובטח בקופה. כרטיס מתנה אפשר לממש באותו מסך.'],
  ] },
  { cat: 'משלוחים ואיסוף', items: [
    ['לאן אתם שולחים?', 'עד 8 ק"מ מכל סניף: תל אביב והסביבה, הרצליה, רמת השרון, כפר שמריהו, ובירושלים כל המרכז והדרום. אם הכתובת רחוקה מדי, הקופה תציע איסוף.'],
    ['כמה עולה משלוח?', '25 ₪, וחינם בהזמנה מעל 150 ₪. איסוף עצמי תמיד בחינם.'],
    ['למה כוסות וגביעים רק באיסוף?', 'כדורים בגביע לא שורדים נסיעה בלי להימס. מארזים לבית נארזים בתיק תרמי ומגיעים קפואים לגמרי.'],
  ] },
  { cat: 'אלרגנים וכשרות', items: [
    ['אתם כשרים?', 'כן, כשר חלבי בהשגחת הרבנות המקומית. הסניפים סגורים בשבת ונפתחים במוצאי שבת.'],
    ['יש אופציות טבעוניות?', 'כל הסורבות טבעוניות, וגם בסיס יוגורט הקוקוס. בכל טעם מסומנים האלרגנים, ובעמוד הגלידות אפשר לסנן לפי טבעוני, ללא סוכר וללא גלוטן.'],
    ['מה לגבי אגוזים?', 'אנחנו עובדים עם אגוזים במטבח, ולכן כל המוצרים עלולים להכיל עקבות אגוזים.'],
  ] },
  { cat: 'מארזים ושמירה', items: [
    ['כמה זמן מחזיק מארז במקפיא?', 'עד 30 יום במקפיא ביתי. כדאי להוציא 5 דקות לפני ההגשה, כדי שיהיה קל לגרוף.'],
    ['אפשר לבחור טעמים שונים במארז?', 'כן, בעמוד המוצר בוחרים בדיוק כמה טעמים שהמארז מאפשר: 2 בחצי ליטר, 3 בליטר ו-5 במארז של 2.5 ליטר.'],
  ] },
  { cat: 'ביטולים', items: [
    ['אפשר לבטל הזמנה?', 'כל עוד לא התחלנו להכין, כן: התקשרו לסניף או כתבו ב-WhatsApp. מוצר מזון שנמסר אי אפשר להחזיר.'],
    ['משהו לא היה בסדר בהזמנה', 'נשמח לתקן. שלחו לנו תמונה ב-WhatsApp, ונחזיר כסף או נשלח מחדש.'],
  ] },
];

export const inSeason = (f, m = new Date().getMonth() + 1) =>
  f.from <= f.to ? m >= f.from && m <= f.to : m >= f.from || m <= f.to;

export const INGREDIENTS = [
  { name: 'פיסטוק ברונטה', origin: 'סיציליה', text: 'פיסטוק ירוק עז מהמדרונות של האתנה. קולים אותו אצלנו, בכל שבוע מחדש.', img: 'i-pistachio' },
  { name: 'וניל בורבון', origin: 'מדגסקר', text: 'תרמילים שלמים, נפתחים ידנית. בלי תמציות ובלי קיצורי דרך.', img: 'i-vanilla' },
  { name: 'שוקולד 70%', origin: 'בלגיה', text: 'שוקולד מריר אמיתי שנמס לאט, ולכן הגלידה עמוקה ולא מתוקה מדי.', img: 'i-chocolate' },
  { name: 'חלב טרי', origin: 'משק בגליל', text: 'חלב מאותו משק, שמגיע אלינו כל בוקר ועוד באותו יום הופך לגלידה.', img: 'i-milk' },
];

export const REVIEWS = [
  { text: 'הזמנתי מארז של ליטר לשישי בערב והוא הגיע תוך חצי שעה, קפוא לגמרי. הפיסטוק פשוט מטורף.', name: 'מיכל', branch: 'תל אביב', stars: 5 },
  { text: 'בניתי יוגורט עם אפרסמון ורימון. רואים שהפרי נחתך באותו בוקר, וזה מרגיש אחרת לגמרי.', name: 'אורי', branch: 'הרצליה', stars: 5 },
  { text: 'הילדים בחרו לבד באתר מה לשים בכוס, ואני רק אספתי. מוכן תוך 10 דקות.', name: 'דנה', branch: 'ירושלים', stars: 5 },
];

// hours per weekday (0 = Sunday). null = closed. Kosher: closed on Shabbat until evening.
const WEEK = [['12:00', '24:00'], ['12:00', '24:00'], ['12:00', '24:00'], ['12:00', '24:00'], ['12:00', '24:30'], ['11:00', '16:00'], ['19:30', '24:30']];
export const BRANCHES = [
  { id: 'tlv', name: 'תל אביב', address: 'נמל תל אביב, האנגר 12', phone: '03-555-7473', img: 'b-telaviv', hours: WEEK },
  { id: 'herzliya', name: 'הרצליה', address: 'אבא אבן 8, הרצליה פיתוח', phone: '09-555-7473', img: 'b-herzliya', hours: WEEK },
  { id: 'jlm', name: 'ירושלים', address: 'עמק רפאים 31, המושבה הגרמנית', phone: '02-555-7473', img: 'b-jerusalem', hours: WEEK },
];

const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
export function isOpen(branch, d = new Date()) {
  const now = d.getHours() * 60 + d.getMinutes();
  const today = branch.hours[d.getDay()];
  if (today && now >= toMin(today[0]) && now < toMin(today[1])) return true;
  const y = branch.hours[(d.getDay() + 6) % 7]; // past-midnight tail of yesterday
  return !!(y && toMin(y[1]) > 1440 && now < toMin(y[1]) - 1440);
}

// cut-out food shots are transparent webp; scene photos (branches, ingredients) are jpg
export const img = (name, dir = 'assets/img/') => `${dir}${name}.${/^(b|i)-/.test(name) ? 'jpg' : 'webp'}`;
export const money = n => `${n.toLocaleString('he-IL')} ₪`;
