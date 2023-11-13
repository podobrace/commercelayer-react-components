import { useContext, useEffect, useMemo, useState } from 'react'
import BaseSelect from '#components/utils/BaseSelect'
import {
  type AddressStateSelectName,
  type BaseSelectComponentProps
} from '#typings'
import BillingAddressFormContext from '#context/BillingAddressFormContext'
import ShippingAddressFormContext from '#context/ShippingAddressFormContext'
import isEmpty from 'lodash/isEmpty'
import {
  getStateOfCountry,
  isValidState,
  type States
} from '#utils/countryStateCity'
import AddressesContext from '#context/AddressContext'
import BaseInput from '#components/utils/BaseInput'
import CustomerAddressFormContext from '#context/CustomerAddressFormContext'

type Props = Omit<BaseSelectComponentProps, 'options' | 'name'> & {
  name: AddressStateSelectName
  required?: boolean
  disabled?: boolean
  inputClassName?: string
  selectClassName?: string
  /**
   * Optional states list to extend the default one.
   * This component will try to render a select getting as options the states found for the selected country.
   * If the country has no states, it will render a text input field instead.
   */
  states?: States
} & Pick<JSX.IntrinsicElements['select'], 'className' | 'id' | 'style'>

export function AddressStateSelector(props: Props): JSX.Element {
  const {
    required = true,
    value,
    name,
    className = '',
    inputClassName = '',
    selectClassName = '',
    states,
    ...p
  } = props
  const billingAddress = useContext(BillingAddressFormContext)
  const shippingAddress = useContext(ShippingAddressFormContext)
  const customerAddress = useContext(CustomerAddressFormContext)
  const { errors: addressErrors } = useContext(AddressesContext)
  const [hasError, setHasError] = useState(false)
  const [countryCode, setCountryCode] = useState('')
  const [val, setVal] = useState(value || '')

  const stateOptions = useMemo(() => {
    if (isEmpty(countryCode)) {
      return []
    }
    return getStateOfCountry({
      countryCode,
      states
    })
  }, [states, countryCode])

  const isEmptyStates = useMemo(
    () => () => isEmpty(stateOptions),
    [stateOptions]
  )

  useEffect(() => {
    const billingCountryCode =
      typeof billingAddress?.values?.billing_address_country_code === 'string'
        ? billingAddress?.values?.billing_address_country_code
        : billingAddress?.values?.billing_address_country_code?.value
    if (billingCountryCode && billingCountryCode !== countryCode)
      setCountryCode(billingCountryCode)
    const shippingCountryCode =
      typeof shippingAddress?.values?.shipping_address_country_code === 'string'
        ? shippingAddress?.values?.shipping_address_country_code
        : shippingAddress?.values?.shipping_address_country_code?.value
    if (shippingCountryCode && shippingCountryCode !== countryCode)
      setCountryCode(shippingCountryCode)
    const changeBillingCountry = [
      Object.keys(billingAddress).length > 0,
      billingCountryCode,
      countryCode !== billingCountryCode
    ].every(Boolean)
    if (
      changeBillingCountry &&
      billingCountryCode &&
      !isValidState({
        stateCode: val,
        countryCode: billingCountryCode,
        states
      }) &&
      !isEmptyStates()
    ) {
      if (billingAddress.resetField) billingAddress?.resetField(name)
      setVal('')
    }
    const changeShippingCountry = [
      !isEmpty(shippingAddress),
      shippingCountryCode,
      countryCode !== shippingCountryCode
    ].every(Boolean)
    if (
      changeShippingCountry &&
      shippingCountryCode &&
      !isValidState({
        stateCode: val,
        countryCode: shippingCountryCode,
        states
      }) &&
      !isEmptyStates()
    ) {
      if (shippingAddress.resetField) shippingAddress?.resetField(name)
      setVal('')
    }
    if (!isEmpty(billingAddress)) {
      const fieldError = billingAddress?.errors?.[name]?.error
      if (!fieldError) setHasError(false)
      else setHasError(true)
    }
    if (!isEmpty(customerAddress)) {
      const fieldError = customerAddress?.errors?.[name]?.error
      if (!fieldError) setHasError(false)
      else setHasError(true)
    }
    if (!isEmpty(shippingAddress)) {
      const fieldError = shippingAddress?.errors?.[name]?.error
      if (!fieldError) setHasError(false)
      else setHasError(true)
    }
    return () => {
      setHasError(false)
    }
  }, [value, billingAddress, shippingAddress, addressErrors, customerAddress])
  const errorClassName =
    billingAddress?.errorClassName ||
    shippingAddress?.errorClassName ||
    customerAddress?.errorClassName ||
    ''
  const classNameComputed = !isEmptyStates()
    ? `${className} ${selectClassName} ${hasError ? errorClassName : ''}`
    : `${className} ${inputClassName} ${hasError ? errorClassName : ''}`

  return !isEmptyStates() ? (
    <BaseSelect
      {...p}
      className={classNameComputed}
      ref={
        (billingAddress?.validation as any) ||
        shippingAddress?.validation ||
        customerAddress?.validation
      }
      required={required}
      options={stateOptions}
      name={name}
      value={val}
    />
  ) : (
    <BaseInput
      {...(p as any)}
      name={name}
      ref={
        (billingAddress?.validation as any) ||
        shippingAddress?.validation ||
        customerAddress?.validation
      }
      className={classNameComputed}
      required={required}
      placeholder={p.placeholder?.label || ''}
      defaultValue={val}
      type='text'
    />
  )
}

export default AddressStateSelector
