import React, { Component } from 'react'
import axios from 'axios'

export default class GitHubContributions extends Component {
  constructor() {
    super()

    this.calendarSVG = null;
  }

  componentWillMount() {
    const req = axios.create({
      headers: {
        'Accept': 'text/html'
      }
    })
    req.get('https://github.com/users/s4kr4/contributions')
      .then(res => {
        console.log(res)
        this.calendarSVG = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return(
      <div>
        { this.calendarSVG }
      </div>
    )
  }
}
