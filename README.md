# react-contributions [![Build Status](https://travis-ci.org/s4kr4/react-contributions.svg?branch=master)](https://travis-ci.org/s4kr4/react-contributions)

React component to show your contributions calendar.


# Features

- Get GitHub's contributions calendar
- Collaboration with articles data of [Qiita](https://qiita.com/)
- Specifiable a duration to show
- Changable the calendar's color


# Usage

```javascript
import React, { Component } from 'react';
import Contributions from 'react-contributions';

const COLORS = [
  '#eee',
  '#80e8ff',
  '#66b9cc',
  '#4c8b99',
  '#335c66'
]

class App extends Component {
  render() {
    return (
      <div className="App">
        <Contributions GitHub="s4kr4" Qiita="s4kr4" to="2017-09-12" colors={COLORS} />
      </div>
    );
  }
}
```


# API

|Props|Effects|
|:--|:--|
|GitHub (Required)|GitHub's username|
|Qiita|Qiita's username|
|to|The last day of the duration|
|colors|Array of Hex color code|


# LICENSE

MIT
