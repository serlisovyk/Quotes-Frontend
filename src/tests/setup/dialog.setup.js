const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input, select, textarea'

const openers = new WeakMap()

function closeOnEscape(event) {
  if (event.key === 'Escape') this.close()
}

function showModal() {
  openers.set(this, document.activeElement)
  this.setAttribute('open', '')
  this.addEventListener('keydown', closeOnEscape)
  this.querySelector(FOCUSABLE_SELECTOR)?.focus()
}

function close() {
  if (!this.hasAttribute('open')) return

  this.removeAttribute('open')
  this.removeEventListener('keydown', closeOnEscape)
  openers.get(this)?.focus()
  this.dispatchEvent(new Event('close'))
}

HTMLDialogElement.prototype.showModal = showModal
HTMLDialogElement.prototype.close = close
