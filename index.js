import axios from 'axios';
import fs from 'fs';
import moment from 'moment-timezone';
import chalk from 'chalk';
import osu from 'node-os-utils';

// Fungsi untuk mengambil dan menyimpan data
async function fetch() {
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

async function fetch_biwa() {
  try {
    let anu = await axios.get('https://gateway.okeconnect.com/api/mutasi/qris/OK2223186/480989917383217222223186OKCT85CA4B7C99FBC19AF9D3CD9D93B8C260');
    let res = anu.data;
    fs.writeFileSync('mutasi_biwa.json', JSON.stringify(res, null, 2));
    let currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.green.bold('INFO ') + chalk.green.bold(`[`) + chalk.white.bold(`${currentTime}`) + chalk.green.bold(`]: `) + chalk.cyan('Data saved to mutasi_biwa.json'));
  } catch (error) {
    console.error(chalk.red('Error fetching or saving data:', error));
  }
}

async function fetch_roy() {
  try {
    let anu = await axios.get('https://gateway.okeconnect.com/api/mutasi/qris/OK1666484/863463217401195201666484OKCT0C35E392D85B6D4587E5D4153963E8B7');
    let res = anu.data;
    fs.writeFileSync('mutasi_roy.json', JSON.stringify(res, null, 2));
    let currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.green.bold('INFO ') + chalk.green.bold(`[`) + chalk.white.bold(`${currentTime}`) + chalk.green.bold(`]: `) + chalk.cyan('Data saved to mutasi_roy.json'));
  } catch (error) {
    console.error(chalk.red('Error fetching or saving data:', error));
  }
}

// Fungsi utama untuk menjalankan fetch(), fetch_biwa(), dan fetch_roy() bergantian
async function run() {
  await fetch(); // Jalankan fetch()
  console.log(chalk.yellow('Waiting for 6 seconds before running fetch_biwa...'));
  
  setTimeout(async () => {
    await fetch_biwa(); // Jalankan fetch_biwa() setelah 6 detik
    console.log(chalk.yellow('Waiting for 6 seconds before running fetch_roy...'));

    setTimeout(async () => {
      await fetch_roy(); // Jalankan fetch_roy() setelah 6 detik
      console.log(chalk.yellow('Waiting for 6 seconds before running fetch() again...'));
      
      setTimeout(run, 6000); // Rekursi untuk kembali menjalankan fetch() setelah 6 detik
    }, 6000);

  }, 6000);
}

// Jalankan proses
run();

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

app.get('/mutasi_biwa.json', (req, res) => {
  res.sendFile(process.cwd() + '/mutasi_biwa.json');
});

app.get('/mutasi_roy.json', (req, res) => {
  res.sendFile(process.cwd() + '/mutasi_roy.json');
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
