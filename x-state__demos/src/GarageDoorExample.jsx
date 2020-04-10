import React from "react"

import { useMachine } from "@xstate/react"
import { garageDoorMachine } from "./GarageDoorMachine_final"

import { ReactComponent as GarageDoor } from "./GARAGE-DOOR.svg"
import Remote from "./Remote"

const GarageDoorExample = () => {
  const [
    current,
    send, // shape = (type, name)
  ] = useMachine(garageDoorMachine)
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

  function rise(pct) {
    const { el, height } = Door.current
    el.style.transform = `translateY(-${height * (pct / 100)})`
  }
  console.log(current)

  return (
    <>
      <GarageDoor />
      <Remote height={160} />
    </>
  )
}

export default GarageDoorExample
