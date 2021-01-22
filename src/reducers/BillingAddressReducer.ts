import baseReducer from '#utils/baseReducer'
import { Dispatch } from 'react'
import { CommerceLayerConfig } from '#context/CommerceLayerContext'
import { Address, OrderCollection } from '@commercelayer/js-sdk'
import { getOrderContext } from '#reducers/OrderReducer'

export type BillingAddressActionType =
  | 'setBillingAddress'
  | 'setBillingCustomerAddressId'

export interface BillingAddressActionPayload {
  _billingAddressCloneId: string
  billingCustomerAddressId: string
}

export type BillingAddressState = Partial<BillingAddressActionPayload>

export interface BillingAddressAction {
  type: BillingAddressActionType
  payload: Partial<BillingAddressActionPayload>
}

export const billingAddressInitialState: BillingAddressState = {
  _billingAddressCloneId: '',
}

export type SetBillingAddress = (
  id: string,
  options?: {
    config: CommerceLayerConfig
    dispatch: Dispatch<BillingAddressAction>
    order?: OrderCollection
    getOrder?: getOrderContext
    shipToDifferentAddress?: boolean
    customerAddressId?: string
  }
) => Promise<void>

export const setBillingAddress: SetBillingAddress = async (id, options) => {
  try {
    if (options?.order) {
      if (options.customerAddressId) {
        const address = await Address.withCredentials(options.config).find(id)
        if (address.reference !== options.customerAddressId) {
          await address.withCredentials(options.config).update({
            reference: options.customerAddressId,
          })
        }
      }
      const updateObj: Partial<Record<string, any>> = {
        _billingAddressCloneId: id,
        _shippingAddressCloneId: id,
      }
      if (options?.shipToDifferentAddress) {
        delete updateObj._shippingAddressCloneId
      }
      const o = await options?.order
        .withCredentials(options.config)
        .update(updateObj)
      const orderId = o.id
      options?.getOrder && (await options?.getOrder(orderId))
      options.dispatch({
        type: 'setBillingAddress',
        payload: {
          _billingAddressCloneId: id,
        },
      })
    }
  } catch (error) {
    console.error(error)
  }
}

type SetBillingCustomerAddressId = (args: {
  customerAddressId: string
  dispatch: Dispatch<BillingAddressAction>
}) => void

export const setBillingCustomerAddressId: SetBillingCustomerAddressId = ({
  customerAddressId,
  dispatch,
}) => {
  dispatch({
    type: 'setBillingCustomerAddressId',
    payload: { billingCustomerAddressId: customerAddressId },
  })
}

const type: BillingAddressActionType[] = [
  'setBillingAddress',
  'setBillingCustomerAddressId',
]

const billingAddressReducer = (
  state: BillingAddressState,
  reducer: BillingAddressAction
): BillingAddressState =>
  baseReducer<
    BillingAddressState,
    BillingAddressAction,
    BillingAddressActionType[]
  >(state, reducer, type)

export default billingAddressReducer