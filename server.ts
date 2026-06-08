/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { QoEReport, OperatorComparisonStats, RegionSummary, OperatorName, SubscriberUser } from './src/types';

// Seed users database to allow full admin subscriber management and role-based login
let users: SubscriberUser[] = [
  {
    id: 'admin-1',
    name: 'System Super Admin',
    email: 'admin@netpulse.cm',
    phoneNumber: '+237 600 00 00 01',
    city: 'Yaoundé Central',
    region: 'Center',
    registeredAt: '2026-01-01T00:00:00Z',
    status: 'Active',
    tracesCount: 0,
    priorityTier: 'VIP',
    role: 'admin',
    password: 'admin'
  },
  {
    id: 'op-mtn',
    name: 'MTN Network Auditor',
    email: 'mtn@operator.cm',
    phoneNumber: '+237 671 11 22 33',
    city: 'Douala (Akwa)',
    region: 'Littoral',
    registeredAt: '2026-01-10T08:00:00Z',
    status: 'Active',
    tracesCount: 0,
    priorityTier: 'Premium',
    role: 'operator',
    operatorName: 'MTN Cameroon',
    password: 'mtn'
  },
  {
    id: 'op-orange',
    name: 'Orange Network Auditor',
    email: 'orange@operator.cm',
    phoneNumber: '+237 691 11 22 33',
    city: 'Douala (Bonapriso)',
    region: 'Littoral',
    registeredAt: '2026-01-10T08:15:00Z',
    status: 'Active',
    tracesCount: 0,
    priorityTier: 'Premium',
    role: 'operator',
    operatorName: 'Orange Cameroon',
    password: 'orange'
  },
  {
    id: 'op-camtel',
    name: 'Camtel Network Auditor',
    email: 'camtel@operator.cm',
    phoneNumber: '+237 622 11 22 33',
    city: 'Yaoundé (Bastos)',
    region: 'Center',
    registeredAt: '2026-01-11T09:00:00Z',
    status: 'Active',
    tracesCount: 0,
    priorityTier: 'Premium',
    role: 'operator',
    operatorName: 'Camtel',
    password: 'camtel'
  },
  {
    id: 'op-nexttel',
    name: 'Nexttel Network Auditor',
    email: 'nexttel@operator.cm',
    phoneNumber: '+237 661 11 22 33',
    city: 'Garoua Center',
    region: 'North',
    registeredAt: '2026-01-12T10:00:00Z',
    status: 'Active',
    tracesCount: 0,
    priorityTier: 'Premium',
    role: 'operator',
    operatorName: 'Nexttel',
    password: 'nexttel'
  },
  {
    id: 'usr-1',
    name: 'Jean-Pierre Belinga',
    email: 'jp.belinga@telecom.cm',
    phoneNumber: '+237 677 89 45 12',
    city: 'Yaoundé (Bastos)',
    region: 'Center',
    registeredAt: '2026-01-15T08:30:00Z',
    status: 'Active',
    tracesCount: 14,
    priorityTier: 'VIP',
    role: 'subscriber',
    password: 'password'
  },
  {
    id: 'usr-2',
    name: 'Marie-Therese Ngo',
    email: 'm.ngo@gmail.com',
    phoneNumber: '+237 699 44 23 88',
    city: 'Douala (Akwa)',
    region: 'Littoral',
    registeredAt: '2026-02-10T11:15:00Z',
    status: 'Active',
    tracesCount: 22,
    priorityTier: 'Premium',
    role: 'subscriber',
    password: 'password'
  },
  {
    id: 'usr-3',
    name: 'Aboubakar Sidiki',
    email: 'a.sidiki@nord.cm',
    phoneNumber: '+237 622 15 76 90',
    city: 'Garoua',
    region: 'North',
    registeredAt: '2026-03-05T14:45:00Z',
    status: 'Active',
    tracesCount: 8,
    priorityTier: 'Standard',
    role: 'subscriber',
    password: 'password'
  },
  {
    id: 'usr-4',
    name: 'Florence Atangana',
    email: 'f.atanga@uuy2.cm',
    phoneNumber: '+237 681 09 33 22',
    city: 'Yaoundé (Melen)',
    region: 'Center',
    registeredAt: '2026-03-12T17:20:00Z',
    status: 'Suspended',
    tracesCount: 5,
    priorityTier: 'Standard',
    role: 'subscriber',
    password: 'password'
  },
  {
    id: 'usr-5',
    name: 'Comfort Lum',
    email: 'comfort.lum@outlook.com',
    phoneNumber: '+237 675 33 11 00',
    city: 'Bamenda (Up Station)',
    region: 'Northwest',
    registeredAt: '2026-04-01T09:00:00Z',
    status: 'Active',
    tracesCount: 19,
    priorityTier: 'Premium',
    role: 'subscriber',
    password: 'password'
  },
  {
    id: 'usr-6',
    name: 'Emmanuel Foovi',
    email: 'foovi.man@nexttel-user.cm',
    phoneNumber: '+237 661 88 55 22',
    city: 'Bafoussam',
    region: 'West',
    registeredAt: '2026-04-20T10:10:00Z',
    status: 'Banned',
    tracesCount: 1,
    priorityTier: 'Standard',
    role: 'subscriber',
    password: 'password'
  }
];

// Seed data to make the applet fully functional out-of-the-box
let reports: QoEReport[] = [
  {
    id: 'seed-1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    location: { region: 'Center', city: 'Yaoundé (Bastos)', latitude: 3.8767, longitude: 11.5116 },
    metrics: {
      signalStrength: -82,
      signalQuality: 'Good',
      networkType: '4G',
      downloadSpeed: 28.4,
      uploadSpeed: 10.2,
      latency: 55,
      packetLoss: 0.1,
      jitter: 8,
      operator: 'MTN Cameroon'
    },
    feedback: {
      overallQoE: 4,
      browsingRating: 4,
      callingRating: 4,
      streamingRating: 3,
      userComments: 'Good browsing speed but HD video streaming buffers occasionally in the evening.',
      frequentIssues: []
    },
    deviceModel: 'Samsung Galaxy A54 5G'
  },
  {
    id: 'seed-2',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    location: { region: 'Center', city: 'Yaoundé (Mvan)', latitude: 3.8290, longitude: 11.5181 },
    metrics: {
      signalStrength: -101,
      signalQuality: 'Poor',
      networkType: '3G',
      downloadSpeed: 2.8,
      uploadSpeed: 0.9,
      latency: 145,
      packetLoss: 3.4,
      jitter: 28,
      operator: 'Orange Cameroon'
    },
    feedback: {
      overallQoE: 2,
      browsingRating: 2,
      callingRating: 3,
      streamingRating: 1,
      userComments: 'Unstable network signal in Mvan, calls dropping frequently and browsing is painfully slow.',
      frequentIssues: ['Slow Browsing', 'Call Drops', 'High Latency']
    },
    deviceModel: 'Tecno Camon 20'
  },
  {
    id: 'seed-3',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    location: { region: 'Littoral', city: 'Douala (Akwa)', latitude: 4.0482, longitude: 9.7043 },
    metrics: {
      signalStrength: -71,
      signalQuality: 'Excellent',
      networkType: '4G',
      downloadSpeed: 42.1,
      uploadSpeed: 16.5,
      latency: 28,
      packetLoss: 0.0,
      jitter: 4,
      operator: 'Orange Cameroon'
    },
    feedback: {
      overallQoE: 5,
      browsingRating: 5,
      callingRating: 5,
      streamingRating: 5,
      userComments: 'Very fast connection in central Douala. HD streaming works flawlessly.',
      frequentIssues: []
    },
    deviceModel: 'Infinix Note 30'
  },
  {
    id: 'seed-4',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    location: { region: 'Littoral', city: 'Douala (Bonabéri)', latitude: 4.0722, longitude: 9.6738 },
    metrics: {
      signalStrength: -93,
      signalQuality: 'Fair',
      networkType: '4G',
      downloadSpeed: 14.5,
      uploadSpeed: 5.2,
      latency: 68,
      packetLoss: 0.8,
      jitter: 15,
      operator: 'MTN Cameroon'
    },
    feedback: {
      overallQoE: 3,
      browsingRating: 3,
      callingRating: 4,
      streamingRating: 2,
      userComments: 'Browsing is decent but YouTube videos keep dropping standard definition.',
      frequentIssues: ['Slow Browsing']
    },
    deviceModel: 'Xiaomi Redmi Note 12'
  },
  {
    id: 'seed-5',
    timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    location: { region: 'Center', city: 'Yaoundé (Melen)', latitude: 3.8612, longitude: 11.4988 },
    metrics: {
      signalStrength: -80,
      signalQuality: 'Good',
      networkType: '4G',
      downloadSpeed: 21.3,
      uploadSpeed: 11.2,
      latency: 70,
      packetLoss: 0.5,
      jitter: 12,
      operator: 'Camtel'
    },
    feedback: {
      overallQoE: 3,
      browsingRating: 4,
      callingRating: 2,
      streamingRating: 4,
      userComments: 'Good data connection for academic downloads, but VoIP calls and internet calling have some interruptions.',
      frequentIssues: ['High Latency', 'VoIP Jitter']
    },
    deviceModel: 'iPhone 13'
  },
  {
    id: 'seed-6',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    location: { region: 'West', city: 'Bafoussam', latitude: 5.4741, longitude: 10.4208 },
    metrics: {
      signalStrength: -98,
      signalQuality: 'Fair',
      networkType: '3G',
      downloadSpeed: 5.4,
      uploadSpeed: 1.2,
      latency: 110,
      packetLoss: 2.1,
      jitter: 22,
      operator: 'Nexttel'
    },
    feedback: {
      overallQoE: 2,
      browsingRating: 3,
      callingRating: 2,
      streamingRating: 1,
      userComments: 'Nexttel coverage here is mostly 3G. Buffering is standard on video.',
      frequentIssues: ['Slow Browsing', 'Call Drops']
    },
    deviceModel: 'Tecno Spark 10'
  },
  {
    id: 'seed-7',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
    location: { region: 'Southwest', city: 'Buea (Molyko)', latitude: 4.1534, longitude: 9.2412 },
    metrics: {
      signalStrength: -75,
      signalQuality: 'Excellent',
      networkType: '4G',
      downloadSpeed: 32.5,
      uploadSpeed: 12.8,
      latency: 40,
      packetLoss: 0.0,
      jitter: 6,
      operator: 'MTN Cameroon'
    },
    feedback: {
      overallQoE: 4,
      browsingRating: 5,
      callingRating: 4,
      streamingRating: 4,
      userComments: 'Molyko university area is well covered by MTN 4G network.',
      frequentIssues: []
    },
    deviceModel: 'Samsung Galaxy S22'
  },
  {
    id: 'seed-8',
    timestamp: new Date(Date.now() - 3600000 * 32).toISOString(),
    location: { region: 'Northwest', city: 'Bamenda (Up Station)', latitude: 5.9631, longitude: 10.1591 },
    metrics: {
      signalStrength: -105,
      signalQuality: 'Poor',
      networkType: '3G',
      downloadSpeed: 1.8,
      uploadSpeed: 0.4,
      latency: 195,
      packetLoss: 5.2,
      jitter: 45,
      operator: 'Camtel'
    },
    feedback: {
      overallQoE: 1,
      browsingRating: 1,
      callingRating: 2,
      streamingRating: 1,
      userComments: 'Camtel LTE does not work indoor at all. Reverts to weak roaming/3G.',
      frequentIssues: ['No Signal Indoor', 'Slow Browsing', 'High Latency']
    },
    deviceModel: 'Tecno Pop 7'
  },
  {
    id: 'seed-9',
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
    location: { region: 'North', city: 'Garoua', latitude: 9.3031, longitude: 13.3976 },
    metrics: {
      signalStrength: -88,
      signalQuality: 'Good',
      networkType: '4G',
      downloadSpeed: 18.2,
      uploadSpeed: 7.1,
      latency: 75,
      packetLoss: 0.4,
      jitter: 11,
      operator: 'Orange Cameroon'
    },
    feedback: {
      overallQoE: 3,
      browsingRating: 4,
      callingRating: 3,
      streamingRating: 3,
      userComments: 'Decent speed in central Garoua, calls sometimes sound muffled but data works okay.',
      frequentIssues: []
    },
    deviceModel: 'Infinix Hot 30i'
  },
  {
    id: 'seed-10',
    timestamp: new Date(Date.now() - 3600000 * 42).toISOString(),
    location: { region: 'Far North', city: 'Maroua', latitude: 10.5925, longitude: 14.3216 },
    metrics: {
      signalStrength: -94,
      signalQuality: 'Fair',
      networkType: '4G',
      downloadSpeed: 12.1,
      uploadSpeed: 4.8,
      latency: 90,
      packetLoss: 1.2,
      jitter: 18,
      operator: 'MTN Cameroon'
    },
    feedback: {
      overallQoE: 3,
      browsingRating: 3,
      callingRating: 3,
      streamingRating: 2,
      userComments: 'Coverage fluctuates here. Sometimes drops into EDGE/2G.',
      frequentIssues: ['Slow Browsing']
    },
    deviceModel: 'Samsung Galaxy A14'
  }
];

// Calculate Operator Aggregate Performance
function computeOperatorStats(): OperatorComparisonStats[] {
  const operators: OperatorName[] = ['MTN Cameroon', 'Orange Cameroon', 'Camtel', 'Nexttel'];
  return operators.map(op => {
    const subset = reports.filter(r => r.metrics.operator === op);
    if (subset.length === 0) {
      return {
        operator: op,
        avgDownload: 0,
        avgUpload: 0,
        avgLatency: 0,
        avgQoE: 0,
        sampleCount: 0
      };
    }

    const sumDownload = subset.reduce((acc, curr) => acc + curr.metrics.downloadSpeed, 0);
    const sumUpload = subset.reduce((acc, curr) => acc + curr.metrics.uploadSpeed, 0);
    const sumLatency = subset.reduce((acc, curr) => acc + curr.metrics.latency, 0);
    const sumQoE = subset.reduce((acc, curr) => acc + curr.feedback.overallQoE, 0);

    return {
      operator: op,
      avgDownload: parseFloat((sumDownload / subset.length).toFixed(1)),
      avgUpload: parseFloat((sumUpload / subset.length).toFixed(1)),
      avgLatency: Math.round(sumLatency / subset.length),
      avgQoE: parseFloat((sumQoE / subset.length).toFixed(1)),
      sampleCount: subset.length
    };
  });
}

// Calculate regional stats
function computeRegionSummary(): RegionSummary[] {
  const regions = Array.from(new Set(reports.map(r => r.location.region)));
  return regions.map(reg => {
    const subset = reports.filter(r => r.location.region === reg);
    const sumQoE = subset.reduce((acc, r) => acc + r.feedback.overallQoE, 0);
    const lowSatisfactionCount = subset.filter(r => r.feedback.overallQoE <= 2).length;

    return {
      region: reg,
      sampleCount: subset.length,
      avgQoE: parseFloat((sumQoE / subset.length).toFixed(1)),
      troubleRatio: parseFloat(((lowSatisfactionCount / subset.length) * 100).toFixed(1))
    };
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // API Route - Get all reports, operator comparison stats, region summaries, and core counts
  app.get('/api/reports', (req, res) => {
    try {
      const stats = computeOperatorStats();
      const regionStats = computeRegionSummary();
      const latestReports = [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      res.json({
        success: true,
        reports: latestReports,
        stats,
        regionStats,
        users, // Return users so dashboard is sync'd
        totals: {
          totalSubmissions: reports.length,
          avgOverallQoE: parseFloat((reports.reduce((acc, r) => acc + r.feedback.overallQoE, 0) / reports.length).toFixed(1)),
          avgSpeed: parseFloat((reports.reduce((acc, r) => acc + r.metrics.downloadSpeed, 0) / reports.length).toFixed(1)),
          latency: Math.round(reports.reduce((acc, r) => acc + r.metrics.latency, 0) / reports.length),
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route - Create a dynamic report
  app.post('/api/reports', (req, res) => {
    try {
      const { location, metrics, feedback, deviceModel, userId } = req.body;
      
      if (!location || !metrics || !feedback) {
        return res.status(400).json({ success: false, error: 'Missing required report components.' });
      }

      const newReport: QoEReport = {
        id: 'report-' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        location,
        metrics,
        feedback,
        deviceModel: deviceModel || 'Unknown Android Device'
      };

      reports.push(newReport);

      // Increment tracesCount for user if linked
      if (userId) {
        const foundUser = users.find(u => u.id === userId);
        if (foundUser) {
          foundUser.tracesCount += 1;
        }
      }

      res.status(201).json({ success: true, report: newReport });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/auth/login - Authenticate any system user or operator
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
      }
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(400).json({ success: false, error: 'That email is not registered in our system.' });
      }
      if (user.password !== password) {
        return res.status(400).json({ success: false, error: 'Incorrect email or password.' });
      }
      if (user.status === 'Suspended' || user.status === 'Banned') {
        return res.status(403).json({ success: false, error: `This account is currently ${user.status}. Please contact the national TRB (ART) administrator.` });
      }
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/auth/signup - Self-service subscriber account registration
  app.post('/api/auth/signup', (req, res) => {
    try {
      const { name, email, password, phoneNumber, city, region } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: 'Full Name, Email and Password are required.' });
      }
      const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, error: 'This email is already registered.' });
      }
      const newUser: SubscriberUser = {
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        phoneNumber: phoneNumber || '+237 600 00 00 00',
        city: city || 'Yaoundé',
        region: region || 'Center',
        registeredAt: new Date().toISOString(),
        status: 'Active',
        tracesCount: 0,
        priorityTier: 'Standard',
        role: 'subscriber',
        password
      };
      users.push(newUser);
      res.status(201).json({ success: true, user: newUser });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/users - Manage Users list
  app.get('/api/users', (req, res) => {
    res.json({ success: true, users });
  });

  // POST /api/users - Add a new subscriber or operator credentials (by Admin)
  app.post('/api/users', (req, res) => {
    try {
      const { name, email, phoneNumber, city, region, priorityTier, role, password, operatorName } = req.body;
      if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name and email are required.' });
      }
      const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, error: 'This email is already registered in the system.' });
      }
      const newUser: SubscriberUser = {
        id: (role === 'operator' ? 'op-' : 'usr-') + Math.random().toString(36).substr(2, 9),
        name,
        email,
        phoneNumber: phoneNumber || '+237 600 00 00 00',
        city: city || 'Yaoundé',
        region: region || 'Center',
        registeredAt: new Date().toISOString(),
        status: 'Active',
        tracesCount: 0,
        priorityTier: priorityTier || 'Standard',
        role: role || 'subscriber',
        password: password || 'password123',
        operatorName: operatorName || undefined
      };
      users.push(newUser);
      res.status(201).json({ success: true, user: newUser });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // PUT /api/users/:id - Update user status or attributes
  app.put('/api/users/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { status, priorityTier, name, email, phoneNumber, city, region } = req.body;
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return res.status(404).json({ success: false, error: 'User not found.' });
      }
      
      users[userIndex] = {
        ...users[userIndex],
        ...(status && { status }),
        ...(priorityTier && { priorityTier }),
        ...(name && { name }),
        ...(email && { email }),
        ...(phoneNumber && { phoneNumber }),
        ...(city && { city }),
        ...(region && { region })
      };
      
      res.json({ success: true, user: users[userIndex] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // DELETE /api/users/:id - Remove user
  app.delete('/api/users/:id', (req, res) => {
    try {
      const { id } = req.params;
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return res.status(404).json({ success: false, error: 'User not found.' });
      }
      const deletedUser = users.splice(userIndex, 1)[0];
      res.json({ success: true, user: deletedUser });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/predict - AI QoS / QoE operator stability prediction
  app.post('/api/predict', (req, res) => {
    try {
      const { region, city, timeOfDay } = req.body;
      if (!region || !city || !timeOfDay) {
        return res.status(400).json({ success: false, error: 'Missing parameters region, city, or timeOfDay.' });
      }

      const operators: OperatorName[] = ['MTN Cameroon', 'Orange Cameroon', 'Camtel', 'Nexttel'];
      
      const predictions = operators.map(op => {
        const regionReports = reports.filter(r => r.location.region === region && r.metrics.operator === op);
        
        let avgDownload = 12.0;
        let avgLatency = 70;
        let avgQoE = 3.2;
        let ratingCount = regionReports.length;

        if (ratingCount > 0) {
          avgDownload = regionReports.reduce((sum, r) => sum + r.metrics.downloadSpeed, 0) / ratingCount;
          avgLatency = Math.round(regionReports.reduce((sum, r) => sum + r.metrics.latency, 0) / ratingCount);
          avgQoE = regionReports.reduce((sum, r) => sum + r.feedback.overallQoE, 0) / ratingCount;
        } else {
          if (op === 'MTN Cameroon') {
            avgDownload = region === 'Center' || region === 'Littoral' ? 24.5 : 17.5;
            avgLatency = 54;
            avgQoE = 3.8;
          } else if (op === 'Orange Cameroon') {
            avgDownload = region === 'Littoral' ? 27.2 : 15.8;
            avgLatency = 56;
            avgQoE = 3.7;
          } else if (op === 'Camtel') {
            avgDownload = 14.8;
            avgLatency = 70;
            avgQoE = 3.2;
          } else {
            avgDownload = 7.5;
            avgLatency = 112;
            avgQoE = 2.4;
          }
        }

        // Time of day modifier
        let congestionPenalty = 1.0;
        let latencyInflation = 1.0;
        if (timeOfDay === 'Evening') {
          congestionPenalty = 0.62; // heavy peak traffic
          latencyInflation = 1.48;
        } else if (timeOfDay === 'Afternoon') {
          congestionPenalty = 0.82;
          latencyInflation = 1.25;
        } else if (timeOfDay === 'Night') {
          congestionPenalty = 1.30; // light load, ideal speeds!
          latencyInflation = 0.75;
        }

        const predictedDl = parseFloat((avgDownload * congestionPenalty).toFixed(1));
        const predictedLat = Math.round(avgLatency * latencyInflation);

        // Calculate stability scores out of 100
        const speedScore = Math.min(40, (predictedDl / 100) * 40);
        const latencyScore = Math.max(0, Math.min(30, ((300 - predictedLat) / 300) * 30));
        const feedbackScore = Math.min(30, (avgQoE / 5) * 30);
        const stabilityScore = Math.round(speedScore + latencyScore + feedbackScore);

        return {
          operator: op,
          score: Math.max(20, Math.min(99, stabilityScore)),
          expectedDownloadSpeed: predictedDl,
          expectedLatency: predictedLat,
          satisfactionRate: Math.round((avgQoE / 5) * 100)
        };
      });

      // Sort outputs descending
      predictions.sort((a, b) => b.score - a.score);

      const recommendedOperator = predictions[0].operator;
      const confidenceScore = predictions[0].score;

      let reason = `${recommendedOperator} is predicted to provide the most stable connectivity in ${city} during compile-time ${timeOfDay} hours. `;
      if (timeOfDay === 'Evening') {
        reason += `Peak load test profiles show their localized base transceiver stations manage consumer data congestion with fewer dropped slots.`;
      } else if (timeOfDay === 'Night') {
        reason += `Optimal spectral performance is forecast due to reduced user noise cycles in nearby telecom towers.`;
      } else {
        reason += `They maintain a high user satisfaction rating across the sector.`;
      }

      res.json({
        success: true,
        prediction: {
          request: { region, city, timeOfDay },
          recommendedOperator,
          confidenceScore,
          reason,
          rankings: predictions
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Serve static assets in production or Vite in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NetPulse Server] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
