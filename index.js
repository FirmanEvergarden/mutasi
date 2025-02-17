import axios from 'axios';
import fs from 'fs';
import moment from 'moment-timezone';
import chalk from 'chalk';
import cron from 'node-cron';
import osu from 'node-os-utils';

// Fungsi untuk mengambil dan menyimpan data
async function fetchAndSaveData() {
  try {
    let anu = await axios.get('https://gateway.okeconnect.com/api/mutasi/qris/OK2246540/669040117377193032246540OKCTEC2622AB8B400DEDD09F773150DAF3A8');
    let res = anu.data;
    fs.writeFileSync('mutasi.json', JSON.stringify(res, null, 2));
    let currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.green.bold('INFO ') + chalk.green.bold(`[`) + chalk.white.bold(`${currentTime}`) + chalk.green.bold(`]: `) + chalk.cyan('Data saved to mutasi.json'));
  } catch (error) {
    console.error(chalk.red('Error fetching or saving data:', error));
  }
}

// Cron job untuk menjalankan fungsi setiap 6 detik
cron.schedule('*/6 * * * * *', fetchAndSaveData);

// Jalankan server Express untuk menampilkan info
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

app.get('/mutasi.json', (req, res) => {
  res.sendFile(process.cwd() + '/mutasi.json');
});

app.get('/info', async (req, res) => {
  const cpu = await osu.cpu.usage();
  const mem = await osu.mem.info();
  const uptime = osu.os.uptime();

  res.json({
    cpu_usage: `${cpu}%`,
    memory: `${mem.usedMemMb}MB / ${mem.totalMemMb}MB`,
    uptime: `${(uptime / 60).toFixed(2)} minutes`
  });
});

app.listen(port, () => {
  console.log(chalk.green(`Server berjalan di port ${port}`));
});
