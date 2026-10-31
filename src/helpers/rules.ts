/** Правило проверки поля формы Vuetify: `true` или текст ошибки. */
export type FieldRule = (value: unknown) => true | string

export const required: FieldRule = (value) => {
  const filled = typeof value === 'string' ? value.trim() !== '' : value !== null && value !== undefined
  return filled || 'Обязательное поле'
}
