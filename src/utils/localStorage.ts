export interface GetLocalOrderInterface {
  (key: string): string
}

export const getLocalOrder: GetLocalOrderInterface = key => {
  return localStorage.getItem(key)
}

export interface SetLocalOrderInterface {
  (key: string, value: string): void
}

export const setLocalOrder: SetLocalOrderInterface = (key, value) => {
  localStorage.setItem(key, value)
}