# Hill dan prioritas

## Hill

**Who:** pekerja kantor dengan pesanan kopi rutin sebelum mulai bekerja dan waktu masuk yang dekat; **bukan** pelanggan yang duduk santai di kedai, membuat pesanan yang belum pernah dicoba, atau datang tanpa tekanan waktu.

**What:** dapat memastikan kopi rutinnya siap diambil dalam perjalanan ke kantor tanpa ketidakpastian antrean dan waktu tunggu.

**Wow:** setidaknya 80% pesanan rutin yang valid pada jam pagi dapat diambil dalam **dua menit atau kurang** sejak pelanggan tiba di kedai, diukur dari kedatangan hingga pengambilan selama periode evaluasi yang disepakati.

## Pemeriksaan Hill

| Pemeriksaan | Hasil |
| --- | --- |
| Who cukup sempit | Ya; mencerminkan pola Narasumber B, bukan seluruh pengunjung. |
| What menjawab pain point as-is | Ya; menjawab antrean dan ketidakpastian waktu tunggu [B]. |
| Wow terukur | Ya; 80% dan ≤2 menit dapat diuji. |
| Bebas nama fitur/teknologi | Ya; tidak menyebut aplikasi, kanal pesan, atau bentuk solusi. |

## Grid prioritas

| Ide yang dipertimbangkan | Dampak pengguna | Upaya pada stack saat ini | Keputusan dan alasan |
| --- | --- | --- | --- |
| Alur pesanan takeaway terjadwal untuk menu tersedia, waktu ambil, dan status penerimaan | Tinggi — menjawab antrean/ketidakpastian [B] | Sedang — memerlukan data pesanan, API, halaman pelanggan, dan admin | **Kerjakan berikutnya.** Versi awal paling langsung untuk menguji Hill. |
| Pembaruan status pesanan melalui WhatsApp | Tinggi — dapat mengurangi ketidakpastian [B] | Tinggi — integrasi pihak ketiga, izin, dan kegagalan pengiriman | **Tidak sekarang.** Tidak perlu untuk menguji alur awal. |
| Program loyalitas | Rendah — tidak ada bukti dari A/B/C | Sedang | **Drop.** Tidak menjawab pain point as-is. |
| Informasi antrean langsung untuk semua pengunjung | Tidak pasti — A/C mengecek antrean, tetapi belum ada kebutuhan akan data waktu nyata | Tinggi — membutuhkan operasional dan data real-time | **Riset lebih lanjut.** Jangan dibangun tanpa bukti dan sumber data yang andal. |
