export function isPhoneValid(phone: string) {
  // eslint-disable-next-line no-useless-escape
  const regex = /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/

  return regex.test(phone)
}
