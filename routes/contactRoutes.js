const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

// Validates that the user is logged in
router.use(authMiddleware);

// @route   GET api/contacts
// @desc    Get all users contacts
router.get('/', contactController.getContacts);

// @route   POST api/contacts
// @desc    Add new contact
router.post('/', contactController.createContact);

// @route   PUT api/contacts/:id
// @desc    Update contact
router.put('/:id', contactController.updateContact);

// @route   DELETE api/contacts/:id
// @desc    Delete contact
router.delete('/:id', contactController.deleteContact);

module.exports = router;
