import React, { Component } from 'react'
import axios from 'axios'

export default class GitHubContributions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      calendarSVG: "",
      calendarData: [],
    }

    this.generateURL = this.generateURL.bind(this)
  }

  componentWillMount() {
    const req = axios.create({
      headers: {
        'Accept': 'text/html'
      }
    })

    const url = this.generateURL(this.props.username)

    req.get(url)
      .then(res => {
        const parser = new DOMParser()
        const domString = res.data.replace(/\r?\n/g, '')
        const dom = parser.parseFromString(domString, 'application/xml')

        this.setState({
          calendarSVG: domString,
          calendarData: dom.querySelectorAll('.day'),
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    for (const data of this.state.calendarData) {
      const date = data.getAttribute('data-date')
      const count = data.getAttribute('data-count')
      console.log(date + ': ' + count)
    }

    return(
      <div>
        { this.state.calendarSVG }
      </div>
    )
  }

  generateURL(username) {
    const url = 'https://github.com/users/' + username + '/contributions'
    return url
  }
}
