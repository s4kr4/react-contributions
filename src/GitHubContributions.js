// @flow

import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'

type Props = {
  username: string,
  after: ?string,
  before: ?string,
}

type State = {
  graphData: Array<Array<{date: string, count:number}>>
}

export default class GitHubContributions extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      graphData: []
    }
  }

  async componentDidMount() {
    const url = this.generateURL(this.props.username)
    const contributionData = await this.getContributions(url)

    this.generateGraphData(contributionData)
  }

  render() {
    return(
      <div className="github-contributions">
      </div>
    )
  }

  generateURL(username: ?string): ?string {
    if (!!username) {
      const url: string = 'https://github.com/users/' + username + '/contributions?to=2017-07-07'
      return url
    }
    return null
  }

  generateGraphData(contributionData: Array<{date: string, count: number}>) {
    if (contributionData.length > 0) {
      const firstDayData: moment = moment(contributionData[0].date)
      const firstDay: string = firstDayData.format('YYYY-MM-DD')
      const firstWeekDay: number = firstDayData.format('e')

      let graphData: Array<Array<{date: string, count:number}>> = []
      for (let i = 0; i <= 6; ++i) {
        graphData[i] = [];
      }

      for (const data of contributionData) {
        const date: moment = moment(data.date)
        const count: number = data.count

        const index: number = Math.abs(date.format('e') - firstWeekDay % 6);
        graphData[index].push({
          date: date.format('YYYY-MM-DD'),
          count: count
        })
      }

      this.setState({
        graphData: graphData
      })
    }
  }

  async getContributions(url: ?string) {
    const req = axios.create({
      headers: {
        'Accept': 'text/html'
      }
    })

    let contributionData: Array<{date: string, count: number}> = []

    if (!!url) {
      await req.get(url)
        .then(res => {
          const parser = new DOMParser()
          const domString = res.data.replace(/\r?\n/g, '')
          const dom = parser.parseFromString(domString, 'application/xml')
          const dailyData = dom.querySelectorAll('.day')

          for (const data of dailyData) {
            const date: ?string = data.getAttribute('data-date')
            const count: ?string = data.getAttribute('data-count')

            if (date && count) {
              contributionData.push({
                date: date.toString(),
                count: parseInt(count),
              })
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    return contributionData
  }
}
