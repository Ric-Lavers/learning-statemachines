import React from "react"

import { useMachine } from "@xstate/react"
import { garageDoorMachine } from "./GarageDoorMachine_final"

import { ReactComponent as GarageDoor } from "./GARAGE-DOOR.svg"
import Remote from "./Remote"

const GarageDoorExample = () => {
  const [state, send] = useMachine(garageDoorMachine)
  const {
    context: { pctOpen },
    value,
    matches,
  } = state

  const Door = React.useRef({
    el: null,
    height: 0,
  })

  React.useLayoutEffect(() => {
    const door = document.getElementById("door")
    Door.current = {
      el: door,
      height: door.getBBox().height,
    }
  }, [])

  React.useEffect(() => {
    const { el, height } = Door.current
    el.style.transform = `translateY(-${height * (pctOpen / 100)}px)`
  }, [pctOpen])

  function rise() {
    send("PRESS_UP")
  }
  function lower() {
    send("PRESS_DOWN")
  }

  return (
    <>
      <pre>
        {JSON.stringify(value)}
        {JSON.stringify(matches({ idle: { rising: "open" } }))}
      </pre>
      <GarageDoor />
      <Remote
        isClosed={matches({ idle: { lowering: "closed" } })}
        isOpen={matches({ idle: { rising: "open" } })}
        height={160}
        onUpButton={rise}
        onDownButton={lower}
      />
    </>
  )
}

export default GarageDoorExample
