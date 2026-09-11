import app from './api/index.mjs'
const port = Number(process.env.PORT ?? 8787)
app.listen(port, () => console.log(`FarmTelur API listening on ${port}`))
