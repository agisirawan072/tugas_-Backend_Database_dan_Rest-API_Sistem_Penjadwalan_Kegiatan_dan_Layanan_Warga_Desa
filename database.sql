-- 1. Tabel Dusun (Master Wilayah)
CREATE TABLE dusun (
  id SERIAL PRIMARY KEY,
  nama_dusun VARCHAR(100) NOT NULL,
  kepala_dusun VARCHAR(100) NOT NULL
);

-- 2. Tabel Warga (Relasi One-to-Many dari tabel dusun: 1 dusun punya banyak warga)
CREATE TABLE warga (
  id SERIAL PRIMARY KEY,
  dusun_id INT NOT NULL REFERENCES dusun(id) ON DELETE CASCADE,
  nik VARCHAR(16) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(150) NOT NULL,
  no_hp VARCHAR(20),
  alamat TEXT
);

-- 3. Tabel Akun Warga (Relasi One-to-One dengan tabel warga: kolom warga_id diberi UNIQUE)
CREATE TABLE akun_warga (
  id SERIAL PRIMARY KEY,
  warga_id INT UNIQUE NOT NULL REFERENCES warga(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'warga',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Pengaduan Warga (Relasi One-to-Many dari tabel warga: 1 warga bisa buat banyak laporan)
CREATE TABLE pengaduan_warga (
  id SERIAL PRIMARY KEY,
  warga_id INT NOT NULL REFERENCES warga(id) ON DELETE CASCADE,
  judul_laporan VARCHAR(150) NOT NULL,
  isi_laporan TEXT NOT NULL,
  status_laporan VARCHAR(30) DEFAULT 'Menunggu',
  tanggal_lapor DATE DEFAULT CURRENT_DATE
);

-- 5. Tabel Kegiatan Desa (Tabel Utama untuk REST API CRUD: Siskamling & Kerja Bakti)
CREATE TABLE kegiatan_desa (
  id SERIAL PRIMARY KEY,
  nama_kegiatan VARCHAR(150) NOT NULL,
  jenis_kegiatan VARCHAR(50) NOT NULL,
  lokasi VARCHAR(150) NOT NULL,
  tanggal_pelaksanaan DATE NOT NULL,
  kuota_peserta INT NOT NULL,
  keterangan TEXT
);

-- 6. Tabel Partisipasi Kegiatan (Relasi Many-to-Many antara warga dan kegiatan_desa)
CREATE TABLE partisipasi_kegiatan (
  id SERIAL PRIMARY KEY,
  warga_id INT NOT NULL REFERENCES warga(id) ON DELETE CASCADE,
  kegiatan_id INT NOT NULL REFERENCES kegiatan_desa(id) ON DELETE CASCADE,
  peran VARCHAR(50) DEFAULT 'Peserta',
  status_kehadiran VARCHAR(30) DEFAULT 'Hadir'  
);

-- 7. Tabel Logistik Kegiatan (Relasi One-to-Many dari kegiatan_desa: 1 kegiatan butuh banyak alat)
CREATE TABLE logistik_kegiatan (
  id SERIAL PRIMARY KEY,
  kegiatan_id INT NOT NULL REFERENCES kegiatan_desa(id) ON DELETE CASCADE,
  nama_alat VARCHAR(100) NOT NULL,
  jumlah INT NOT NULL,
  kondisi VARCHAR(50) DEFAULT 'Baik'
);