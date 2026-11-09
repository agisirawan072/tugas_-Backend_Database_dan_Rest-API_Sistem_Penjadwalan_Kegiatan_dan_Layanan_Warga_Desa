const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint Cek Server
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server REST API SiDesa berjalan dengan baik!',
  });
});

// 1. Metode GET: Dapatkan semua data kegiatan desa
app.get('/api/kegiatan', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kegiatan_desa ORDER BY id ASC');
    res.status(200).json({
      status: 'success',
      message: 'Berhasil mendapatkan semua data kegiatan desa',
      total: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data dari database',
      error: err.message,
    });
  }
});

// 2. Metode GET: Dapatkan data berdasarkan ID pada parameter URL
app.get('/api/kegiatan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM kegiatan_desa WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Data kegiatan desa dengan ID ${id} tidak ditemukan`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Berhasil mendapatkan data kegiatan desa dengan ID ${id}`,
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil detail data',
      error: err.message,
    });
  }
});

// 3. Metode POST: Membuat data baru disimpan ke Database
app.post('/api/kegiatan', async (req, res) => {
  try {
    const {
      nama_kegiatan,
      jenis_kegiatan,
      lokasi,
      tanggal_pelaksanaan,
      kuota_peserta,
      keterangan,
    } = req.body;

    if (!nama_kegiatan || !jenis_kegiatan || !lokasi || !tanggal_pelaksanaan || !kuota_peserta) {
      return res.status(400).json({
        status: 'fail',
        message: 'Mohon lengkapi semua field wajib (nama_kegiatan, jenis_kegiatan, lokasi, tanggal_pelaksanaan, kuota_peserta)',
      });
    }

    const query = `
      INSERT INTO kegiatan_desa 
      (nama_kegiatan, jenis_kegiatan, lokasi, tanggal_pelaksanaan, kuota_peserta, keterangan) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    const values = [
      nama_kegiatan,
      jenis_kegiatan,
      lokasi,
      tanggal_pelaksanaan,
      kuota_peserta,
      keterangan || '',
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      status: 'success',
      message: 'Berhasil menambahkan data kegiatan desa baru ke database',
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal menyimpan data baru ke database',
      error: err.message,
    });
  }
});

// 4. Metode PUT: Memperbarui data berdasarkan ID
app.put('/api/kegiatan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_kegiatan,
      jenis_kegiatan,
      lokasi,
      tanggal_pelaksanaan,
      kuota_peserta,
      keterangan,
    } = req.body;

    const query = `
      UPDATE kegiatan_desa 
      SET nama_kegiatan = $1, 
          jenis_kegiatan = $2, 
          lokasi = $3, 
          tanggal_pelaksanaan = $4, 
          kuota_peserta = $5, 
          keterangan = $6
      WHERE id = $7 
      RETURNING *
    `;
    const values = [
      nama_kegiatan,
      jenis_kegiatan,
      lokasi,
      tanggal_pelaksanaan,
      kuota_peserta,
      keterangan,
      id,
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Data kegiatan desa dengan ID ${id} tidak ditemukan untuk diperbarui`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Data kegiatan desa dengan ID ${id} berhasil diperbarui`,
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui data di database',
      error: err.message,
    });
  }
});

// 5. Metode DELETE: Menghapus data berdasarkan ID
app.delete('/api/kegiatan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM kegiatan_desa WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Data kegiatan desa dengan ID ${id} tidak ditemukan untuk dihapus`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Data kegiatan desa dengan ID ${id} berhasil dihapus dari database`,
      deleted_data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus data dari database',
      error: err.message,
    });
  }
});

// Menjalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});