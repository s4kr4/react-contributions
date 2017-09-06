// @flow

import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'

import GitHubData from './GitHubData'

type Props = {
  username: string,
  to: ?string,
}

type State = {
  graphData: Array<Array<{date: string, count:number}>>
}

export default class Contributions extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      graphData: []
    }
  }

  async componentDidMount() {
    const gitHubData = await GitHubData.getContributions(this.props.username, this.props.to)

    this.generateGraphData(gitHubData)
  }

  render() {
    let row = []
    for (const rowData of this.state.graphData) {
      let column = []
      for (const columnData of rowData) {
        column.push(<td>{columnData.count}</td>)
      }
      row.push(<tr>{column}</tr>)
    }

    return(
      <div className="github-contributions">
        <table>
          <tbody>
            {row}
          </tbody>
        </table>
      </div>
    )
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
}
