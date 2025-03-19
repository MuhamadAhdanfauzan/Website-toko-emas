document.addEventListener("DOMContentLoaded", function () {
    const fetchURL = "getProducts.php";
    const productContainer = document.getElementById("menu-dish");
    const filters = document.querySelectorAll(".filters .filter");
    let currentFilter = "";

    // Fungsi untuk memuat produk
    function loadProducts(filterCategory = "") {
        fetch(fetchURL)
            .then((response) => response.json())
            .then((products) => {
                productContainer.innerHTML = ""; // Kosongkan kontainer produk sebelum ditambahkan produk baru

                products.forEach((product) => {
                    const formattedPrice = product.price
                        ? new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(product.price)
                        : 'Harga Tidak Tersedia';

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
                                        <button class="dish-add-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-quantity="1">
                                            <i class="uil uil-plus"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
                    productContainer.innerHTML += productCard;
                });

                applyFilter(filterCategory);
            })
            .catch((error) => console.error("Error fetching products:", error));
    }

    function applyFilter(filterCategory) {
        const allProducts = document.querySelectorAll(".dish-box-wp");
        allProducts.forEach((product) => {
            const productCategory = product.getAttribute("data-cat");
            if (filterCategory === "" || filterCategory === "semua" || productCategory.includes(filterCategory)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    }

    filters.forEach((filter) => {
        filter.addEventListener("click", function () {
            const selectedCategory = filter.getAttribute("data-filter");

            filters.forEach((f) => f.classList.remove("active"));
            filter.classList.add("active");

            currentFilter = selectedCategory; // Simpan kategori yang sedang dipilih
            loadProducts(selectedCategory);
        });
    });

    // Event listener untuk menambahkan produk ke keranjang
    document.addEventListener('click', function (e) {
        // Cek apakah elemen yang diklik adalah tombol atau ikon
        const button = e.target.closest('.dish-add-btn'); // Mencari elemen terdekat dengan kelas 'dish-add-btn'
    
        if (button) {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productPrice = button.getAttribute('data-price');
            const productQuantity = button.getAttribute('data-quantity');
    
            addToCart(productId, productName, productPrice, productQuantity);
        }
    });
    
    function addToCart(productId, productName, productPrice, productQuantity) {
        const data = {
            id: productId,
            name: productName,
            price: productPrice,
            quantity: productQuantity
        };

        fetch('cart/addToCart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Produk berhasil ditambahkan ke keranjang!');
            } else {
                alert('Gagal menambahkan produk ke keranjang.');
            }
        })
        .catch(error => console.error('Error adding to cart:', error));
    }

    loadProducts(); // Panggil sekali untuk pertama kali memuat produk

    // SetInterval untuk memuat data setiap 5 detik
    setInterval(() => {
        loadProducts(currentFilter); // Memuat ulang produk sesuai kategori yang dipilih
    }, 5000); // Ganti 5000 dengan interval waktu (dalam milidetik) sesuai kebutuhan
    
});
