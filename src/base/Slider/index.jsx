import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observable, action, runInAction, configure } from 'mobx'
import { observer } from 'mobx-react'
import BetterScroll from 'better-scroll'

import './style.styl'

@observer
class Slider extends Component {

  static propTypes = {
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    interval: PropTypes.number
  }
  
  static defaultProps = {
    loop: true,
    autoPlay: true,
    interval: 4000
  }

  @observable currentIndex = 0
  @observable dots = []

  componentDidMount () {
    this.init()
  }

  init () {
    this._setSliderWidth()
    this._initBetterScroll()
  }

  _setSliderWidth (isResize) {
    const { loop } = this.props
    let width = 0
    const oneSliderWidth = this.sliderWrapper.clientWidth
    this.children = this.sliderGroup.children

    for (let i = 0; i < this.children.length; i ++) {
      let child = this.children[i]
      child.style.width = oneSliderWidth + 'px'
      width += oneSliderWidth
    }

    if (loop && !isResize) {
      width += 2 * oneSliderWidth
    }

    this.sliderGroup.style.width = width + 'px'
  }

  _play () {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.slider.next()
    }, this.props.interval);
  }

  _initBetterScroll () {
    this.slider = new BetterScroll(this.sliderWrapper, {
      scrollX: true,
      scrollY: false,
      momentum: false,
      click: true,
      snap: {
        loop: this.props.loop,
        threshold: 0.3,
        speed: 400
      }
    })

    this.slider.on('scrollEnd', () => {
      runInAction(() => {
        this.currentIndex = this.slider.getCurrentPage().pageX
        if (this.props.autoPlay) {
          this._play()
        }
      })
    })

    this.slider.on('touchEnd', () => {
      if (this.props.autoPlay) {
        this._play()
      }
    })
  }

  render () {
    return (
      <div className="slider" ref={sliderWrapper => this.sliderWrapper = sliderWrapper}>
        <div className="slider-group" ref={sliderGroup => this.sliderGroup = sliderGroup}>
          {this.props.children}
        </div>
        <div className="dots">
          {this.currentIndex}
        </div>
      </div>
    )
  }
}

export default Slider
