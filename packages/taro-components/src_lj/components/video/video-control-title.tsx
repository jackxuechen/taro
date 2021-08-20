// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Element, Host, Prop } from '@stencil/core'

@Component({
  tag: 'my-taro-video-control-title'
})
export class VideoControl implements ComponentInterface {

  @Element() controlsRef: HTMLElement

  @Prop() controls: boolean
  @Prop() title: string
  @Prop() isPlaying: boolean

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
