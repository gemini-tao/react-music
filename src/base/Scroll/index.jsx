import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'

@observer
class Scroll extends Component {

  static propTypes = {
    probeType: PropTypes.number,
    click: PropTypes.bool,
    onScrollEnd: PropTypes.func,
    onScroll: PropTypes.func,
    startPos: PropTypes.object
  }

  static defaultProps = {
    probeType: 1,
    click: true,
    startPos: null
  }

  componentDidMount () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  }

  componentDidUpdate () {
    this.refresh()
  }

  componentWillMount () {
    this.scroll && this.scroll.destroy()
  }

  _initScroll () {
    if (!this.wrapper) {
      return 
    }

    const { probeType, click, onScrollEnd, onScroll, startPos } = this.props
    this.scroll = new BScroll(this.wrapper, {
      probeType,
      click
    })

    if (startPos) {
      this.scroll.scrollTo(startPos.x, startPos.y, 500)
    }

    if (onScrollEnd) {
      this.scroll.on('scrollEnd', pos => {
        onScrollEnd(pos)
      })
    }

    if (onScroll) {
      this.scroll.on('scroll', pos => {
        onScroll(pos)
      })
    }
  }

  refresh () {
    this.scroll && this.scroll.refresh()
  }

  enable () {
    this.scroll && this.scroll.enable()
  }

  disable () {
    this.scroll && this.scroll.disable()
  }

  render () {
    return (
      <div className={this.props.className} ref={wrapper => this.wrapper = wrapper}>
        {this.props.children}
      </div>
    )
  }
}

export default Scroll