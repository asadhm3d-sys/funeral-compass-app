import type { DictKey } from "@/lib/i18n";

export type FlowerCatalogueItem = { value: string; titleKey: DictKey; descKey: DictKey; image: string };

export const urnWreathCatalogue: FlowerCatalogueItem[] = [
  { value: "classic", titleKey: "urnWreath_classic", descKey: "urnWreath_classic_d", image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=600&q=70" },
  { value: "white", titleKey: "urnWreath_white", descKey: "urnWreath_white_d", image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=600&q=70" },
  { value: "seasonal", titleKey: "urnWreath_seasonal", descKey: "urnWreath_seasonal_d", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=70" },
  { value: "smallArr", titleKey: "urnWreath_smallArr", descKey: "urnWreath_smallArr_d", image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=600&q=70" },
  { value: "classicArr", titleKey: "urnWreath_classicArr", descKey: "urnWreath_classicArr_d", image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=70" },
  { value: "modernArr", titleKey: "urnWreath_modernArr", descKey: "urnWreath_modernArr_d", image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=70" },
];
