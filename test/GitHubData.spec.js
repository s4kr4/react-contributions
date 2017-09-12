import React from 'react'
import { expect } from 'chai'

import GitHubData from '../src/GitHubData.js'

const username = 's4kr4'
const to = '2017-09-12'

describe('GitHubData class', () => {
  it('calls getContributions() with invalid arguments', async () => {
    const contributions = await GitHubData.getContributions('', '')
    expect(contributions).to.be.empty
  })
  it('calls getContributions() with valid arguments', async () => {
    const contributions = await GitHubData.getContributions(username, to)
    expect(contributions).to.not.be.empty
  })
})
