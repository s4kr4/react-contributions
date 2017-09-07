// @flow

import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'

import GitHubData from './GitHubData'
import QiitaData from '../mock/QiitaData'

const CELL_COLORS = [
  '#eee',
  '#c6e48b',
  '#7bc96f',
  '#239a3b',
  '#196127'
]

const STYLE = {
  cell: {
    height: '10px',
    width: '10px'
  }
}

type Props = {
  GitHub: ?boolean,
  GitHibUsername: ?string,
  Qiita: ?boolean,
  QiitaUsername: ?string,
  to: ?string,
}

type State = {
  graphData: Array<Array<{date: string, count: number}>>
}

export default class Contributions extends Component<Props, State> {
  countMax: number
  contributeLevels: Array<number>

  constructor(props: Props) {
    super(props)

    this.state = {
      graphData: []
    }

    this.countMax = 0
    this.contributeLevels = []
  }

  componentDidMount() {
    this.getContributionData()
      .then(contributionData => {
        this.generateGraphData(contributionData)
      })
  }

  render() {
    let row = []
    let rowKey = 0

    for (const rowData of this.state.graphData) {
      let column = []
      for (const columnData of rowData) {
        const style = Object.assign({}, STYLE.cell, {backgroundColor: CELL_COLORS[this.getContributeLevel(columnData.count)]})
        column.push(<td key={columnData.date} style={style} />)
      }
      row.push(<tr key={rowKey++}>{column}</tr>)
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

  async getContributionData() {
    let gitHubData = []
    let qiitaData = []

    if (this.props.GitHub) {
      gitHubData = await GitHubData.getContributions(this.props.GitHubUsername, this.props.to)
    }

    if (this.props.Qiita) {
      qiitaData = await QiitaData.getContributions(this.props.QiitaUsername)
    }

    return [...gitHubData, ...qiitaData]
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
        this.countMax = Math.max(this.countMax, count)
      }

      this.calculateContributeLevels()

      this.setState({
        graphData: graphData
      })
    }
  }

  calculateContributeLevels(): void {
    this.contributeLevels.push(0)
    for (let i = 1; i <= 4; ++i) {
      this.contributeLevels.push(Math.floor(this.countMax / 4) * i)
    }
  }

  getContributeLevel(count: number): number {
    for (let level = 0; level < 5; ++level) {
      if (count <= this.contributeLevels[level]) {
        return level;
      }
    }
  }
}

Contributions.defaultProps = {
  GitHub: true,
  Qiita: false
}
