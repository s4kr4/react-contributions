// @flow

import axios from 'axios'

export default class GitHubData {
  static generateURL(username: ?string, to: ?string): ?string {
    if (!!username) {
      let url: string = 'https://github.com/users/' + username + '/contributions'

      if (!!to) {
        url += '?to=' + to
      }

      return url
    }
    return null
  }

  static async getContributions(username: ?string, to: ?string) {
    const url: ?string = this.generateURL(username, to)

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
