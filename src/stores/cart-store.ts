import { ProductProps } from '@/utils/data/products'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import * as cartInMemory from './helpers/cart-in-memory'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ProductCartProps = ProductProps & {
  quantity: number
}

type StateProps = {
  products: ProductCartProps[]
  addProduct: (product: ProductProps) => void
  removeProduct: (productId: string) => void
  clear: () => void
}

export const useCartStore = create(
  persist<StateProps>(
    (set) => ({
      products: [],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addProduct: (product: ProductProps) =>
        set((state) => ({
          // set é um metodo do zustand para atualizar o estado
          // passamos a lista de produtos e o novo produto
          products: cartInMemory.addProduct(state.products, product),
        })),
      removeProduct: (productId: string) =>
        set((state) => ({
          products: cartInMemory.removeProduct(state.products, productId),
        })),
      clear: () => set(() => ({ products: [] })),
    }),
    {
      name: 'nlw-expert:cart', // nome para identificar os dados sendo armazenados
      storage: createJSONStorage(() => AsyncStorage), // definindo qual estrategia vamos usar para armazenar
    },
  ),
)
