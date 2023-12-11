class FullScreenMedia extends HTMLElement {
  private mediaElement: HTMLImageElement | HTMLVideoElement | null = null;
  private fullscreenDiv: HTMLDivElement;
  private clonedMediaElement: HTMLImageElement | HTMLVideoElement | null = null;

  constructor() {
    super();
    this.fullscreenDiv = document.createElement('div');
    this.setStyle(this.fullscreenDiv, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'none',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: '1000',
      overflow: 'auto',
      cursor: 'pointer'
    });
    document.body.appendChild(this.fullscreenDiv);

    this.setStyle(this, {
      cursor: 'pointer'
    })

    this.fullscreenDiv.addEventListener('click', () => {
      this.fullscreenDiv.style.display = 'none';
      if (this.clonedMediaElement instanceof HTMLVideoElement) {
        this.clonedMediaElement.pause();
      }
    });
  }

  connectedCallback() {
    this.mediaElement = this.querySelector('img, video');
    if (this.mediaElement) {
      this.clonedMediaElement = this.mediaElement.cloneNode(true) as HTMLImageElement | HTMLVideoElement;
      this.setStyle(this.clonedMediaElement, {
        maxWidth: '80%',
        maxHeight: '80%',
        objectFit: 'contain'
      });
      this.fullscreenDiv.appendChild(this.clonedMediaElement);
      this.addEventListener('click', this.toggleFullscreen);
    }
  }

  disconnectedCallback() {
    this.fullscreenDiv.remove();
  }

  toggleFullscreen = () => {
    this.fullscreenDiv.style.display = this.fullscreenDiv.style.display === 'none' ? 'flex' : 'none';
    if (this.clonedMediaElement instanceof HTMLVideoElement) {
      if (this.fullscreenDiv.style.display === 'flex') {
        this.clonedMediaElement.play();
      } else {
        this.clonedMediaElement.pause();
      }
    }
  }

  private setStyle(element: HTMLElement, styles: { [key: string]: string }) {
    for (const key in styles) {
      element.style[key as any] = styles[key];
    }
  }
}

customElements.define('fullscreen-media', FullScreenMedia);
