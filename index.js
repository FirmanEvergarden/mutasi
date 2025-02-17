const express = require('express');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment-timezone');
const chalk = require('chalk');
const cron = require('node-cron');
const os = require('os');
const osu = require('os-utils');

const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk menyajikan file statis dari folder "public"
app.use(express.static('public'));

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

// Endpoint untuk menampilkan informasi sistem di index.html
app.get('/info', (req, res) => {
  osu.cpuUsage((cpu) => {
    let info = {
      hostname: os.hostname(),
      platform: os.platform(),
      uptime: os.uptime(),
      free_memory: os.freemem(),
      total_memory: os.totalmem(),
      cpu_usage: cpu,
    };
    res.json(info);
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(chalk.green(`Server berjalan di port ${port}`));
});