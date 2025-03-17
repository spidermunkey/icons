export function signal(value) {
  const subcriptions = new Set();

  return {
    get value() {
      return value
    },
    set value(updated) {
      value = updated
    }
  }
}
