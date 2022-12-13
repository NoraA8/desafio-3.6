const amount = document.querySelector("#amount")
const currency = document.querySelector("#currency")
const dolar = document.querySelector("#dolar")
const euro = document.querySelector("#euro")
const btnSearch = document.querySelector("#btnSearch")
const results = document.querySelector("#results")
const ctx = document.querySelector("#myChart")

const getConverter = async () => {
    try {
      const response = await fetch("https://mindicador.cl/api")
      const data = await response.json()
      if(!response.ok) throw "Fallo la solicitud"
      results.innerHTML = `Resultado: ${parseFloat(amount.value) / data[currency.value].valor}`
    } catch (error) {
      results.innerHTML = error
    } 
};

let graphic

const redenderChart = async(currency) => {
  console.log(currency)
  const res = await fetch(`https://mindicador.cl/api/${currency}`)
  const data = await res.json()
  const arrayChart = data.serie.slice(0, 10).reverse()

  const labels = arrayChart.map(item => item.fecha.split("T")[0].split("-").reverse().join("-"))
  const dataCurrency = arrayChart.map(item => item.valor)

  if (graphic) {
    graphic.destroy()
  }

  graphic = new Chart (ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Ultimos 10 dias',
        data: dataCurrency,
        borderWidth: 1
      }]
    },
  })
}

btnSearch.addEventListener("click", () => {
  const inputAmount = amount.value
  if (!inputAmount) {
    alert("Faltan campos por llenar");
    return;
  }
  getConverter();
  redenderChart(currency.value);
})
