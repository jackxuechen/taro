// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Element, Host, Method, Prop } from '@stencil/core'

@Component({
  tag: 'my-taro-video-control-title'
})
export class VideoControl implements ComponentInterface {

  private visible = false

  private hideControlsTimer: NodeJS.Timeout

  @Element() controlsRef: HTMLElement

  @Prop() controls: boolean
  @Prop() title: string
  @Prop() isPlaying: boolean

  @Method()
  async toggleVisibility (nextVisible?: boolean) {
    const visible = nextVisible === undefined ? !this.visible : nextVisible
    if (visible) {
      this.hideControlsTimer && clearTimeout(this.hideControlsTimer)
      if (this.isPlaying) {
        this.hideControlsTimer = setTimeout(() => {
          this.toggleVisibility(false)
        }, 2000)
      }
      this.controlsRef.style.visibility = 'visible'
    } else {
      this.controlsRef.style.visibility = 'hidden'
    }
    this.visible = !!visible
  }

  render () {
    const {
      controls, title
    } = this
    return (
      <Host class='taro-video-top taro-video-bar-full'>
        <slot />
        {controls && (
          <div class='taro-video-controls'>
            <div class='taro-video-top-title'>{title || ''}</div>
          </div>
        )}
      </Host>
    )
  }
}
