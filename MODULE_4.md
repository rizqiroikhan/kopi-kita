# MODULE_4.md — Kopi Kita Integration Checkpoint

## Objective

Satukan frontend dan backend Kopi Kita menjadi **1 aplikasi Next.js end-to-end** dengan Express API berjalan di dalam Next.js, menggunakan database Postgres yang sama, tanpa mock data, tanpa CORS, dan hanya **1 dev server**.

Checkpoint dianggap selesai hanya jika seluruh flow berikut bekerja:

**Database → API → Public UI → Booking → CMS → Status Update**

---


## CURRENT GAP — MUST BE CLOSED

Current repository state is **NOT Module 4 complete**.

Known remaining work:

- [ ] Refactor Express routes into Next.js so only **one Next.js dev server** is required.
- [ ] Remove the separate runtime dependency on Express port `4000`.
- [ ] Change all frontend API requests to relative same-origin paths such as `/api/products` and `/api/bookings`.
- [ ] Replace `/menu` mock data with database-backed products.
- [ ] Add `/menu` loading state.
- [ ] Add `/menu` friendly recoverable error state + **Try Again**.
- [ ] Connect `/booking` form to the real backend.
- [ ] Ensure `/admin/bookings` shows newly submitted bookings.
- [ ] Ensure booking status can be updated from the CMS, including `pending -> confirmed`.
- [ ] Verify the malicious `party_size: 999` curl request returns HTTP `400`.
- [ ] Verify invalid curl data is not persisted.
- [ ] Capture the required E2E screenshots/video/GIF.
- [ ] Capture terminal proof showing one Next.js dev server and `docker compose ps`.
- [ ] Create the required refactor commit.
- [ ] Push the refactor commit so it is visible on GitHub.

### Hard gate

The project **must not be reported as complete** while any item above remains unresolved.

The current two-server architecture:

```text
Next.js :3000
Express :4000
```

is explicitly a **failing state** for this checkpoint.

The required final runtime architecture is:

```text
Next.js :3000
  ├─ frontend
  ├─ admin CMS
  └─ /api/* -> embedded Express handler

Postgres -> Docker Compose
```

There must be no separately running Express application server after the refactor.


## Required Final State

### Architecture
- Hanya **1 dev server**: `npm run dev` pada Next.js.
- Express **tidak lagi** `listen()` di port 4000.
- Kode backend dipindahkan ke folder `server/` di project Next.js.
- Semua `/api/*` diteruskan melalui:
  - `app/api/[...slug]/route.ts`
- Semua request frontend memakai **relative path**:
  - `/api/products`
  - `/api/bookings`
  - dst.
- CORS middleware dihapus karena frontend dan API sudah same-origin.
- Database Postgres tetap berjalan via Docker Compose.

### Menu
- `/menu` mengambil produk dari database melalui `GET /api/products`.
- Tidak ada mock data yang dipakai oleh menu.
- Filter category tetap berfungsi.
- Produk `available: false` tetap tampil dengan badge **Sold Out**.
- Ada loading state berupa **8 skeleton cards**.
- Jika API/database gagal:
  - tampil pesan ramah: `The menu can't be loaded right now`
  - tersedia tombol **Try Again**
  - tidak blank page / raw red error.

### Booking
- `/booking` submit ke `POST /api/bookings`.
- Saat submit:
  - tombol disabled
  - teks menjadi `Sending...`
- Success:
  - tampil confirmation card
  - menggunakan response API asli
  - termasuk booking ID.
- HTTP 400:
  - tampilkan pesan validasi dari server.
- Network failure:
  - tampilkan `Connection problem, please try again`.

### CMS
- `/admin/login` tetap berfungsi.
- `/admin/products`:
  - edit nama/harga produk berhasil
  - perubahan langsung terlihat di `/menu`.
- `/admin/bookings`:
  - booking baru muncul dengan status `pending`
  - status dapat diubah menjadi `confirmed`.
- Halaman admin tetap protected:
  - user incognito/tidak login harus diarahkan ke login.

### Server-side Validation
Validasi harus tetap berada di server.

Scenario wajib:

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Nakal","whatsapp":"08123","booking_date":"2020-01-01","booking_time":"19:00","party_size":999}'
```

Expected:
- HTTP **400**
- data tidak masuk database.

---

## Integration Refactor

Target struktur:

```text
Next.js app
├─ app/
│  └─ api/
│     └─ [...slug]/
│        └─ route.ts
├─ server/
│  ├─ app
│  ├─ routes
│  ├─ db
│  ├─ auth
│  └─ middleware
├─ lib/
│  └─ api.ts
└─ ...
```

`server/app` harus mengekspor Express app tanpa memanggil `listen()`.

Catch-all route harus:
- menerima `NextRequest`
- meneruskan method, URL, headers, dan body ke Express
- mengubah Express response kembali menjadi Web `Response`
- mendukung GET/POST/PUT/PATCH/DELETE
- memastikan status **204/205/304 tidak mengirim body**.

API helper harus menghasilkan same-origin request. Base URL publik tidak boleh lagi menunjuk ke `localhost:4000`.

---

## Demo Data

Pastikan demo data layak ditampilkan:
- 10 produk Kopi Kita yang realistis
- harga sekitar 15.000–35.000
- kategori seimbang
- deskripsi masuk akal
- 5 sample bookings dengan tanggal/status bervariasi

Sediakan:

```bash
npm run db:reset
```

untuk menjalankan ulang schema + seed terhadap database Docker.

Jangan reset database jika implementasi existing sudah valid dan reset tidak dibutuhkan untuk QA.

---

## Mandatory QA / QC

Lakukan pemeriksaan secara scoped dan berurutan. Jangan melakukan perubahan luas jika tidak diperlukan.

### Core integration
1. `npm run dev`
2. Pastikan tidak ada server Express terpisah.
3. `/menu` menampilkan produk database.
4. Edit produk di CMS.
5. Refresh `/menu`.
6. Pastikan perubahan CMS terlihat.
7. Submit booking valid.
8. Pastikan confirmation card + booking ID tampil.
9. Buka `/admin/bookings`.
10. Pastikan booking muncul sebagai `pending`.
11. Ubah menjadi `confirmed`.
12. Pastikan perubahan berhasil.

### Toughness tests
- Past date via booking form → rejected.
- `party_size: 999` via curl → HTTP 400.
- `/admin/products` incognito → redirect/login protection.
- Database down:
  - `docker compose down`
  - `/menu` menampilkan friendly error
  - `docker compose up -d`
  - **Try Again** memulihkan menu.

### Static / build checks
Jalankan yang tersedia dan relevan:
- lint
- typecheck
- tests
- build

Jangan mengarang script. Inspect `package.json` terlebih dahulu.

### Regression guard
Pastikan:
- auth/session masih bekerja
- cookies/session same-origin tidak rusak
- database connection tetap stabil
- product edit tidak merusak menu
- booking status update tidak merusak booking flow
- tidak ada referensi runtime ke port 4000
- tidak ada menu mock-data path yang masih aktif
- tidak ada request frontend ke absolute API URL.

Jika satu test gagal:
1. identifikasi root cause
2. fix sekecil mungkin
3. retest test yang gagal
4. retest area terkait yang berpotensi regression.

---

## Submission Evidence

Siapkan maksimum **6 screenshot** atau video/GIF pendek yang membuktikan urutan berikut:

1. `/menu` menampilkan produk dari database.
2. Edit nama/harga produk di CMS.
3. Perubahan tersebut terlihat di `/menu`.
4. `/booking` berhasil submit.
5. Booking terlihat di `/admin/bookings`.
6. Status booking berubah menjadi `confirmed`.

Tambahan screenshot wajib:

### Terminal
Harus menunjukkan:
- hanya **1 Next.js dev server**
- output:

```bash
docker compose ps
```

dan Postgres berjalan/healthy.

### Curl
Screenshot command + response untuk booking `party_size: 999` dan harus menunjukkan **HTTP 400**.

---

## Passing Criteria

Semua harus benar:

- [ ] Menu tidak lagi memakai mock data.
- [ ] Semua API request frontend memakai relative `/api/...`.
- [ ] Express sudah berjalan di dalam Next.js.
- [ ] Hanya satu dev server.
- [ ] CORS tidak lagi diperlukan.
- [ ] Server-side validation terbukti melalui curl.
- [ ] Booking flow berjalan end-to-end sampai CMS.
- [ ] Product CMS update terlihat di public menu.
- [ ] Menu memiliki loading state.
- [ ] Menu memiliki recoverable error state.
- [ ] Admin auth/protection tetap bekerja.
- [ ] Database recovery test berhasil.
- [ ] Lint/typecheck/tests/build yang tersedia lulus atau setiap exception dijelaskan.
- [ ] Evidence submission lengkap.
- [ ] Required refactor commit dibuat dengan pesan yang tepat.
- [ ] Refactor commit berhasil di-push dan terlihat di GitHub.
- [ ] Working tree bersih setelah commit/push.

---

## Required Commit

Setelah seluruh acceptance criteria dan QA di atas lulus, buat commit:

```text
refactor: merge express api into next.js
```

Commit ini **wajib terlihat di GitHub** untuk submission checkpoint.

Setelah commit dibuat:
1. verify commit secara lokal dengan `git log -1 --oneline`
2. push branch yang benar ke remote GitHub
3. verify remote tracking state / push success
4. bila tersedia akses web/CLI yang sesuai, pastikan commit tersebut benar-benar visible di repository GitHub

Jika push membutuhkan approval/network permission, itu adalah satu-satunya titik yang boleh menghentikan automation. Jangan menyebut Module 4 selesai sebelum push berhasil.

Jika sebelumnya perlu commit terpisah untuk tahap koneksi frontend ke API, pesan yang sesuai dari modul adalah:

```text
feat: connect frontend to the real api
```

Namun checkpoint akhir tetap harus memiliki commit:

```text
refactor: merge express api into next.js
```

Jangan commit sebelum QA utama lulus.

---

## Definition of Done

Module 4 selesai hanya jika:

> Satu Next.js app menjalankan public frontend, CMS, Express API, auth/session, dan database-backed flows; menu dan booking menggunakan data nyata; server validation tetap aktif; seluruh critical E2E flow terbukti; QA lulus; evidence siap; dan commit `refactor: merge express api into next.js` sudah dibuat **serta berhasil di-push sehingga terlihat di GitHub**.


## Autonomous Execution Contract

Codex should execute this module end-to-end, not merely propose changes.

Required behavior:

1. **Inspect before editing**
   - determine actual repository structure and current implementation
   - verify which items are already done versus still missing
   - preserve working behavior

2. **Implement every unresolved gap**
   - do not stop after the Express/Next refactor
   - continue through menu, booking, CMS, validation, recovery states, evidence, git, and push

3. **Run strict QA**
   - success criteria must be demonstrated, not inferred
   - use real database-backed flows
   - never replace failed behavior with mocks to obtain a passing result

4. **Repair failures automatically**
   - diagnose root cause
   - make the smallest safe fix
   - rerun the failing test
   - rerun targeted regression tests

5. **Produce proof**
   - capture or prepare actual checkpoint evidence
   - command output alone is not a substitute for UI proof where the checkpoint explicitly requires screenshots/video/GIF

6. **Commit only after core QA passes**
   - required commit message:
     `refactor: merge express api into next.js`

7. **Push**
   - push the correct branch to the existing GitHub remote
   - do not force-push
   - do not rewrite unrelated history
   - if approval is required for network access, request only that approval and then continue

8. **Final report must be factual**
   - distinguish PASS, FAIL, and BLOCKED
   - include commit hash
   - include push result
   - include remaining blockers, if any
   - never claim completion based only on code inspection

