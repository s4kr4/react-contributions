import React from 'react'
import { expect } from 'chai'

import QiitaData from '../src/QiitaData.js'

const username = 's4kr4'
const to = '2017-09-12'

describe('QiitaData class', () => {
  it('calls getContributions() with invalid arguments', async () => {
    const contributions = await QiitaData.getContributions('', '')
    expect(contributions).to.be.empty
  })
  it('calls getContributions() with valid arguments', async () => {
    const contributions = await QiitaData.getContributions(username, to)
    expect(contributions).to.not.be.empty
  })
})
