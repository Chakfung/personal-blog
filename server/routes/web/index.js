module.exports = app => {
  const express = require('express')
  const router = express.Router()
  const Blog = require('../../models/Blog')
  const Picture = require('../../models/Picture')
  router.post('/blogs', async (req, res) => {
    const model = await Blog.create(req.body);
    res.send(model)
  })

  router.get('/blogs', async (req, res) => {
    const model = await Blog.find();
    res.send(model)
  })
  router.get('/pictures', async (req, res) => {
    const model = await Picture.find();
    res.send(model)
  })

  app.use('/web/api', router)
}