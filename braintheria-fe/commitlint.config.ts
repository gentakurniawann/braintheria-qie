module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Panjang header maksimal 250 karakter
    "header-max-length": [2, "always", 250],

    // Pastikan tipe dalam huruf kecil, tidak kosong dan sesuai dengan tipe yang diizinkan
    "type-enum": [
      2,
      "always",
      [
        // Tipe utama
        "feat", // Fitur baru
        "fix", // Perbaikan bug
        "docs", // Perubahan dokumentasi
        "style", // Perubahan formatting, tidak mempengaruhi logic
        "refactor", // Refaktoring kode
        "test", // Menambah/memperbaiki tes
        "chore", // Pemeliharaan, perubahan build, dll

        // Tipe tambahan yang spesifik
        "perf", // Peningkatan performa
        "ci", // Perubahan konfigurasi CI
        "build", // Perubahan sistem build
        "revert", // Membatalkan commit sebelumnya
      ],
    ], // Tipe commit yang diizinkan (disesuaikan dengan conventional commits)
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],

    // Pastikan scope dalam huruf kecil dan tidak kosong
    "scope-case": [2, "always", "lower-case"],
    "scope-empty": [2, "never"],

    // Pastikan subject tidak kosong, dan minimal 10 karakter
    "subject-min-length": [2, "always", 10],
    "subject-empty": [2, "never"],
  },
};
