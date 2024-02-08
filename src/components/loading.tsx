import { ActivityIndicator, View } from 'react-native'
// Esse ActivityIndicatior india que ta carregando
import colors from 'tailwindcss/colors'

export default function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <ActivityIndicator color={colors.white} />
    </View>
  )
}
