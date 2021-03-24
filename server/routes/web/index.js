module.exports = app => {
  const express = require('express')
  const router = express.Router()
  const Blog = require('../../models/Blog')

  router.post('/blogs', async (req, res) => {
    const model = await Blog.create(req.body);
    res.send(model)
  })



  app.use('/web/api',router)
}