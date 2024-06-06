import PaymentMethodChildrenContext from '#context/PaymentMethodChildrenContext'
import Parent from '#components/utils/Parent'
import useCustomContext from '#utils/hooks/useCustomContext'
import { type ChildrenFunction } from '#typings/index'

interface ChildrenProps extends Omit<Props, 'children'> {
  labelName: string
  imagePath?: string
}

interface Props extends Omit<JSX.IntrinsicElements['label'], 'children'> {
  children?: ChildrenFunction<ChildrenProps>
}

export function PaymentMethodName(props: Props): JSX.Element {
  const { payment } = useCustomContext({
    context: PaymentMethodChildrenContext,
    contextComponentName: 'PaymentMethod',
    currentComponentName: 'PaymentMethodName',
    key: 'payment'
  })
  let labelName = payment?.name
  let htmlFor: string | undefined = payment?.payment_source_type
  const imagePath: string | undefined = payment?.metadata?.['image_path']
  const paymentGateway = payment?.payment_gateway

  if (
    payment?.payment_source_type === 'external_payments' &&
    payment?.reference
  ) {
    htmlFor = payment.reference

    switch (payment.reference) {
      case 'AFTERPAY':
        labelName = 'Afterpay'
        break

      case 'APPLEPAY':
        labelName = 'Apple Pay'
        break

      case 'BANKTRANS':
        labelName = 'Bank Transfer'
        break

      case 'BELFIUS':
        labelName = 'Belfius'
        break

      case 'CBC':
        labelName = 'CBC'
        break

      case 'CREDITCARD':
        labelName = 'Credit Card'
        break

      case 'DIRECTBANK':
        labelName = 'Wire Transfer'
        break

      case 'DOTPAY':
        labelName = 'Dotpay'
        break

      case 'GOOGLEPAY':
        labelName = 'Google Pay'
        break

      case 'IDEAL':
        labelName = 'iDEAL'
        break

      case 'IDEALQR':
        labelName = 'iDeal'
        break

      case 'KBC':
        labelName = 'KBC'
        break

      case 'MISTERCASH':
        labelName = 'Mister Cash'
        break

      case 'TRUSTLY':
        labelName = 'Trustly'
        break

      case 'VVVGIFTCARD':
        labelName = 'VVV Cadeaubon'
        break

      case 'PRZELEWY':
        labelName = 'Przelewy24'
    }
  }

  const parentProps = {
    htmlFor,
    labelName,
    imagePath,
    paymentGateway,
    ...props
  }
  return props.children ? (
    <Parent {...parentProps}>{props.children}</Parent>
  ) : (
    <label htmlFor={htmlFor} {...props}>
      {labelName}
    </label>
  )
}

export default PaymentMethodName
