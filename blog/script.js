document.addEventListener("DOMContentLoaded", function () {
    const fetchURL = "getProducts.php";
    const productContainer = document.getElementById("menu-dish");
    const filters = document.querySelectorAll(".filters .filter"); // Mendapatkan semua elemen filter
    let currentFilter = ""; // Variabel untuk menyimpan kategori yang sedang dipilih

    // Fungsi untuk memuat produk
    function loadProducts(filterCategory = "") {
        fetch(fetchURL)
            .then((response) => response.json()) // Mengambil data produk dalam format JSON
            .then((products) => {
                productContainer.innerHTML = ""; // Kosongkan kontainer produk sebelum ditambahkan produk baru

                products.forEach((product) => {
                    const formattedPrice = product.price 
                        ? new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(product.price) 
                        : 'Harga Tidak Tersedia';

                    // Membuat card produk untuk ditambahkan ke DOM
                    const productCard = `
                    <div class="col-lg-4 col-sm-6 dish-box-wp" data-cat="${product.category}">
                        <div class="dish-box text-center">
                            <div class="dist-img">
                                <img src="http://localhost/toko_emas_v6/admin/uploads/${product.image}" width="250" alt="${product.name}" onError="this.onerror=null;this.src='http://localhost/toko_emas_v6/admin/uploads/default.jpg';">
                            </div>
                            <div class="dish-rating">
                                ${product.rating}
                                <i class="uil uil-star"></i>
                            </div>
                            <div class="dish-title">
                                <h3 class="h3-title">${product.name}</h3>
                                <p>${product.weight} Grm (${product.type})</p>
                            </div>
                            <div class="dish-info">
                                <ul>
                                    <li>
                                        <p>Tipe</p>
                                        <b>${product.type}</b>
                                    </li>
                                    <li>
                                        <p>Jumlah</p>
                                        <b>${product.quantity}</b>
                                    </li>
                                </ul>
                            </div>
                            <div class="dist-bottom-row">
                                <ul>
                                    <li>
                                        <b>IDR ${formattedPrice}</b>
                                    </li>
                                    <li>
                                        <button class="dish-add-btn">
                                            <i class="uil uil-plus"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;

                    // Menambahkan produk card ke container
                    productContainer.innerHTML += productCard;
                });

                // Filter produk berdasarkan kategori
                applyFilter(filterCategory);
            })
            .catch((error) => console.error("Error fetching products:", error));
    }

    // Fungsi untuk menerapkan filter
    function applyFilter(filterCategory) {
        const allProducts = document.querySelectorAll(".dish-box-wp");
        allProducts.forEach((product) => {
            const productCategory = product.getAttribute("data-cat"); // Ambil kategori dari atribut
            if (filterCategory === "" || filterCategory === "semua" || productCategory.includes(filterCategory)) {
                product.style.display = "block"; // Tampilkan produk jika sesuai
            } else {
                product.style.display = "none"; // Sembunyikan produk jika tidak sesuai
            }
        });
    }

    // Menambahkan event listener untuk setiap filter
    filters.forEach((filter) => {
        filter.addEventListener("click", function () {
            // Ambil kategori yang dipilih dari data-filter
            const selectedCategory = filter.getAttribute("data-filter");

            // Atur kategori aktif
            filters.forEach((f) => f.classList.remove("active"));
            filter.classList.add("active");

            // Panggil fungsi untuk memuat produk dengan filter yang dipilih
            loadProducts(selectedCategory);
        });
    });

    // Panggil fungsi untuk memuat produk pertama kali tanpa filter
    loadProducts();
});
