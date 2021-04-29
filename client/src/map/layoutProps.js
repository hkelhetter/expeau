const role = 0
if (role) require("./manager.css")

const layoutProps = {
    flat: false,
    spacing: role == 1 ? 1.1 : 1,
    size: { x: 4, y: 4 },
    x: 0,
    y: 0,
}

export default layoutProps