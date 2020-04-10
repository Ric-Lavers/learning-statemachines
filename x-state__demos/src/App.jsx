import React from "react"

// import { MachineViz } from "@statecharts/xstate-viz"

// import RedditExample from "./RedditExample"
// import { redditMachine } from "./XstateRedditExample"
import GarageDoorExample from "./GarageDoorExample"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GarageDoorExample />
        {/* <MachineViz machine={redditMachine} /> */}
      </header>
    </div>
  )
}

export default App
