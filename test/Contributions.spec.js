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
    const componentDidMount = sinon.spy(Contributions.prototype, 'componentDidMount')
    const getContributionData = sinon.spy(Contributions.prototype, 'getContributionData')
    const generateGraphData = sinon.spy(Contributions.prototype, 'generateGraphData')

    const wrapper = mount(<Contributions GitHub="s4kr4" />)

    expect(componentDidMount.callCount).to.equal(1)
    expect(getContributionData.callCount).to.equal(1)

    setTimeout(function() {
      expect(generateGraphData.callCount).to.equal(1)
    }, 1000);

    Contributions.prototype.componentDidMount.restore()
    Contributions.prototype.getContributionData.restore()
    Contributions.prototype.generateGraphData.restore()
  })
})
