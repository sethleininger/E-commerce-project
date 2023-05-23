const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const dbCatData = await Tag.findAll({
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
  
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
   try {
  const dbTagData = await Tag.findByPk(req.params.id, {
    include: [{ 
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      }],
  });
  res.status(200).json(dbTagData)
 } catch (err) {
    res.status(500).json(err);
 }
});


router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

  // update a tag's name by its `id` value
// update tag data
router.put('/:id', async (req, res) => {
  try {
    // Update the tag's name by its `id` value
    const updatedTag = await Tag.update(
      { tag_name: req.body.tag_name }, // Update the tag_name field
      { 
        where: { id: req.params.id } // Specify the tag's id for the update
      }
    );

    // Check if any rows were affected by the update
    if (updatedTag[0] === 0) {
      res.status(404).json({ message: 'No Tag found with that id!' });
      return;
    }

    // Retrieve the updated tag from the database
    const dbTagData = await Tag.findByPk(req.params.id, {
      include: [{ 
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      }],
    });

    res.status(200).json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: 'No Tag found with that id!'});
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
