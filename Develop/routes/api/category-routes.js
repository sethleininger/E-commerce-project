const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    const dbCatData = await Category.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        },
      ],
    }); 
    res.status(200).json(dbCatData)

  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
 try {
  const dbCatData = await Category.findByPk(req.params.id, {
    include: [{ 
      model: Category, 
      model: Product, 
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'] }],
  });
  res.status(200).json(dbCatData)
 } catch (err) {
    res.status(500).json(err);
 }
});


  // create a new category
router.post('/', async (req, res) => {
  try {
    const catData = await Category.create(req.body);
    res.status(200).json(catData);
  } catch (err) {
    res.status(400).json(err);
  }
});
 
 // update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const catData = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(catData);
  } catch (err) {
    res.status(400).json(err);
  }
 
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const catData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!catData) {
      res.status(404).json({ message: 'No category found with that id!'});
      return;
    }

    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;