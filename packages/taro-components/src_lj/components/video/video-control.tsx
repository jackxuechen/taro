// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Host, Element, Listen, Method } from '@stencil/core'
import { formatTime } from './utils'

@Component({
  tag: 'my-taro-video-control'
})
export class VideoControl implements ComponentInterface {
  private currentTimeRef: HTMLDivElement
  private progressBallRef: HTMLDivElement
  private progressRef: HTMLDivElement
  private isDraggingProgressBall = false
  private percentage = 0
  private progressDimentions = {
    left: 0,
    width: 0
  }

  @Element() controlsRef: HTMLElement

  @Prop() controls: boolean
  @Prop() currentTime: number
  @Prop() duration: number
  @Prop() isPlaying: boolean
  @Prop() pauseFunc: () => void
  @Prop() playFunc: () => void
  @Prop() seekFunc: (position: number) => void
  @Prop() showPlayBtn: boolean
  @Prop() showProgress: boolean
  @Prop() direction:number
  @Prop() isFullScreen:boolean

  @Listen('touchmove', {
    target: 'document'
  })
  onDocumentTouchMove (e: TouchEvent) {
    if (!this.isDraggingProgressBall) return
    const touchX = (this.isFullScreen && this.direction == 90) ? e.touches[0].pageY : e.touches[0].pageX
    this.percentage = this.calcPercentage(touchX)
    this.setProgressBall(this.percentage)
    this.setCurrentTime(this.percentage * this.duration)
  }

  @Listen('touchend', {
    target: 'document'
  })
  @Listen('touchcancel', {
    target: 'document'
  })
  onDocumentTouchEnd () {
    if (!this.isDraggingProgressBall) return

    this.isDraggingProgressBall = false
    this.seekFunc(this.percentage * this.duration)
    this.controlsRef.parentElement.toggleVisibility(true)
  }

  @Method()
  async setProgressBall (percentage: number) {
    if (this.progressBallRef) {
      this.progressBallRef.style.left = `${percentage * 100}%`
    }
  }

  @Method()
  async getIsDraggingProgressBall () {
    return this.isDraggingProgressBall
  }

  @Method()
  async setCurrentTime (time: number) {
    this.currentTimeRef.innerHTML = formatTime(time)
  }

  calcPercentage = (pageX: number): number => {
    if (!this.progressRef) return NaN
    const rect = this.progressRef.getBoundingClientRect()
    this.progressDimentions.left = (this.isFullScreen && this.direction == 90) ? rect.top : rect.left
    this.progressDimentions.width = (this.isFullScreen && this.direction == 90) ? rect.height : rect.width
    // console.log('liujie-video','rect',rect,'isFullScreen',this.isFullScreen,'direction',this.direction ,this.progressDimentions)
    // console.log('liujie-video','calcPercentage','pageX',pageX,this.progressDimentions)
    let pos = pageX - this.progressDimentions.left
    pos = Math.max(pos, 0)
    pos = Math.min(pos, this.progressDimentions.width)
    return pos / this.progressDimentions.width
  }

  onDragProgressBallStart = () => {
    this.isDraggingProgressBall = true
    this.controlsRef.parentElement.clearControlsTimer()
  }

  onClickProgress = (e: MouseEvent) => {
    e.stopPropagation()
    const percentage = this.calcPercentage((this.isFullScreen && this.direction == 90) ? e.pageY : e.pageX)
    // console.log('liujie-video','onClickProgress',percentage,e,'x',e.pageX,'y',e.pageY,'isFullScreen',this.isFullScreen,'direction',this.direction,'duration',this.duration)
    this.seekFunc(percentage * this.duration)
    this.controlsRef.parentElement.toggleVisibility(true)
  }

  render () {
    const {
      controls,
      currentTime,
      duration,
      isPlaying,
      pauseFunc,
      playFunc,
      showPlayBtn,
      showProgress
    } = this

    const formattedDuration = formatTime(duration)
    let playBtn

    if (!showPlayBtn) {
      playBtn = null
    } else if (isPlaying) {
      playBtn = <div class='taro-video-control-button taro-video-control-button-pause' onClick={pauseFunc} />
    } else {
      playBtn = <div class='taro-video-control-button taro-video-control-button-play' onClick={playFunc} />
    }

    return (
      <Host class='taro-video-bar taro-video-bar-full'>
        {controls && (
          <div class='taro-video-controls'>
            {playBtn}
            {showProgress && (
              <div class='taro-video-current-time' ref={dom => (this.currentTimeRef = dom as HTMLDivElement)}>
                {formatTime(currentTime)}
              </div>
            )}
            {showProgress && (
              <div class='taro-video-progress-container' onClick={this.onClickProgress}>
                <div
                  class='taro-video-progress'
                  ref={ref => {
                    this.progressRef = ref as HTMLDivElement
                  }}>
                  <div class='taro-video-progress-buffered' style={{ width: '100%' }} />
                  <div
                    class='taro-video-ball'
                    ref={dom => (this.progressBallRef = dom as HTMLDivElement)}
                    onTouchStart={this.onDragProgressBallStart}
                    style={{
                      left: `${formattedDuration ? (this.currentTime / duration) * 100 : 0}%`
                    }}
                  >
                    <div class='taro-video-inner' />
                  </div>
                </div>
              </div>
            )}
            {showProgress && <div class='taro-video-duration'>{formattedDuration}</div>}
          </div>
        )}
        <slot />
      </Host>
    )
  }
}
