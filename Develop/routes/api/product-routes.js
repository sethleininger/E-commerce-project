const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const dbProdData = await Product.findAll({
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Tag,
          attributes: ['tag_name']
        }]
    });
    res.status(200).json(dbProdData)
  } catch (err) {
    res.status(500).json(err);
 }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
 try {
  const dbCatData = await Product.findByPk(req.params.id, {
    attributes: ['id', 'product_name', 'price', 'stock'],
    include: [{ 
      model: Category,
      attributes: ['category_name'],
      }, 
      {
      model: Tag, 
      attributes: ['tag_name'] }],
  });
  res.status(200).json(dbCatData)
 } catch (err) {
    res.status(500).json(err);
 }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
 console.log(req.body);
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr)
          .then(() => {
            return res.status(200).json(product);
          });
      }
      // if no product tags, just respond
      return res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Update the product data
    const [affectedRows] = await Product.update(req.body, {
      where: { id }
    });

    // Check if any rows were affected by the update
    if (affectedRows === 0) {
      res.status(404).json({ message: 'No Product found with that id!' });
      return;
    }

    // Retrieve the updated product from the database, including associated data
    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Tag,
          attributes: ['tag_name'],
          through: { attributes: [] } // Exclude ProductTag attributes
        }
      ]
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const prodData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!prodData) {
      res.status(404).json({ message: 'No Product found with that id!'});
      return;
    }

    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
