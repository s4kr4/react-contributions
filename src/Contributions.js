// @flow

import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'

import GitHubData from './GitHubData'
import QiitaData from './QiitaData'
// import QiitaData from '../mock/QiitaData'

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
  GitHub: string,
  Qiita?: string,
  to?: string,
  colors?: Array<string>
}

type State = {
  graphData: Array<Array<{date: string, count: number}>>
}

export default class Contributions extends Component<Props, State> {
  countMax: number
  contributeLevels: Array<number>

  static defaultProps = {
    GitHub: '',
    Qiita: '',
    to: '',
    colors: CELL_COLORS
  }

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
        const style = Object.assign({}, STYLE.cell, {backgroundColor: this.props.colors[this.getContributeLevel(columnData.count)]})
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

    gitHubData = await GitHubData.getContributions(this.props.GitHub, this.props.to)

    if (this.props.Qiita.length) {
      qiitaData = await QiitaData.getContributions(this.props.Qiita)
    }

    return [...gitHubData, ...qiitaData]
  }

  generateGraphData(contributionData: Array<{date: string, count: number}>) {
    let graphData: Array<Array<{date: string, count:number}>> = []
    for (let i = 0; i <= 6; ++i) {
      graphData[i] = [];
    }

    if (contributionData.length > 0) {
      const firstDate: moment = moment(contributionData[0].date)
      const endDate: moment = this.props.to.length ? moment(this.props.to) : moment(new Date())

      for (const contribution of contributionData) {
        const date: moment = moment(contribution.date)

        // Exclude days that is out of range
        if (date.diff(firstDate, 'days') >= 0 && endDate.diff(date, 'days') >= 0) {
          const index: number = date.format('e')
          const count: number = contribution.count

          // Merge duplication data
          let isDuplicate: boolean = false
          for (const data of graphData[index]) {
            if (data.date === date.format('YYYY-MM-DD')) {
              isDuplicate = true
              data.count += count
            }
          }

          // Add new data
          if (!isDuplicate) {
            graphData[index].push({
              date: date.format('YYYY-MM-DD'),
              count: count
            })
          }
          this.countMax = Math.max(this.countMax, count)
        }
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
