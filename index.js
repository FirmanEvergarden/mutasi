const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const chalk = require('chalk');
const cron = require('node-cron');
const os = require('os');
const osu = require('node-os-utils');

const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk menyajikan index.html dari root folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fungsi untuk mengambil dan menyimpan data mutasi
async function fetchAndSaveData() {
  try {
    let anu = await axios.get('https://gateway.okeconnect.com/api/mutasi/qris/OK2246540/669040117377193032246540OKCTEC2622AB8B400DEDD09F773150DAF3A8');
    let res = anu.data;
    fs.writeFileSync('mutasi.json', JSON.stringify(res, null, 2));
    let currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.green.bold('INFO ') + chalk.green.bold(`[`) + chalk.white.bold(`${currentTime}`) + chalk.green.bold(`]: `) + chalk.cyan('Data saved to mutasi.json'));
  } catch (error) {
    console.error(chalk.red('Error fetching or saving data:', error.message));
  }
}

// Cron job untuk menjalankan `fetchAndSaveData` setiap 6 detik
cron.schedule('*/6 * * * * *', fetchAndSaveData);

// Endpoint untuk menampilkan data JSON
app.get('/mutasi.json', (req, res) => {
  try {
    let data = fs.readFileSync('mutasi.json', 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: 'Data belum tersedia' });
  }
});

// Endpoint untuk menampilkan informasi server
app.get('/info', async (req, res) => {
  try {
    const cpuUsage = await osu.cpu.usage();
    const memInfo = await osu.mem.info();
    const driveInfo = await osu.drive.info();

    let info = {
      hostname: os.hostname(),
      platform: os.platform(),
      uptime: (os.uptime() / 3600).toFixed(2) + " hours",
      cpu_usage: cpuUsage + " %",
      free_memory: memInfo.freeMemMb + " MB",
      total_memory: memInfo.totalMemMb + " MB",
      used_disk: driveInfo.usedGb + " GB",
      free_disk: driveInfo.freeGb + " GB",
      total_disk: driveInfo.totalGb + " GB"
    };

    res.json(info);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil informasi sistem' });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(chalk.green(`Server berjalan di port ${port}`));
});
