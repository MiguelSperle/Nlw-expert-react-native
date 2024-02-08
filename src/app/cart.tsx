import Header from '@/components/header'
import { ProductCartProps, useCartStore } from '@/stores/cart-store'
import { Text, View, ScrollView, Alert, Linking, Platform } from 'react-native'
import { Product } from '@/components/product'
import React, { useState } from 'react'
import { formatCurrency } from '@/utils/functions/format-currency'
import Input from '@/components/input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from '@/components/button'
import { Feather } from '@expo/vector-icons'
import LinkButton from '@/components/link-button'
import { useNavigation } from 'expo-router'

const PHONE_NUMBER = '5521991230587'

export default function Cart() {
  const cartStore = useCartStore()
  const navigation = useNavigation()
  const [address, setAddress] = useState<string>('')

  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    ),
  )
  // acumaldor é chamado de total, e passand ali o product significa que o reduce percorrer cada um

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert('Remover', `Deseja remover ${product.title} do carrinho?`, [
      {
        text: 'Cancelar',
      },

      {
        text: 'Remover',
        onPress: () => cartStore.removeProduct(product.id),
      },
    ])
  }

  function handleOrder() {
    // Esse trim remove antes e depois os espaços
    if (address.trim().length === 0) {
      return Alert.alert('Pedido', 'informe os dados da entrega')
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join('')

    const MESSAGE = `NOVO PEDIDO \n Entregar em ${address} ${products} \n Valor total: ${total}`

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${MESSAGE}`,
    )

    cartStore.clear()
    navigation.goBack()
  }

  return (
    <View
      className={Platform.OS === 'android' ? 'flex-1  pt-12' : 'flex-1 pt-8'}
    >
      <Header title="Seu carrinho" />

      <KeyboardAwareScrollView>
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-slate-700">
                {cartStore.products.map((product) => (
                  <Product
                    key={product.id}
                    data={product}
                    onPress={() => handleProductRemove(product)}
                  />
                ))}
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu carrinho está vazio
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">Total</Text>

              <Text className="text-lime-400 text-2xl font-heading">
                {total}
              </Text>
            </View>

            <Input
              placeholder="Informe o endereço de entrega com rua, bairro, cep, número, complemento e o seu nome."
              onChangeText={setAddress}
              onSubmitEditing={handleOrder}
              blurOnSubmit={true}
              returnKeyType="next"
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  )
}
