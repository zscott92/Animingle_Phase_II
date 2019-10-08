const axios = require('axios')

const getCalendar = () => {
  try {
    return axios.get('/googlecal')
  } catch (error) {
    console.error(error)
  }
}

const countEvents = async () => {
  const breeds = getCalendar()
    .then(response => {
      if (response.data.message) {
        console.log(
          `Got ${Object.entries(response.data.message).length} calendar entries`
        )
      }
    })
    .catch(error => {
      console.log(error)
    })
}

countEvents()
