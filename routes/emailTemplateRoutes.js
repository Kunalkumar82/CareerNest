const express = require('express');
const router = express.Router();
const emailTemplateController = require('../controllers/emailTemplateController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// @route   GET api/email-templates
// @desc    Get all templates
router.get('/', emailTemplateController.getTemplates);

// @route   POST api/email-templates
// @desc    Create template
router.post('/', emailTemplateController.createTemplate);

// @route   PUT api/email-templates/:id
// @desc    Update template
router.put('/:id', emailTemplateController.updateTemplate);

// @route   PATCH api/email-templates/:id/usage
// @desc    Increment usage count
router.patch('/:id/usage', emailTemplateController.incrementUsage);

// @route   DELETE api/email-templates/:id
// @desc    Delete template
router.delete('/:id', emailTemplateController.deleteTemplate);

module.exports = router;
