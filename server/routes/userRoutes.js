const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: `No user found with the id: ${req.params.id}` });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
// Update user by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUserData = req.body;

    // Ensure the _id in the body matches the URL param (optional but recommended)
    if (updatedUserData._id && updatedUserData._id !== id) {
      return res.status(400).json({ error: 'User ID in body and URL must match' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      updatedUserData,
      { new: true, runValidators: true } // `new: true` returns the updated doc, `runValidators` ensures schema validation
    );

    if (!user) {
      return res.status(404).json({ error: `No user found with the id: ${id}` });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Update error:', err);
    res.status(400).json({ error: 'Failed to update user', details: err.message });
  }
});


// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: `No user found with the id: ${req.params.id}` });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // @desc    Get all users
// // @route   GET /api/users
// // @access  Public
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });

// // @desc    Get single user by ID
// // @route   GET /api/users/:id
// // @access  Public
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: `No user found with the id: ${req.params.id}` });
//     }
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// });

// // @desc    Create a new user
// // @route   POST /api/users
// // @access  Public
// router.post('/', async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ error: 'Failed to create user' });
//   }
// });

// // @desc    Update a user
// // @route   PUT /api/users/:id
// // @access  Public
// router.put('/:id', async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!user) {
//       return res.status(404).json({ error: `No user found with the id: ${req.params.id}` });
//     }
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(400).json({ error: 'Failed to update user' });
//   }
// });

// // @desc    Delete a user
// // @route   DELETE /api/users/:id
// // @access  Public
// router.delete('/:id', async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: `No user found with the id: ${req.params.id}` });
//     }
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to delete user' });
//   }
// });

// module.exports = router;
