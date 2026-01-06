function showPage(pageId) {
  const sections = document.querySelectorAll("main section");
  const buttons = document.querySelectorAll("nav button");

  sections.forEach((section) => {
    section.classList.remove("active");
  });

  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  const activeButton = Array.from(buttons).find((btn) =>
    btn.textContent.toLowerCase().includes(pageId)
  );

  if (activeButton) {
    activeButton.classList.add("active");
  }
}
// Fungsi untuk mengaktifkan/menonaktifkan input Jumlah Emas berdasarkan checkbox
        function toggleEmasInput(isChecked) {
            const emasInput = document.getElementById('jumlahEmas');
            const hasilLogika = document.getElementById('hasilLogika');
            const argumenLogisSection = document.getElementById('argumenLogisSection');
            
            if (isChecked) {
                // Jika diceklis, aktifkan input dan hapus kelas disabled
                emasInput.disabled = false;
                emasInput.classList.remove('bg-gray-100', 'opacity-75');
                // Atur kembali nilai input menjadi kosong agar pengguna bisa mengisi
                if (emasInput.value === '0') {
                    emasInput.value = '';
                }
            } else {
                // Jika tidak diceklis, nonaktifkan, set nilai ke 0, dan tambahkan gaya disabled
                emasInput.disabled = true;
                emasInput.value = 0; // Nilai Logika 0 jika tidak memiliki/tidak dicek
                emasInput.classList.add('bg-gray-100', 'opacity-75');
                
                // Hapus hasil perhitungan sebelumnya
                hasilLogika.innerHTML = '<p class="text-gray-500 italic">Masukkan nilai dan klik tombol di atas.</p>';
                argumenLogisSection.innerHTML = '';
            }
        }

        // Fungsi utama untuk melakukan perhitungan logika zakat
        function cekKewajibanZakat() {
            // Ambil nilai input dan pastikan diubah ke tipe Number
            const emasInput = document.getElementById('jumlahEmas').value;
            const haulInput = document.getElementById('lamaKepemilikan').value;
            
            // Menggunakan parseFloat untuk mengakomodasi input desimal
            const jumlahEmas = parseFloat(emasInput);
            const lamaKepemilikan = parseFloat(haulInput);

            // Ambil elemen untuk menampilkan hasil dan argumen
            const hasilLogika = document.getElementById('hasilLogika');
            const argumenLogisSection = document.getElementById('argumenLogisSection');
            
            // Aturan Nishab Emas: minimal 85 gram
            const nishabEmas = 85; 
            // Aturan Haul (Lama Kepemilikan): minimal 1 tahun
            const nishabHaul = 1;

            // Variabel untuk argumen logis
            let argumenLogis = "";
            let isEmasNishab = jumlahEmas >= nishabEmas;
            let isHaulNishab = lamaKepemilikan >= nishabHaul;

            // Pastikan input adalah angka yang valid dan tidak kosong
            if (isNaN(lamaKepemilikan) || haulInput.trim() === "") {
                hasilLogika.innerHTML = `<div class="p-4 rounded-lg bg-red-100 text-red-800 font-semibold shadow-md">
                                            Mohon masukkan nilai angka yang valid untuk Lama Kepemilikan (Haul).
                                        </div>`;
                argumenLogisSection.innerHTML = '';
                return;
            }
            if (isNaN(jumlahEmas)) {
                 hasilLogika.innerHTML = `<div class="p-4 rounded-lg bg-red-100 text-red-800 font-semibold shadow-md">
                                            Mohon masukkan nilai angka yang valid untuk Jumlah Emas.
                                        </div>`;
                argumenLogisSection.innerHTML = '';
                return;
            }
            

            // Implementasi Logika Dasar: Wajib Zakat jika (P AND Q)
            const wajibZakat = isEmasNishab && isHaulNishab;

            if (wajibZakat) {
                // P AND Q (True)
                hasilLogika.innerHTML = `<div class="p-4 rounded-lg bg-green-100 text-green-800 font-bold text-xl shadow-lg border-2 border-green-600">
                                            ✅ Wajib Zakat Emas!
                                            <p class="text-base font-normal mt-1">Nishab (${nishabEmas}g) dan Haul (${nishabHaul} tahun) terpenuhi.</p>
                                        </div>`;
                
                argumenLogis = `**Saat ini Anda diwajibkan untuk mengeluarkan zakat** (Benar / True). Argumen logisnya adalah: Anda mempunyai simpanan ${jumlahEmas} gram emas (melebihi Nishab ${nishabEmas}g) **DAN** masa kepemilikan sudah ${lamaKepemilikan} tahun (melebihi Haul ${nishabHaul} tahun). Karena kedua kondisi (P $\wedge$ Q) bernilai Benar, maka kewajiban zakat berlaku.`;

            } else {
                // P AND Q (False)
                let alasan = [];
                let kondisi = [];

                if (!isEmasNishab) {
                    alasan.push(`Jumlah Emas (${jumlahEmas}g) di bawah Nishab (${nishabEmas}g).`);
                    kondisi.push(`Emas (${jumlahEmas}g) $\le$ Nishab (${nishabEmas}g) bernilai Salah (False)`);
                } else {
                    alasan.push(`Jumlah Emas (${jumlahEmas}g) telah mencapai Nishab.`);
                    kondisi.push(`Emas (${jumlahEmas}g) $\ge$ Nishab (${nishabEmas}g) bernilai Benar (True)`);
                }

                if (!isHaulNishab) {
                    alasan.push(`Lama Kepemilikan (${lamaKepemilikan} tahun) di bawah Haul (${nishabHaul} tahun).`);
                    kondisi.push(`Haul (${lamaKepemilikan} tahun) $\ge$ Nishab (${nishabHaul} tahun) bernilai Salah (False)`);
                } else {
                     alasan.push(`Lama Kepemilikan (${lamaKepemilikan} tahun) telah mencapai Haul.`);
                     kondisi.push(`Haul (${lamaKepemilikan} tahun) $\ge$ Nishab (${nishabHaul} tahun) bernilai Benar (True)`);
                }


                hasilLogika.innerHTML = `<div class="p-4 rounded-lg bg-yellow-100 text-yellow-800 font-bold text-xl shadow-lg border-2 border-yellow-600">
                                            ❌ Tidak Wajib Zakat.
                                            <p class="text-base font-normal mt-1">${alasan.filter(a => a.includes('di bawah')).join(' ')}</p>
                                        </div>`;

                argumenLogis = `**Saat ini Anda belum diwajibkan untuk mengeluarkan zakat** (Salah / False). Argumen logisnya adalah: Meskipun (${kondisi.join(' dan ')}), hasil operasi **Konjungsi (P $\wedge$ Q)** bernilai Salah (False) karena tidak semua kondisi prasyarat (Nishab dan Haul) terpenuhi secara bersamaan.`;
            }
            
            // Tampilkan Argumen Logis
            argumenLogisSection.innerHTML = `
                <h2 class="text-xl font-bold text-gray-800 mb-3">Argumen Logis (Berdasarkan Input)</h2>
                <p class="text-base text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg border border-indigo-200 shadow-sm">
                    ${argumenLogis}
                </p>
            `;
        }
