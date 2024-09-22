import { MOCK_SPECIAL_PRODUCTS_DATA } from '@/constants/products'

export const getExpireProductsListBroadcast = async () => {
  const productString = MOCK_SPECIAL_PRODUCTS_DATA
  // .map(
  //   (product) => `商品編號: ${product.id} , ${product.name} 金額＄ ${product.price}`
  // ).join(`\n`)
  return productString
}


