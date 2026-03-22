
export interface Product {
  id: string;
  brand: string;
  name: string;
  price: string;
  imageSrc: string;
  sizes?: string[];
  category: string;
}

export const newArrivalsData: Product[] = [
  {
    id: "1",
    brand: "YSZ",
    name: "PF T-Shirt Coffee",
    price: "25,00 USD",
    imageSrc: "/images/products/pf-t-shirt/pf-1.jpg", 
    category: "t-shirts",
  },
  {
    id: "2",
    brand: "YSZ",
    name: "WNTT T-Shirt",
    price: "25,00 USD",
    imageSrc: "/images/products/wntt/wntt-1.jpg",
    category: "t-shirts",
  },
  {
    id: "3",
    brand: "YSZ",
    name: "SPY",
    price: "40,00 USD",
    imageSrc: "/images/products/spy/spy-2.jpg",
    category: "long-sleeves",
  },
  {
    id: "4",
    brand: "YSZ",
    name: "WNTT Hoodie",
    price: "30,00 USD",
    imageSrc: "/images/products/wntt/wntt-2.jpg",
    category: "hoodies",
  },
  {
    id: "5",
    brand: "YSZ",
    name: "Spy Collection Trench",
    price: "450,00 EUR",
    imageSrc: "/images/products/bag/bag-5.jpg",
    category: "long-sleeves",
  },
  {
    id: "6",
    brand: "YSZ",
    name: "Knit Balaclava",
    price: "85,00 EUR",
    imageSrc: "/images/products/bag/bag-1.jpg",
    category: "bag",
  },
  {
    id: "7",
    brand: "YSZ",
    name: "Utility Belt",
    price: "95,00 EUR",
    imageSrc: "/images/products/bag/bag-2.jpg",
    category: "bag",
  },
  {
    id: "8",
    brand: "YSZ",
    name: "Oversized Long Sleeve",
    price: "140,00 EUR",
    imageSrc: "/images/products/bag/bag-3.jpg",
    category: "bag",
  },
];