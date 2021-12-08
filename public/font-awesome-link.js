// Append Link to all HTML
// Biar gak capek copy paste tiap kali buat HTML baru

const headContent = document.getElementsByTagName("head")[0];
let font_link = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">`;
headContent.insertAdjacentHTML("beforeend", font_link);
