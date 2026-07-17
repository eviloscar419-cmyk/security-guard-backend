const dns = require('dns');
const  { promisify } = require('util');
const  PhishingReport = require('../models/PhishingReport.js');
const PasswordStat = require('../models/PasswordStat.js');
const ScanHistory = require('../models/ScanHistory.js');
const Stats = require('../models/Stats.js');
const ActivityLog = require('../models/ActivityLog.js');

const dnsLookup = promisify(dns.lookup);

const analyzePassword = async (req, res) => {
  try {
    const { password, userId } = req.body;
    const checks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };
    const score = Object.values(checks).filter(Boolean).length;
    let label = 'WEAK';
    if (score === 5) label = 'STRONG';
    else if (score >= 3) label = 'MEDIUM';

    const stats = await Stats.findOne();
    if (stats) {
      stats.passwordsAnalyzed++;
      if (label === 'STRONG') stats.strongPasswords++;
      if (label === 'WEAK') stats.weakPasswords++;
      await stats.save();
    }

    if (userId) {
      await PasswordStat.create({ userId, score, label });
      await ScanHistory.create({ userId, type: 'password', result: { score, label } });
      const user = await (await import('../models/User.js')).default.findById(userId);
      if (user) await ActivityLog.create({ action: 'Password analyzed', user: user.name });
    }
    res.json({ score, label, checks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const scanUrl = async (req, res) => {
  try {
    const { url, userId } = req.body;
    const stats = await Stats.findOne();
    if (stats) stats.urlsScanned++;

    let domainExists = true;
    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      const hostname = new URL(normalizedUrl).hostname;
      await dnsLookup(hostname);
    } catch { domainExists = false; }

    if (!domainExists) {
      const result = {
        status: 'DOES NOT EXIST',
        score: 100,
        details: 'Domain does not exist',
        reasons: ['Domain does not exist'],
        url
      };
      if (stats) stats.dangerousUrls++;
      await stats.save();
      await PhishingReport.create({ ...result, userId });
      if (userId) await ScanHistory.create({ userId, type: 'phishing', result });
      return res.json(result);
    }

    let status = 'SAFE';
    let score = Math.floor(Math.random() * 10) + 5;
    let reasons = [];
    const suspiciousWords = ['verify', 'secure-login', 'update-account', 'bonus', 'free'];
    const hasSuspiciousWord = suspiciousWords.some(word => url.toLowerCase().includes(word));
    const isNotHttps = !url.toLowerCase().startsWith('https://');
    const hasAtSymbol = url.includes('@');
    const isXyz = url.toLowerCase().endsWith('.xyz');

    if (hasAtSymbol || isXyz) {
      status = 'DANGEROUS';
      score = Math.floor(Math.random() * 10) + 90;
      reasons.push('Malicious TLD or URL obfuscation');
      if (stats) stats.dangerousUrls++;
    } else if (hasSuspiciousWord || isNotHttps) {
      status = 'SUSPICIOUS';
      score = Math.floor(Math.random() * 20) + 55;
      reasons.push('Phishing keywords or non-HTTPS');
    }
    await stats.save();

    const result = { url, status, score, details: 'Scan complete', reasons };
    await PhishingReport.create({ ...result, userId });
    if (userId) {
      await ScanHistory.create({ userId, type: 'phishing', result });
      const user = await (await import('../models/User.js')).default.findById(userId);
      if (user) await ActivityLog.create({ action: 'URL scanned for phishing', user: user.name });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    res.json(await Stats.findOne());
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  analyzePassword,
  scanUrl,
  getStats,
};
