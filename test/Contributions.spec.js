import React from 'react'
import sinon from 'sinon'
import { expect } from 'chai'
import { mount } from 'enzyme'

import Contributions from '../src/Contributions.js'

const CELL_COLORS_DEFAULT = [
  '#eee',
  '#c6e48b',
  '#7bc96f',
  '#239a3b',
  '#196127'
]

const CELL_COLORS = [
  '#eee',
  '#80e8ff',
  '#66b9cc',
  '#4c8b99',
  '#335c66'
]

describe('<Contributions />', () => {
  it('set props properly', () => {
    const wrapper = mount(<Contributions GitHub="s4kr4" />)

    expect(wrapper.props().GitHub).to.equal('s4kr4')
    expect(wrapper.props().Qiita).to.equal(undefined)
    expect(wrapper.props().to).to.equal('')
    expect(wrapper.props().colors).to.deep.equal(CELL_COLORS_DEFAULT)
  })

  it('set props properly(add Qiita)', () => {
    const wrapper = mount(<Contributions GitHub="s4kr4" Qiita="s4kr4" />)

    expect(wrapper.props().GitHub).to.equal('s4kr4')
    expect(wrapper.props().Qiita).to.equal('s4kr4')
    expect(wrapper.props().to).to.equal('')
    expect(wrapper.props().colors).to.deep.equal(CELL_COLORS_DEFAULT)
  })

  it('set props properly(add Qiita and to)', () => {
    const wrapper = mount(<Contributions GitHub="s4kr4" Qiita="s4kr4" to="2017-09-12" />)

    expect(wrapper.props().GitHub).to.equal('s4kr4')
    expect(wrapper.props().Qiita).to.equal('s4kr4')
    expect(wrapper.props().to).to.equal('2017-09-12')
    expect(wrapper.props().colors).to.deep.equal(CELL_COLORS_DEFAULT)
  })

  it('set props properly(add colors)', () => {
    const wrapper = mount(<Contributions GitHub="s4kr4" colors={CELL_COLORS} />)

    expect(wrapper.props().GitHub).to.equal('s4kr4')
    expect(wrapper.props().Qiita).to.equal(undefined)
    expect(wrapper.props().to).to.equal('')
    expect(wrapper.props().colors).to.deep.equal(CELL_COLORS)
  })

  it('calls componentDidMount', () => {
    const componentDidMount = sinon.spy(Contributions.prototype, 'componentDidMount')
    const getContributionData = sinon.spy(Contributions.prototype, 'getContributionData')
    const generateGraphData = sinon.spy(Contributions.prototype, 'generateGraphData')

    const wrapper = mount(<Contributions GitHub="s4kr4" />)

    expect(componentDidMount.callCount).to.equal(1)
    expect(getContributionData.callCount).to.equal(1)

    setTimeout(function() {
      expect(generateGraphData.callCount).to.not.equal(1)
    }, 1000);

    Contributions.prototype.componentDidMount.restore()
    Contributions.prototype.getContributionData.restore()
    Contributions.prototype.generateGraphData.restore()
  })
})
