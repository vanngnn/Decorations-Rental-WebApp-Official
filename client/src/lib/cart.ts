export type CartItem = { productId: string; quantity: number };

const KEY = "decor_cart_v1";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function setCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(productId: string, quantity: number) {
  const items = getCart();
  const index = items.findIndex((x) => x.productId === productId);
  if (index >= 0) items[index].quantity += quantity;
  else items.push({ productId, quantity });
  setCart(items);
}
