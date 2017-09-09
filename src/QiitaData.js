// @flow

import axios from 'axios'
import moment from 'moment'

export default class QiitaData {
  static generateURL(username: ?string, to: ?string): ?string {
    if (!!username) {
      let url: string = 'https://qiita.com/api/v2/users/' + username + '/items'

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
          for (const data of res.data) {
            contributionData.push({
              date: data.created_at,
              count: 1
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    return contributionData
  }
}
