
export interface Product {
  id: string;
  brand: string;
  name: string;
  price: string;
  imageSrc: string;
  sizes?: string[];
}

export const newArrivalsData: Product[] = [
  {
    id: "1",
    brand: "YSZ",
    name: "Spy Hoodie Black",
    price: "249,00 EUR",
    imageSrc: "/images/products/bag/bag-1.jpg", 
  },
  {
    id: "2",
    brand: "YSZ",
    name: "Travel Cargo Pants",
    price: "189,00 EUR",
    imageSrc: "/images/products/bag/bag-2.jpg",
  },
  {
    id: "3",
    brand: "YSZ",
    name: "Heavyweight Boxy Tee",
    price: "120,00 EUR",
    imageSrc: "/images/products/bag/bag-3.jpg",
  },
  {
    id: "4",
    brand: "YSZ",
    name: "Tactical Vest",
    price: "330,00 EUR",
    imageSrc: "/images/products/bag/bag-4.jpg",
  },
  {
    id: "5",
    brand: "YSZ",
    name: "Spy Collection Trench",
    price: "450,00 EUR",
    imageSrc: "/images/products/bag/bag-5.jpg",
  },
  {
    id: "6",
    brand: "YSZ",
    name: "Knit Balaclava",
    price: "85,00 EUR",
    imageSrc: "/images/products/bag/bag-1.jpg",
  },
  {
    id: "7",
    brand: "YSZ",
    name: "Utility Belt",
    price: "95,00 EUR",
    imageSrc: "/images/products/bag/bag-2.jpg",
  },
  {
    id: "8",
    brand: "YSZ",
    name: "Oversized Long Sleeve",
    price: "140,00 EUR",
    imageSrc: "/images/products/bag/bag-3.jpg",
  },
];