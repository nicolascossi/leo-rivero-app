export const checkResoulution = (resolution, success, fail) => {
  screen.width > resolution
    ? success?.()
    : fail?.()
}