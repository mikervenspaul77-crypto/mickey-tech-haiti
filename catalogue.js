/* MICKEY TECH — références d'appareils et pièces fournies par la boutique.
 * Les prix sont volontairement vides; la boutique pourra les renseigner.
 * Ajouter les photos dans images/ puis leur chemin dans images: [].
 */
const INVENTORY = [
  ['Motorola','phones','Smartphone','Moto G Stylus 5G 2022 128 Go|Moto G 5G 2024 128 Go|Moto G 5G 2022 64 Go|Moto G Power 2022 64 Go|Moto G Power 2021 64 Go|Moto G Stylus 2020 128 Go|Moto G Stylus 5G 2021 128 Go|Moto G06 Power 64 Go|Moto G Play 2023 32 Go|Moto G Pure 32 Go|Moto G 5G 2024 64 Go|Moto G 5G 2025 64 Go|Moto G9 Play 64 Go|Moto G 5G 2023 64 Go|Moto G Stylus 5G 2020 128 Go|Moto Edge 2021 256 Go|Moto E15 64 Go|Moto G05 128 Go|Moto One Ace 128 Go|Moto G56 256 Go'],
  ['Samsung','phones','Smartphone','Galaxy A10e 32 Go|Galaxy A20|Galaxy A17 128 Go Vietnam|Galaxy A16 128 Go Vietnam|Galaxy A16 128 Go Samsung|Galaxy A36 128 Go Samsung|Galaxy A32 5G 256 Go|Galaxy A22 256 Go|Galaxy A21s 128 Go|Galaxy A03s 32 Go|Galaxy A12 64 Go|Galaxy A71 128 Go|Galaxy S21 Ultra 128 Go|Galaxy S20 FE 128 Go|Galaxy A11 32 Go|Galaxy A14 64 Go|Galaxy A24 128 Go|Galaxy A07 64 Go|Galaxy A06 64 Go|Galaxy A26 5G 128 Go Vietnam|Galaxy Note10+ 256 Go|Galaxy S9+ 64 Go|Galaxy S9+ 256 Go|Galaxy J7 Star 32 Go|Galaxy A02s 32 Go'],
  ['TECNO','phones','Smartphone','TECNO Go 2 64 Go'],
  ['itel','phones','Smartphone','itel 50C 64 Go|itel A100C 64 Go'],
  ['M-Horse','phones','Smartphone','M-Horse M17 64 Go|M-Horse S22|M-Horse OT30 Play+|M-Horse A17'],
  ['Revel','phones','Smartphone','Revel 6 64 Go|Revel 4 32 Go|Revel 6 Pro 5G 128 Go|Revel 6X 128 Go'],
  ['TCL','phones','Smartphone','TCL 40 XE 64 Go|TCL 50 LE 64 Go|TCL L5 16 Go'],
  ['Apple','phones','Smartphone','iPhone 7 Plus|iPhone 8 Plus|iPhone XR 128 Go|iPhone X|iPhone 11|iPhone XS Max|iPhone 11 Pro Max|iPhone 12 Pro Max|iPhone 13 Pro Max|iPhone 13 Pro|iPhone 13|iPhone 15 Pro Max|iPhone 15 Pro|iPhone 16|iPhone 16 Pro Max'],
  ['Xiaomi / Redmi','phones','Smartphone','Redmi Note 13 Pro|Redmi Note 13 Pro+|Redmi 13C|Redmi 14C|Redmi A5 64 Go'],
  ['Bold','phones','Smartphone','Bold K5 64 Go'],
  ['MyoTab','tablets','Tablette','MyoTab 10 64 Go / 4 Go RAM'],
  ['Rover','tablets','Tablette','Rover 8 pouces 32 Go'],
  ['Whoop','tablets','Tablette','Whoop 8 pouces|Whoop 10 pouces 32 Go'],
  ['BLU','tablets','Tablette','BLU 8 pouces 32 Go'],

  ['Samsung','screens','Écran','Galaxy A01 court|Galaxy A01 long|Galaxy J4+|Galaxy J3 Prime|Galaxy J3 Star|Galaxy J7 Star|Galaxy J7 Prime|Galaxy A10e|Galaxy A02s court|Galaxy A02s long|Galaxy A03s One Flex|Galaxy A03s Two Flex|Galaxy A03 Core|Galaxy A04|Galaxy A04s|Galaxy A05 Original|Galaxy A05 Incell|Galaxy A05s|Galaxy A50|Galaxy A06|Galaxy A07|Galaxy A10|Galaxy A10s|Galaxy A11 petit|Galaxy A11 grand|Galaxy A12|Galaxy A13 4G|Galaxy A13 5G|Galaxy A14 4G|Galaxy A14 5G|Galaxy A15 4G avec body|Galaxy A15 4G sans body|Galaxy A15 5G avec body|Galaxy A16 4G avec body|Galaxy A16 4G sans body|Galaxy A17 4G avec body|Galaxy A20|Galaxy A20 avec body|Galaxy A20s|Galaxy A21|Galaxy A21s|Galaxy A21s avec body|Galaxy A22 4G avec body|Galaxy A22 4G sans body|Galaxy A22 5G avec body|Galaxy A22 5G sans body|Galaxy A26 OLED|Galaxy A30s|Galaxy A31|Galaxy A32 4G avec body|Galaxy A32 5G|Galaxy A36 5G OLED|Galaxy A42 avec body|Galaxy A52 Incell|Galaxy A53 OLED|Galaxy A52 OLED|Galaxy A55 OLED|Galaxy A71 avec body|Galaxy S8|Galaxy S9|Galaxy S9+|Galaxy S9+ Original|Galaxy S8+ OLED|Galaxy S8+ Original|Galaxy S21 Ultra OLED|Galaxy S10 Incell|Galaxy S10 Original|Galaxy S10+ Incell|Galaxy S10+ Original|Galaxy S20+|Galaxy S20 5G|Galaxy S22 OLED|Galaxy S23 OLED|Galaxy S23 Ultra Original|Galaxy S24 Ultra Original|Galaxy S25 Ultra Original'],
  ['Motorola','screens','Écran','Moto E 2020|Moto G Pure|Moto G Power 2021|Moto G Power 2022|Moto G Play 2024|Moto G Play 2021|Moto G6 Play|Moto G Play 2023|Moto G7 Play|Moto G7 Power|Moto G Fast|Moto One 5G Ace|Moto One 5G UW|Moto E13|Moto E14|Moto E15|Moto G15|Moto E22|Moto E6|Moto E5 Plus|Moto G04|Moto G04s|Moto G 5G|Moto G 5G 2022|Moto G 5G 2023|Moto G7+|Moto G Stylus 2020|Moto G Stylus 4G 2021|Moto G Stylus 5G 2021|Moto G Stylus 5G 2022|Moto G Stylus 4G 2022|Moto G Stylus 5G Two Flex|Moto G Stylus 5G One Flex|Moto Edge 2021|Moto Edge 2022'],
  ['Revel','screens','Écran','Revel 2|Alcatel 7 / OT 6062|Revel 4|Revel V 4G|Revel V+ 5G|Revel 4+|Revel 6|Revel 6 Pro|Revel 7 Pro'],
  ['TCL','screens','Écran','TC503|TCL 20 SE|TCL 30 SE|TCL 20 XE|TCL 30 XE'],
  ['LG','screens','Écran','LG K30|LG K40|LG Aristo|LG Stylo 4|LG K51|LG Stylo 5|LG Stylo 6|LG Stylo 6 avec body|LG Velvet 5G|LG Velvet 4G|LG Stylus 5G|LG Stylus 4G'],
  ['Celero','screens','Écran','Celero 5G'],
  ['TECNO','screens','Écran','TECNO Go 1|TECNO Spark 20C|TECNO Go 2024|TECNO Go 2024 DJN|TECNO Spark 20C DJN|TECNO Spark 10 Pro|TECNO Spark 20 Pro|TECNO Spark 10C|TECNO Spark Go 2023|TECNO Pop 7|TECNO Spark 30C'],
  ['Oukitel','screens','Écran','Oukitel C61|Oukitel C62'],
  ['M-Horse','screens','Écran','M-Horse S22|M-Horse OT30 Play+|M-Horse A17'],
  ['Apple','screens','Écran','iPhone 7 Plus|iPhone 8 Plus|iPhone XR|iPhone X|iPhone 11|iPhone XS Max|iPhone 11 Pro Max|iPhone 12 Pro Max|iPhone 13 Pro Max|iPhone 13 Pro|iPhone 13|iPhone 15 Pro Max|iPhone 15 Pro|iPhone 16|iPhone 16 Pro Max'],
  ['Xiaomi / Redmi','screens','Écran','Redmi Note 13 Pro|Redmi Note 13 Pro+|Redmi 13C|Redmi 14C'],

  ['Samsung','charging-flex','Flex de charge','Galaxy A13 4G|Galaxy A02s|Galaxy A03s|Galaxy A21s|Galaxy A12|Galaxy A32 4G|Galaxy A52 5G|Galaxy A21 5G|Galaxy A14 5G|Galaxy A14 6U|Galaxy A06|Galaxy A20|Galaxy A51 5G|Galaxy A22 4G|Galaxy A22 5G|Galaxy A11 One Side|Galaxy A11 Two Side|Galaxy A05|Galaxy A15 4G / 5G|Galaxy A51 4G|Galaxy A10e|Galaxy A13 5G|Galaxy A55|Galaxy A32 5G'],
  ['Motorola','charging-flex','Flex de charge','Moto G Stylus 4G 2021|Moto G Stylus 5G 2021|Moto G Stylus 2020|Moto G Pure|Moto G7 Play|Moto G7 Power|Moto G Power 2021|Moto E5 Plus|Moto G Stylus 2022|Moto E 2020|Moto G Power 2022|Moto One 5G UW|Moto G Stylus 5G 2022|Moto G Play 2021|Moto One 5G Ace|Moto G50'],
  ['LG','charging-flex','Flex de charge','LG Stylo 6']
];

const slugify = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const seen = new Set();
window.MICKEY_CATALOG = INVENTORY.flatMap(([brand, category, label, names]) => names.split('|').map(name => {
  const key = `${brand}|${category}|${name}`.toLowerCase();
  if (seen.has(key)) return null;
  seen.add(key);
  return {
    id: `${category}-${slugify(brand)}-${slugify(name)}`,
    brand,
    category,
    name,
    series: label,
    label,
    description: 'Prix et disponibilité à confirmer auprès de la boutique.',
    images: []
  };
}).filter(Boolean));
window.MICKEY_BRANDS = [...new Set(window.MICKEY_CATALOG.map(product => product.brand))].sort((a, b) => a.localeCompare(b, 'fr'));
window.MICKEY_CATEGORIES = [
  { id: 'phones', label: 'Téléphones' },
  { id: 'screens', label: 'Écrans' },
  { id: 'charging-flex', label: 'Flex de charge' },
  { id: 'tablets', label: 'Tablettes' }
];
window.MICKEY_SOCIAL = {
  whatsapp: 'https://wa.me/50939068588',
  tiktok: 'https://www.tiktok.com/@mikervens03',
  instagram: 'https://www.instagram.com/mikervensmikervens',
  facebook: '',
  youtube: ''
};
