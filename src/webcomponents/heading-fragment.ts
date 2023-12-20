/**
 * 
 * I'm gonna prefer the astro component over using this because 
 * I want to have an actual h2 on the page and not a custom element.
 * 
 */

class HeadingFragment extends HTMLElement {
  
  static kabob (value: string) {
    return value
      .match(/[A-Z]?[a-z]+|[0-9]+/g)!
      .join('-')
      .toLowerCase()
  }

  static elmWidth (tag: string, text: string) {
    const elm = document.createElement(tag)
    elm.style.display = 'inline'
    elm.style.visibility = 'hidden'
    elm.innerHTML = text
    document.body.append(elm)
    const width = elm.offsetWidth
    elm.remove()
    return width
  }

  defaultEmoji = '🔗'
  emoji: string
  emojiWidth: number = 0
  constructor() {
    super()
    this.as = this.getAttribute('as') || 'h1'
    this.emoji = this.getAttribute('emoji') || this.defaultEmoji
    this.emojiWidth = HeadingFragment.elmWidth(this.as, this.emoji)
  }

  as: string
  text: string
  id: string
  connectedCallback() {
    this.text = this.textContent || ''
    this.id = HeadingFragment.kabob(this.text)

    const heading = this.heading
    const anchor = this.anchor
    const icon = this.icon
    const main = this.main

    heading.addEventListener('mouseenter', () => {
      icon.style.width = (this.emojiWidth + 5) + 'px'
    })

    heading.addEventListener('mouseleave', () => {
      icon.style.width = '0px'
    })

    anchor.appendChild(icon)
    anchor.appendChild(main)
    heading.appendChild(anchor)

    this.innerHTML = ''
    this.appendChild(heading)
  }

  get heading () {
    const e = document.createElement(this.as)
    e.setAttribute('id', this.id)
    return e
  }

  get anchor () {
    const e = document.createElement('a')
    e.style.display = 'flex'
    e.setAttribute('href', `#${this.id}`)
    return e
  }

  get icon () {
    const e = document.createElement('span')
    e.style.overflow = 'hidden'
    e.style.width = '0'
    e.style.whiteSpace = 'nowrap'
    e.style.transition = 'width 0.3s'
    e.textContent = this.emoji
    return e
  }

  get main () {
    const e = document.createElement('span')
    e.textContent = this.text
    return e
  }
}

customElements.define('heading-fragment', HeadingFragment)
