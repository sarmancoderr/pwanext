const express = require('express')
const next = require('next')
const https = require('https')

const secure = require('express-force-https')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev: false })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

app
  .prepare()
  .then(() => {
    const appe = express()

    // redirect to SSL
    if(!dev) { 
      appe.use(secure)
    }

    appe.all('*', (req, res) => {
      return handle(req, res)
    })

    appe.get('*', (req, res) => {
        return handle(req, res)
      })

    const server = https.createServer({
        key: require('fs').readFileSync('./clave.key'),
        cert: require('fs').readFileSync('./cert.crt')
    }, appe).listen(443, () => {
        console.log('escuchando')
    })
/*
    appe.listen(port, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:' + port)
    }) */
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })
