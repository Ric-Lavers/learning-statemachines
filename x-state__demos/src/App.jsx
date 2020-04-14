import React from "react"

import GarageDoorExample from "./GarageDoorExample"

function App() {
  return (
    <section class="main">
      <div className="App">
        <header className="App-header">
          <GarageDoorExample />
        </header>
      </div>
      <div>
        <iframe
          title="state chart"
          src="https://xstate.js.org/viz/?gist=8cad989b519f2ff932d95fff125edfe9"
          height="100%"
          width="100%"></iframe>
      </div>
    </section>
  )
}

export default App
