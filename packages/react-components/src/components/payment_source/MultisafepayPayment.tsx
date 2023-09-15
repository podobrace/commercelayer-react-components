import isFunction from 'lodash/isFunction'
import {
  type FunctionComponent,
  useContext,
  useEffect,
  useRef,
  type ReactNode
} from 'react'

import PaymentMethodContext from '#context/PaymentMethodContext'

export interface MultisafepayConfig {
  infoMessage?: {
    text?: string | ReactNode
    className?: string
  }
}

const defaultMessage =
  'By placing the order, you will be redirected to a Multisafepay page to authorize the payment'

type Props = MultisafepayConfig & JSX.IntrinsicElements['div']
const MultisafepayPayment: FunctionComponent<Props> = ({
  infoMessage,
  ...p
}) => {
  const ref = useRef<null | HTMLFormElement>(null)

  const { paymentSource, currentPaymentMethodType, setPaymentRef } =
    useContext(PaymentMethodContext)

  useEffect(() => {
    if (ref.current && currentPaymentMethodType) {
      setPaymentRef({ ref })
    }

    return () => {
      setPaymentRef({ ref: { current: null } })
    }
  }, [ref, paymentSource, currentPaymentMethodType])

  return (
    <form ref={ref}>
      <div {...p}>
        <span className={infoMessage?.className}>
          {isFunction(infoMessage?.text)
            ? infoMessage?.text()
            : infoMessage?.text || defaultMessage}
        </span>
      </div>
    </form>
  )
}

export default MultisafepayPayment
