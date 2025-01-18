export enum PackId{
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
};

export type CreditsPack = {
  id: PackId;
  name: string;
  label: string;
  credits: number;
  price: number;
  priceId: string;
};

export const CreditsPacks: CreditsPack[] = [
  {
    id: PackId.SMALL,
    name: "Small pack",
    label: "1000 credits",
    credits: 1000,
    price: 999, // $9.99
    priceId: process.env.STRIPE_SMALL_PACK_PRICE_ID!,
  },
  {
    id: PackId.MEDIUM,
    name: "Medium pack",
    label: "5000 credits",
    credits: 500,
    price: 3999, // $39.99
    priceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID!,
  },
  {
    id: PackId.LARGE,
    name: "Large pack",
    label: "10,000 credits",
    credits: 10000,
    price: 6999, // $69.99
    priceId: process.env.STRIPE_LARGE_PACK_PRICE_ID!,
  },
];

export const getCreditsPack = (id: PackId) => CreditsPacks.find((pack) => pack.id === id);