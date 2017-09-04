// @flow

import React, { Component } from 'react'
import axios from 'axios'

type Props = {
  username: string,
  after: ?string,
  before: ?string,
}

type State = {
  calendarData: Array<{date: string, count: number}>,
}

export default class GitHubContributions extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      calendarData: [],
    }
  }

  componentWillMount() {
    const req = axios.create({
      headers: {
        'Accept': 'text/html'
      }
    })

    const url = this.generateURL(this.props.username)

    if (url) {
      req.get(url)
        .then(res => {
          const parser = new DOMParser()
          const domString = res.data.replace(/\r?\n/g, '')
          const dom = parser.parseFromString(domString, 'application/xml')
          const dailyData = dom.querySelectorAll('.day')

          let contributeData: Array<{date: string, count: number}> = []
          for (const data of dailyData) {
            const date: ?string = data.getAttribute('data-date')
            const count: ?string = data.getAttribute('data-count')

            if (date && count) {
              contributeData.push({
                date: date.toString(),
                count: parseInt(count),
              })
            }
          }

          this.setState({
            calendarData: contributeData
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  render() {
    return(
      <div classname="github-contributions">
      </div>
    )
  }

  generateURL(username: ?string): ?string {
    if (!!username) {
      const url: string = 'https://github.com/users/' + username + '/contributions'
      return url
    }
    return null
  }
}
