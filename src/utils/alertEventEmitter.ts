import { AlertMessage } from '../components/Alert'

export function alertEventEmitter({ title, text }: AlertMessage) {
  const event = new CustomEvent('addalert', {
    detail: {
      title,
      text
    }
  })

  document.dispatchEvent(event)
}
