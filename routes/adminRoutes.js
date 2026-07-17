const express = require ('express');
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getActivityLogs,
  deleteActivityLog,
  clearActivityLogs,
  getPhishingReports,
  deletePhishingReport,
  clearPhishingReports,
  getPasswordStats,
  deletePasswordStat,
  clearPasswordStats,
  updateSettings,
  resetStats
}  = require('../controllers/adminController.js');

const router = express.Router();
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/logs', getActivityLogs);
router.delete('/logs/:id', deleteActivityLog);
router.post('/logs/clear', clearActivityLogs);

router.get('/phishing-reports', getPhishingReports);
router.delete('/phishing-reports/:id', deletePhishingReport);
router.post('/phishing-reports/clear', clearPhishingReports);

router.get('/password-stats', getPasswordStats);
router.delete('/password-stats/:id', deletePasswordStat);
router.post('/password-stats/clear', clearPasswordStats);

router.put('/settings', updateSettings);
router.post('/stats/reset', resetStats);

module.exports = router;