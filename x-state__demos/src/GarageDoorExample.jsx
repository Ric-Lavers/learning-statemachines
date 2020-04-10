import React from "react"

import { useMachine } from "@xstate/react"
import { garageDoorMachine } from "./GarageDoorMachine_final"

import { ReactComponent as GarageDoor } from "./GARAGE-DOOR.svg"
import Remote from "./Remote"

const GarageDoorExample = () => {
  const [
    {
      context: { pctOpen },
      ...current
    },
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

  React.useEffect(() => {
    const { el, height } = Door.current
    el.style.transform = `translateY(-${height * (pctOpen / 100)}px)`
  }, [pctOpen])

  function rise(e) {
    // const { el, height } = Door.current
    // el.style.transform = `translateY(-${height * (pctOpen / 100)})`
    // console.log("rise", e)

    send("PRESS_UP")
  }
  function lower(e) {
    // const { el, height } = Door.current
    // el.style.transform = `translateY(-${height * (pctOpen / 100)})`
    // console.log("lower", e)

    send("PRESS_DOWN")
  }

  return (
    <>
      <pre>{JSON.stringify(current.value)}</pre>
      <GarageDoor />
      <Remote height={160} onUpButton={rise} onDownButton={lower} />
    </>
  )
}

export default GarageDoorExample
