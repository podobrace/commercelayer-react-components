import { type GatewayBaseType } from '#components/payment_gateways/PaymentGateway'
import MultisafepayPayment from '#components/payment_source/MultisafepayPayment'
import OrderContext from '#context/OrderContext'
import PaymentMethodChildrenContext from '#context/PaymentMethodChildrenContext'
import PaymentMethodContext from '#context/PaymentMethodContext'
import PaymentSourceContext from '#context/PaymentSourceContext'
import {
  getPaymentConfig,
  type PaymentResource
} from '#reducers/PaymentMethodReducer'
import getCardDetails from '#utils/getCardDetails'
import isEmpty from 'lodash/isEmpty'
import { useContext } from 'react'

type Props = Partial<GatewayBaseType>

export default function MultisafepayGateway(props: Props): JSX.Element | null {
  const { readonly, showCard, handleEditClick, children, ...p } = props
  const { order } = useContext(OrderContext)
  const { payment } = useContext(PaymentMethodChildrenContext)
  const { currentPaymentMethodId, config, paymentSource } =
    useContext(PaymentMethodContext)
  const paymentResource: PaymentResource = 'external_payments'

  if (!readonly && payment?.id !== currentPaymentMethodId) return null
  if (readonly || showCard) {
    const card = getCardDetails({
      customerPayment: {
        payment_source: order?.payment_source || paymentSource
      },
      paymentType: paymentResource
    })
    const value = { ...card, showCard, handleEditClick, readonly }
    return isEmpty(card) ? null : (
      <PaymentSourceContext.Provider value={value}>
        {children}
      </PaymentSourceContext.Provider>
    )
  }
  const multisafepayConfig =
    config && getPaymentConfig(paymentResource, config).externalPayment

  delete p.show
  delete p.templateCustomerCards
  delete p.templateCustomerSaveToWallet
  delete p.loading
  delete p.loaderComponent
  delete p.onClickCustomerCards
  return (
    <MultisafepayPayment {...p} infoMessage={multisafepayConfig?.infoMessage} />
  )
}
