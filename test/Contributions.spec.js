import React from 'react'
import sinon from 'sinon'
import { expect } from 'chai'
import { mount } from 'enzyme'

import Contributions from '../src/Contributions.js'

describe('<Contributions />', () => {
  it('set props properly', () => {
    const wrapper = mount(<Contributions GitHub="s4kr4" />)
    expect(wrapper.props().GitHub).to.equal('s4kr4')
    expect(wrapper.props().Qiita).to.equal('')
    expect(wrapper.props().to).to.equal('')
  })

  it('calls componentDidMount', () => {
    sinon.spy(Contributions.prototype, 'componentDidMount')
    const wrapper = mount(<Contributions GitHub="s4kr4" />)
    expect(Contributions.prototype.componentDidMount).to.have.property('callCount', 1)
    Contributions.prototype.componentDidMount.restore()
  })
})
