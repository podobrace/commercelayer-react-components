import _ from 'lodash'
import { BaseState } from '../@types/index'
import { ResourceErrorType, BaseError } from '../@types/errors'

const EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/

type FormField = HTMLInputElement | HTMLSelectElement

export interface ValidateFormFields {
  <R extends string[]>(
    fields: HTMLFormControlsCollection,
    required: R,
    resourceType: ResourceErrorType
  ): {
    errors: BaseError[]
    values: BaseState
  }
}

export interface ValidateValue {
  <
    V extends string | boolean,
    N extends string,
    T extends string,
    B extends ResourceErrorType
  >(
    val: V,
    name: N,
    type: T,
    resourceType: B
  ): BaseError | object
}

export const validateValue: ValidateValue = (val, name, type, resourceType) => {
  if (!val) {
    return {
      field: name,
      code: 'VALIDATION_ERROR',
      message: `${name} - is required`,
      resourceType,
    }
  }
  if (type === 'email' && _.isString(val) && !val.match(EMAIL_PATTERN)) {
    return {
      field: name,
      code: 'VALIDATION_ERROR',
      message: `${name} - is not valid`,
      resourceType,
    }
  }
  return {}
}

const validateFormFields: ValidateFormFields = (
  fields,
  required,
  resourceType
) => {
  const errors: BaseError[] = []
  let values = { metadata: {} }
  _.map(fields, (v: FormField) => {
    const isTick = !!v['checked']
    const val = isTick ? isTick : v.value === 'on' ? false : v.value
    const attrName = v.getAttribute('name')
    if ((attrName && required.indexOf(attrName) !== -1) || v.required) {
      const error = validateValue(val, v.name, v.type, resourceType)
      if (!_.isEmpty(error)) {
        errors.push(error as BaseError)
      }
      values = { ...values, [`${v.name}`]: val }
    }
    if (v.getAttribute('name')) {
      const isMetadata = !!v.getAttribute('data-metadata')
      values = isMetadata
        ? {
            ...values,
            metadata: { ...values.metadata, [`${v.name}`]: val },
          }
        : { ...values, [`${v.name}`]: val }
    }
  })
  return { errors, values }
}

export default validateFormFields
