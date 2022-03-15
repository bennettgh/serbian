export const sanitizeAnswer = (ans: string) => ans.replace('đ', 'd')

export const shuffle = (array: any[]) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const api = {
  async idk() {
    const result = await fetch('http://localhost:5000/')
    const res = await result.json()
    console.log(res)
    return res
  },

  async fetchVerbs() {
    const result = await fetch('http://localhost:5000/verbs')
    const res = await result.json()
    return res
  },

  async postEvent(key: string, result: boolean) {
    const res = await fetch(`http://localhost:5000/events`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key,
        result
      })
    })
    return await res
  }
}
