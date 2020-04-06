const { createMachine, interpret, assign } = XState
/**
 * actions are side affects
 */
const dragDropMachine = createMachine({
  initial: "idle",
  context: {
    // position of the box
    x: 0,
    y: 0,
    // where you clicked
    pointerX: 0,
    pointerY: 0,
    // how far from you where clicked
    dx: 0,
    dy: 0,
  },
  states: {
    idle: {
      on: {
        // event: nextstate
        mousedown: {
          target: "dragging",
          actions: assign((context, mouseEvent) => {
            return {
              ...context,
              pointerX: mouseEvent.clientX,
              pointerY: mouseEvent.clientY,
            }
          }),
        },
      },
    },
    dragging: {
      on: {
        mousemove: {
          target: "dragging",
          actions: assign((context, mouseEvent) => {
            return {
              ...context,
              dx: mouseEvent.clientX - context.pointerX,
              dy: mouseEvent.clientY - context.pointerY,
            }
          }),
        },
        mouseup: {
          target: "idle",
          // change context.x/y to be the new values
          actions: assign((context, mouseEvent) => {
            return {
              ...context,
              x: context.x + context.dx,
              y: context.y + context.dy,
              dx: 0,
              dy: 0,
            }
          }),
        },
      },
    },
  },
})

const body = document.body
const box = document.getElementById("box")

const dragDropService = interpret(dragDropMachine)
  .onTransition(state => {
    if (state.changed) {
      console.log(state)

      console.log(state.value, state.context)
      box.style.setProperty("left", state.context.x + state.context.dx + "px")
      box.style.setProperty("top", state.context.y + state.context.dy + "px")

      body.dataset.state = state.toStrings().join(" ")
    }
  })
  .start()

box.addEventListener("mousedown", event => {
  //event.clientX
  //event.clientY
  dragDropService.send(event)
})

body.addEventListener("mouseup", event => {
  dragDropService.send("mouseup")
})

body.addEventListener("mousemove", event => {
  dragDropService.send(event)
})
