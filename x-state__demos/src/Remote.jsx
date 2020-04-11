import React from "react"

const Remote = ({
  onUpButton,
  onDownButton,
  isOpen = false,
  isClosed = false,
  ...props
}) => {
  console.log({
    isOpen,
    isClosed,
  })

  return (
    <svg
      className="remote"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 238.02 239.72"
      {...props}>
      <title>REMOTE</title>
      <path
        className="a"
        d="M94,46.67a10.46,10.46,0,0,0,15,14.58,14.36,14.36,0,0,1,20.28-.31,10.46,10.46,0,0,0,14.57-15A35.3,35.3,0,0,0,94,46.67Z"
      />
      <path
        className="a"
        d="M74.68,25.39A10.46,10.46,0,1,0,89.69,40a41.61,41.61,0,0,1,58.85-.88,10.46,10.46,0,0,0,14.8-.22,10.29,10.29,0,0,0,2.42-4,10.47,10.47,0,0,0-2.64-10.8,62.54,62.54,0,0,0-88.44,1.32Z"
      />
      <rect
        className="r_stroke"
        x="73.01"
        y="87.86"
        width="92"
        height="144.67"
      />

      <polygon
        id="UP_BUTTON"
        className={`r_stroke button ${isOpen && "red"}`}
        onClick={onUpButton}
        points="119.01 103.53 93.03 148.53 144.99 148.53 119.01 103.53"
      />
      <polygon
        id="DOWN_BUTTON"
        className={`r_stroke button ${isClosed && "red"}`}
        onClick={onDownButton}
        points="119.01 218.86 144.99 173.86 93.03 173.86 119.01 218.86"
      />
    </svg>
  )
}
export default Remote
