import React from "react"

// import { MachineViz } from "@statecharts/xstate-viz"

import RedditExample from "./RedditExample"
import { redditMachine } from "./XstateRedditExample"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RedditExample />
        {/* <MachineViz machine={redditMachine} /> */}
      </header>
    </div>
  )
}

export default App
