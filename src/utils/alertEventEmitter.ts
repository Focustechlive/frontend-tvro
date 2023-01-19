import { AlertMessage } from '../components/Alert'

export function alertEventEmitter({ type, title, text }: AlertMessage) {
  const event = new CustomEvent('addalert', {
    detail: {
      type,
      title,
      text
    }
  })

  document.dispatchEvent(event)
}
