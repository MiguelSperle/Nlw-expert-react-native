import { PRODUCTS } from '@/utils/data/products'

export function FindProduct(id: string | string[]) {
  const product = PRODUCTS.find((item) => item.id === id)

  return product
}
