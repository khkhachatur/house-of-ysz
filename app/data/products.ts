export interface Product {
  id: string;
  brand: string;
  name: string;
  name_ru?: string;
  price: string;
  imageSrc: string;
  sizes?: string[];
  category: string;
}
