/* =========================================================
   NOVASTORE
   MAIN JAVASCRIPT
   =========================================================

   PART 1
   - Configuration
   - Product Data
   - Application State
   - DOM References

   Future updates ke liye:
   - Products -> PRODUCT DATA section
   - Cart settings -> CONFIG section
   - HTML elements -> DOM section
========================================================= */


/* =========================================================
   01. CONFIGURATION
========================================================= */

const CONFIG = {

    /* Currency used throughout the store */
    currency: "₹",

    /* Free delivery after this amount */
    freeShippingLimit: 999,

    /* Delivery charge below free-shipping limit */
    shippingCharge: 79,

    /* Discount starts from this cart value */
    discountThreshold: 3000,

    /* Demo automatic discount percentage */
    discountPercent: 5,

    /* LocalStorage keys */
    storageKeys: {

        cart: "novastore_cart",

        wishlist: "novastore_wishlist",

        theme: "novastore_theme"

    }

};


/* =========================================================
   02. PRODUCT DATA
   ---------------------------------------------------------
   IMPORTANT:

   Future mein product add/edit karna ho to
   SIRF is section ko edit karna.

   Example:

   {
       id: 9,
       name: "New Product",
       category: "electronics",
       price: 1999,
       oldPrice: 2499,
       rating: 4.8,
       reviews: 50,
       discount: 20,
       image: "IMAGE_URL"
   }
========================================================= */

const products = [

    {
        id: 1,

        name: "Wireless Headphones",

        category: "electronics",

        price: 2499,

        oldPrice: 3499,

        rating: 4.8,

        reviews: 124,

        discount: 29,

        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85"
    },


    {
        id: 2,

        name: "Premium Sneakers",

        category: "shoes",

        price: 3299,

        oldPrice: 4499,

        rating: 4.9,

        reviews: 89,

        discount: 27,

        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
    },


    {
        id: 3,

        name: "Classic Watch",

        category: "accessories",

        price: 4599,

        oldPrice: 5999,

        rating: 4.7,

        reviews: 76,

        discount: 23,

        image:
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85"
    },


    {
        id: 4,

        name: "Minimal Hoodie",

        category: "fashion",

        price: 1899,

        oldPrice: 2699,

        rating: 4.8,

        reviews: 143,

        discount: 30,

        image:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85"
    },


    {
        id: 5,

        name: "Smart Watch",

        category: "electronics",

        price: 5999,

        oldPrice: 7499,

        rating: 4.6,

        reviews: 67,

        discount: 20,

        image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85"
    },


    {
        id: 6,

        name: "Urban Jacket",

        category: "fashion",

        price: 2799,

        oldPrice: 3999,

        rating: 4.8,

        reviews: 98,

        discount: 30,

        image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85"
    },


    {
        id: 7,

        name: "Running Shoes",

        category: "shoes",

        price: 3999,

        oldPrice: 4999,

        rating: 4.9,

        reviews: 211,

        discount: 20,

        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
    },


    {
        id: 8,

        name: "Leather Backpack",

        category: "accessories",

        price: 2299,

        oldPrice: 2999,

        rating: 4.7,

        reviews: 54,

        discount: 23,

        image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85"
    }

];


/* =========================================================
   03. APPLICATION STATE
   ---------------------------------------------------------
   Ye variables website ki current state store karte hain.

   cart:
       Current cart items

   wishlist:
       Wishlist mein product IDs

   currentProducts:
       Abhi screen par displayed products
========================================================= */

let cart = [];

let wishlist = [];

let currentProducts = [...products];

/* =========================================================
   03.1 PRODUCT FILTER STATE
   ---------------------------------------------------------
   currentFilter:
       Abhi ka active product category filter.

   "all":
       Saare products

   Example:
       "electronics"
       "fashion"
       "shoes"
       "accessories"
========================================================= */

let currentFilter = "all";

/* =========================================================
   03.2 PRODUCT FILTER SYSTEM
   ========================================================= */

/* =========================================================
   03.3 APPLY PRODUCT FILTER
   ---------------------------------------------------------
   Category filter + search work together.

   IMPORTANT:
   - Search input ko modify nahi karta.
   - Search input ki value preserve karta hai.
   - Dark/light mode styling ko touch nahi karta.
   - Sirf filtering + rendering handle karta hai.
========================================================= */

function applyProductFilter(
    category = "all"
) {

    /* =====================================================
       STEP 1 — SAVE ACTIVE CATEGORY
    ===================================================== */

    currentFilter =
        category || "all";


    /* =====================================================
       STEP 2 — READ CURRENT SEARCH
       -----------------------------------------------------
       Search input ki value ko sirf read kar rahe hain.
       Uska color, class, style ya DOM change nahi kar rahe.
    ===================================================== */

    let searchQuery = "";


    if (DOM.searchInput) {

        searchQuery =
            DOM.searchInput.value || "";

    }


    /* =====================================================
       STEP 3 — UPDATE FILTER BUTTON UI
    ===================================================== */

    updateFilterButtons(
        currentFilter
    );


    /* =====================================================
       STEP 4 — APPLY CATEGORY + SEARCH
    ===================================================== */

    searchProducts(
        searchQuery
    );


    /* =====================================================
       STEP 5 — RESTORE SEARCH INPUT VALUE
       -----------------------------------------------------
       Agar render ke baad kisi reason se input value
       change ho jaye, original search wapas rakh denge.
    ===================================================== */

    if (DOM.searchInput) {

        DOM.searchInput.value =
            searchQuery;

    }

}


/* =========================================================
   03.4 UPDATE FILTER BUTTON UI
   ---------------------------------------------------------
   Active filter button ko visually highlight karta hai.

   IMPORTANT:
   - JS sirf "active" class manage karega.
   - Colors/background CSS handle karegi.
   - Dark mode ke liye JS mein koi color set nahi hoga.
========================================================= */

function updateFilterButtons(
    activeCategory = "all"
) {

    /* Get all filter buttons */

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    /* Safety check */

    if (!filterButtons.length) {

        return;

    }


    /* Update every filter button */

    filterButtons.forEach(
        button => {

            /* Read button category */

            const buttonCategory =
                button.dataset.filter;


            /* Remove previous active state */

            button.classList.remove(
                "active"
            );


            /* Apply active state */

            if (
                buttonCategory ===
                activeCategory
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   03.5 FILTER BUTTON EVENTS
========================================================= */

document
    .querySelectorAll(
        ".filter-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                /* Get category */

                const category =
                    button.dataset.filter;


                /* Safety check */

                if (!category) {
                    return;
                }


                /* Apply filter */

                applyProductFilter(
                    category
                );


                /* Update UI */

                updateFilterButtons(
                    category
                );


                /* Scroll to products */

                document
                    .getElementById(
                        "products"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }
        );

    });

    /* =========================================================
   03.6 INITIAL FILTER
   ---------------------------------------------------------
   Page load par "All" active rahega.
========================================================= */

updateFilterButtons(
    "all"
);


/* =========================================================
   04. DOM REFERENCES
   ---------------------------------------------------------
   HTML ke important elements ko yahan ek jagah reference
   kar rahe hain.

   Future mein agar kisi element ka ID change ho,
   mostly sirf yahin update karna padega.
========================================================= */

const DOM = {

    /* Product section */
    productGrid:
        document.getElementById("productGrid"),

        clearSearchBtn:
    document.getElementById("clearSearchInput"),


    /* Search */
    searchInput:
        document.getElementById("searchInput"),

        

    navSearchBtn:
        document.getElementById("navSearchBtn"),


    /* Cart */
    cartBtn:
        document.getElementById("cartBtn"),


    cartDrawer:
        document.getElementById("cartDrawer"),


    cartItems:
        document.getElementById("cartItems"),


    cartCount:
        document.getElementById("cartCount"),


    cartTotal:
        document.getElementById("cartTotal"),


    closeCart:
        document.getElementById("closeCart"),


    overlay:
        document.getElementById("overlay"),


    /* Theme */
    themeBtn:
        document.getElementById("themeBtn"),


    /* Wishlist */
    wishlistBtn:
        document.getElementById("wishlistBtn"),


    /* Newsletter */
    newsletterForm:
        document.getElementById("newsletterForm")

};


/* =========================================================
   PART 1 COMPLETE
   =========================================================

   Abhi yahan tak sirf:
   ✓ Config
   ✓ Products
   ✓ State
   ✓ DOM references

   Next Part:
   → LocalStorage
   → Utility functions
   → Product rendering
========================================================= */



/* =========================================================
   05. STORAGE HELPERS
   ---------------------------------------------------------
   Browser ke localStorage mein cart, wishlist aur theme
   save/load karne ke functions.
========================================================= */


/* ================= LOAD CART ================= */

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem(
                CONFIG.storageKeys.cart
            );


        if (!savedCart) {

            return [];

        }


        const parsedCart =
            JSON.parse(savedCart);


        return Array.isArray(parsedCart)
            ? parsedCart
            : [];

    } catch (error) {

        console.error(
            "Failed to load cart:",
            error
        );

        return [];

    }

}


/* ================= SAVE CART ================= */

function saveCart() {

    try {

        localStorage.setItem(

            CONFIG.storageKeys.cart,

            JSON.stringify(cart)

        );

    } catch (error) {

        console.error(
            "Failed to save cart:",
            error
        );

    }

}


/* ================= LOAD WISHLIST ================= */

function loadWishlist() {

    try {

        const savedWishlist =
            localStorage.getItem(
                CONFIG.storageKeys.wishlist
            );


        if (!savedWishlist) {

            return [];

        }


        const parsedWishlist =
            JSON.parse(savedWishlist);


        return Array.isArray(parsedWishlist)
            ? parsedWishlist
            : [];

    } catch (error) {

        console.error(
            "Failed to load wishlist:",
            error
        );

        return [];

    }

}


/* ================= SAVE WISHLIST ================= */

function saveWishlist() {

    try {

        localStorage.setItem(

            CONFIG.storageKeys.wishlist,

            JSON.stringify(wishlist)

        );

    } catch (error) {

        console.error(
            "Failed to save wishlist:",
            error
        );

    }

}


/* =========================================================
   06. UTILITY FUNCTIONS
========================================================= */


/* ================= FORMAT PRICE ================= */

function formatPrice(amount) {

    return (

        CONFIG.currency +

        Number(amount)
            .toLocaleString("en-IN")

    );

}


/* ================= FIND PRODUCT ================= */

function getProductById(id) {

    return products.find(

        product =>
            product.id === Number(id)

    );

}


/* =========================================================
   07. CART CALCULATIONS
========================================================= */


/* ================= TOTAL CART ITEMS ================= */

function getCartQuantity() {

    return cart.reduce(

        (total, item) =>

            total + item.quantity,

        0

    );

}


/* ================= CART SUBTOTAL ================= */

function getCartSubtotal() {

    return cart.reduce(

        (total, item) =>

            total +
            (item.price * item.quantity),

        0

    );

}


/* ================= CART DISCOUNT ================= */

function getCartDiscount(subtotal) {

    if (
        subtotal >=
        CONFIG.discountThreshold
    ) {

        return Math.round(

            subtotal *
            (
                CONFIG.discountPercent /
                100
            )

        );

    }


    return 0;

}


/* ================= SHIPPING ================= */

function getShippingCharge(subtotal) {

    if (
        subtotal >=
        CONFIG.freeShippingLimit
    ) {

        return 0;

    }


    return CONFIG.shippingCharge;

}


/* =========================================================
   08. PRODUCT RENDERING
   ---------------------------------------------------------
   Product cards yahin generate honge.

   Future mein product card ka HTML/design change karna ho
   to mostly sirf is function ko edit karna padega.
========================================================= */

function renderProducts(
    list = products
) {

    /* Safety check */

    if (!DOM.productGrid) {

        console.error(
            "Product grid was not found."
        );

        return;

    }


    /* Current displayed products save karo */

    currentProducts = [...list];


    /* Existing cards clear karo */

    DOM.productGrid.innerHTML = "";


    /* ================= NO PRODUCTS ================= */

    if (list.length === 0) {

        DOM.productGrid.innerHTML = `

            <div class="no-products">

                <i class="fa-solid fa-box-open"></i>

                <h3>
                    No products found
                </h3>

                <p>
                    Try searching for something else.
                </p>

            </div>

        `;

        return;

    }


    /* ================= CREATE CARDS ================= */

    list.forEach(product => {


        /* Check wishlist */

        const isWishlisted =
            wishlist.includes(product.id);


        /* Create card */

        const card =
            document.createElement("article");


        card.className =
            "product-card";


        /* ================= CARD HTML ================= */

        card.innerHTML = `

            <div class="product-image">


                <!-- PRODUCT IMAGE -->

                <img

                    src="${product.image}"

                    alt="${product.name}"

                    loading="lazy"

                >


                <!-- DISCOUNT -->

                <span class="discount-badge">

                    -${product.discount}%

                </span>


                <!-- WISHLIST -->

                <button

                    class="
                        product-wishlist
                        ${isWishlisted ? "active" : ""}
                    "

                    data-action="wishlist"

                    data-id="${product.id}"

                    aria-label="Add to wishlist"

                >

                    <i
                        class="
                            ${
                                isWishlisted
                                    ? "fa-solid"
                                    : "fa-regular"
                            }
                            fa-heart
                        "
                    ></i>

                </button>


                <!-- QUICK VIEW -->

                <button

                    class="quick-view"

                    data-action="quick-view"

                    data-id="${product.id}"

                >

                    Quick View

                </button>

            </div>


            <!-- PRODUCT INFORMATION -->

            <div class="product-info">


                <!-- CATEGORY -->

                <span class="product-category">

                    ${product.category}

                </span>


                <!-- NAME -->

                <h3 class="product-name">

                    ${product.name}

                </h3>


                <!-- RATING -->

                <div class="product-rating">


                    <span class="stars">

                        ★

                    </span>


                    <strong>

                        ${product.rating}

                    </strong>


                    <span>

                        (${product.reviews})

                    </span>

                </div>


                <!-- PRICE + CART -->

                <div class="product-bottom">


                    <div class="price-wrapper">


                        <span class="price">

                            ${formatPrice(product.price)}

                        </span>


                        <span class="old-price">

                            ${formatPrice(product.oldPrice)}

                        </span>

                    </div>


                    <!-- ADD TO CART -->

                    <button

                        class="add-btn"

                        data-action="add-cart"

                        data-id="${product.id}"

                        aria-label="Add to cart"

                    >

                        <i
                            class="fa-solid fa-plus"
                        ></i>

                    </button>

                </div>

            </div>

        `;


        /* Add card to page */

        DOM.productGrid.appendChild(card);

    });

}


/* =========================================================
   09. PRODUCT GRID EVENTS
   ---------------------------------------------------------
   Product cards dynamically create hote hain, isliye
   har button par alag event listener lagane ke bajaye
   ek single listener use kar rahe hain.

   Isse future maintenance easy hoti hai.
========================================================= */

if (DOM.productGrid) {

    DOM.productGrid.addEventListener(

        "click",

        event => {


            /* Find clicked action button */

            const button =
                event.target.closest(
                    "[data-action]"
                );


            /* Agar button nahi mila */

            if (!button) {

                return;

            }


            /* Action identify karo */

            const action =
                button.dataset.action;


            /* Product ID */

            const id =
                Number(
                    button.dataset.id
                );


            /* ================= ADD CART ================= */

            if (
                action === "add-cart"
            ) {

                addToCart(id);

            }


            /* ================= WISHLIST ================= */

            if (
                action === "wishlist"
            ) {

                toggleWishlist(
                    id,
                    button
                );

            }


            /* ================= QUICK VIEW ================= */

            if (
                action === "quick-view"
            ) {

                quickView(id);

            }

        }

    );

}


/* =========================================================
   PART 2 COMPLETE
   =========================================================

   Added:

   ✓ LocalStorage
   ✓ Cart calculations
   ✓ Shipping calculation
   ✓ Discount calculation
   ✓ Product lookup
   ✓ Product rendering
   ✓ Search-ready product list
   ✓ Wishlist UI state
   ✓ Product event delegation

   NEXT PART:

   → Add to Cart
   → Premium Cart
   → Quantity controls
   → Remove item
   → Cart summary
   → Free shipping progress
========================================================= */


/* =========================================================
   10. CART SYSTEM
   ---------------------------------------------------------
   Part 3:
   - Add to cart
   - Update cart
   - Quantity controls
   - Remove product
   - Empty cart
   - Shipping calculation
   - Discount calculation
   - Premium cart summary
========================================================= */


/* =========================================================
   10.1 ADD PRODUCT TO CART
========================================================= */

function addToCart(id) {

    const product =
        getProductById(id);


    /* Product exist karta hai ya nahi */

    if (!product) {

        console.error(
            `Product ID ${id} not found.`
        );

        return;

    }


    /* Check whether product already exists */

    const existingItem =
        cart.find(
            item =>
                item.id === product.id
        );


    /* ================= EXISTING PRODUCT ================= */

    if (existingItem) {

        existingItem.quantity += 1;

    }


    /* ================= NEW PRODUCT ================= */

    else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    /* Save cart */

    saveCart();


    /* Update UI */

    updateCart();


    /* Open cart */

    openCart();


    /* Notification */

    showToast(

        `${product.name} added to cart`,

        "success"

    );

}


/* =========================================================
   10.2 UPDATE CART
========================================================= */

function updateCart() {

    /* Safety check */

    if (!DOM.cartItems) {
        return;
    }


    /* Clear old cart UI */

    DOM.cartItems.innerHTML = "";


    /* Hide HTML empty-cart state */

const emptyCartElement =
    document.getElementById("emptyCart");

if (emptyCartElement) {
    emptyCartElement.hidden = true;
}



    /* Calculate cart information */

    const totalItems =
        getCartQuantity();


    const subtotal =
        getCartSubtotal();


    const discount =
        getCartDiscount(
            subtotal
        );


    const shipping =
        getShippingCharge(
            subtotal
        );


    const finalTotal =
        subtotal +
        shipping -
        discount;


    /* Update navbar cart count */

    if (DOM.cartCount) {

        DOM.cartCount.textContent =
            totalItems;

    }


    /* Update total */

    if (DOM.cartTotal) {

        DOM.cartTotal.textContent =
            formatPrice(
                finalTotal
            );

    }


    /* ================= EMPTY CART ================= */

    if (cart.length === 0) {

    renderEmptyCart();

    updateCartSummary(
        0,
        0,
        0
    );

    return;
}


    /* ================= CART PRODUCTS ================= */

    cart.forEach(
        item => {

            renderCartItem(item);

        }
    );


    /* ================= CART HAS PRODUCTS ================= */

const emptyCart =
    document.getElementById("emptyCart");

if (emptyCart) {
    emptyCart.hidden = true;
}



    /* ================= CART SUMMARY ================= */

    updateCartSummary(

        subtotal,

        shipping,

        discount

    );

}


/* =========================================================
   10.3 RENDER CART ITEM
========================================================= */

function renderCartItem(item) {

    const cartItem =
        document.createElement(
            "div"
        );


    cartItem.className =
        "cart-item";


    cartItem.dataset.id =
        item.id;


    cartItem.innerHTML = `

        <!-- PRODUCT IMAGE -->

        <img

            src="${item.image}"

            alt="${item.name}"

            loading="lazy"

        >


        <!-- PRODUCT INFORMATION -->

        <div class="cart-item-info">


            <h4>

                ${item.name}

            </h4>


            <p>

                ${formatPrice(
                    item.price
                )}

            </p>


            <!-- QUANTITY -->

            <div class="quantity">


                <button

                    type="button"

                    data-cart-action="decrease"

                    data-id="${item.id}"

                    aria-label="Decrease quantity"

                >

                    −

                </button>


                <span>

                    ${item.quantity}

                </span>


                <button

                    type="button"

                    data-cart-action="increase"

                    data-id="${item.id}"

                    aria-label="Increase quantity"

                >

                    +

                </button>

            </div>

        </div>


        <!-- REMOVE -->

        <button

            type="button"

            class="cart-remove"

            data-cart-action="remove"

            data-id="${item.id}"

            aria-label="Remove ${item.name}"

            title="Remove item"

        >

            <i
                class="fa-solid fa-trash"
            ></i>

        </button>

    `;


    DOM.cartItems.appendChild(
        cartItem
    );

}


/* =========================================================
   10.4 EMPTY CART
========================================================= */

function renderEmptyCart() {

    const emptyCartElement =
        document.getElementById("emptyCart");

    if (!emptyCartElement) {
        return;
    }

    emptyCartElement.hidden = false;
}




/* =========================================================
   10.5 CART SUMMARY
========================================================= */

function updateCartSummary(

    subtotal,

    shipping,

    discount

) {

    const footer =
        document.querySelector(
            ".cart-footer"
        );


    if (!footer) {

        return;

    }


    /* Calculate remaining amount */

    const remaining =
        Math.max(

            CONFIG.freeShippingLimit -
            subtotal,

            0

        );


    /* Shipping progress */

    const progress =
        Math.min(

            (
                subtotal /
                CONFIG.freeShippingLimit
            ) * 100,

            100

        );


    /* Final amount */

    const total =
        subtotal +
        shipping -
        discount;


    /* ================= FOOTER ================= */

    footer.innerHTML = `

        <!-- FREE SHIPPING MESSAGE -->

        <div
            class="shipping-progress"
        >

            ${
                remaining > 0

                    ? `

                        Add

                        <strong>

                            ${formatPrice(
                                remaining
                            )}

                        </strong>

                        more for
                        FREE delivery.

                    `

                    : `

                        🎉 You unlocked
                        FREE delivery!

                    `
            }


            <!-- PROGRESS BAR -->

            <div
                class="shipping-bar"
            >

                <span

                    style="
                        width:${progress}%;
                    "

                ></span>

            </div>

        </div>


        <!-- SUBTOTAL -->

        <div class="price-row">

            <span>

                Subtotal

            </span>


            <strong>

                ${formatPrice(
                    subtotal
                )}

            </strong>

        </div>


        <!-- SHIPPING -->

        <div class="price-row">

            <span>

                Delivery

            </span>


            <strong>

                ${
                    shipping === 0

                        ? "FREE"

                        : formatPrice(
                            shipping
                        )
                }

            </strong>

        </div>


        <!-- DISCOUNT -->

        ${
            discount > 0

                ? `

                    <div
                        class="price-row discount"
                    >

                        <span>

                            Discount

                        </span>


                        <strong>

                            -${formatPrice(
                                discount
                            )}

                        </strong>

                    </div>

                `

                : ""
        }


        <!-- FINAL TOTAL -->

        <div class="subtotal">

            <span>

                Total

            </span>


            <strong>

                ${formatPrice(
                    total
                )}

            </strong>

        </div>


        <!-- CHECKOUT -->

        <button

            id="checkoutBtn"

            class="checkout-btn"

            type="button"

        >

            Proceed to Checkout

            <i
                class="fa-solid fa-arrow-right"
            ></i>

        </button>

    `;


    /* Attach checkout event */

    const checkoutButton =
        document.getElementById(
            "checkoutBtn"
        );


    checkoutButton?.addEventListener(

        "click",

        handleCheckout

    );

}


/* =========================================================
   10.6 CART EVENTS
   ---------------------------------------------------------
   Ek hi event listener quantity/remove buttons handle
   karta hai.
========================================================= */

if (DOM.cartItems) {

    DOM.cartItems.addEventListener(

        "click",

        event => {


            /* ================= EMPTY CART ================= */

            const emptyAction =
                event.target.closest(
                    "[data-empty-cart-action]"
                );


            if (emptyAction) {

                closeCart();


                document
                    .getElementById(
                        "products"
                    )
                    ?.scrollIntoView({

                        behavior: "smooth"

                    });


                return;

            }


            /* ================= CART BUTTON ================= */

            const button =
                event.target.closest(
                    "[data-cart-action]"
                );


            if (!button) {

                return;

            }


            /* Product ID */

            const id =
                Number(
                    button.dataset.id
                );


            /* Action */

            const action =
                button.dataset.cartAction;


            /* ================= INCREASE ================= */

            if (
                action === "increase"
            ) {

                changeQuantity(
                    id,
                    1
                );

            }


            /* ================= DECREASE ================= */

            if (
                action === "decrease"
            ) {

                changeQuantity(
                    id,
                    -1
                );

            }


            /* ================= REMOVE ================= */

            if (
                action === "remove"
            ) {

                removeFromCart(
                    id
                );

            }

        }

    );

}


/* =========================================================
   10.7 CHANGE QUANTITY
========================================================= */

function changeQuantity(

    id,

    amount

) {

    const item =
        cart.find(

            product =>
                product.id ===
                Number(id)

        );


    if (!item) {

        return;

    }


    /* Change quantity */

    item.quantity += amount;


    /* Remove when quantity reaches zero */

    if (
        item.quantity <= 0
    ) {

        removeFromCart(
            id
        );

        return;

    }


    /* Save */

    saveCart();


    /* Refresh */

    updateCart();

}


/* =========================================================
   10.8 REMOVE FROM CART
========================================================= */

function removeFromCart(id) {

    const item =
        cart.find(

            product =>
                product.id ===
                Number(id)

        );


    /* Remove product */

    cart =
        cart.filter(

            product =>
                product.id !==
                Number(id)

        );


    /* Save */

    saveCart();


    /* Refresh */

    updateCart();


    /* Notification */

    if (item) {

        showToast(

            `${item.name} removed from cart`,

            "info"

        );

    }

}


/* =========================================================
   10.9 OPEN CART
========================================================= */

function openCart() {

    DOM.cartDrawer
        ?.classList.add(
            "active"
        );


    DOM.overlay
        ?.classList.add(
            "active"
        );


    document.body.classList.add(
        "cart-open"
    );

}


/* =========================================================
   10.10 CLOSE CART
========================================================= */

function closeCart() {

    DOM.cartDrawer
        ?.classList.remove(
            "active"
        );


    DOM.overlay
        ?.classList.remove(
            "active"
        );


    document.body.classList.remove(
        "cart-open"
    );

}


/* =========================================================
   10.11 CART BUTTON EVENTS
========================================================= */

DOM.cartBtn?.addEventListener(

    "click",

    openCart

);


DOM.closeCart?.addEventListener(

    "click",

    closeCart

);


DOM.overlay?.addEventListener(

    "click",

    closeCart

);


/* =========================================================
   10.12 CHECKOUT
========================================================= */

function handleCheckout() {

    if (
        cart.length === 0
    ) {

        showToast(

            "Your cart is empty.",

            "error"

        );

        return;

    }


    showToast(

        "Checkout is coming next 🚀",

        "info"

    );

}


/* =========================================================
   PART 3 COMPLETE
   =========================================================

   Ab:

   ✓ Add to cart
   ✓ Cart drawer
   ✓ Quantity + / -
   ✓ Remove product
   ✓ Empty cart
   ✓ Subtotal
   ✓ Delivery
   ✓ Free shipping progress
   ✓ Automatic discount
   ✓ Final total
   ✓ Checkout button
   ✓ Cart localStorage
   ✓ Toast notifications

   NEXT PART:

   → Search
   → Category filtering
   → Dark mode
   → Wishlist
   → Quick View
   → Newsletter
   → Final initialization
========================================================= */


 /* =========================================================
    11. SEARCH SYSTEM
    ---------------------------------------------------------
    Product name + category ke basis par live search.
 ========================================================= */


/* ================= SEARCH PRODUCTS ================= */

/* =========================================================
   PART 17 — COMBINED SEARCH + CATEGORY FILTER
========================================================= */

/* =========================================================
   17.1 SEARCH PRODUCTS
========================================================= */

function searchProducts(query) {

    const normalizedQuery =
        query
            .toLowerCase()
            .trim();


    /* =====================================================
       STEP 1 — CATEGORY FILTER
    ===================================================== */

    let filteredProducts;

    if (currentFilter === "all") {

        filteredProducts = [
            ...products
        ];

    } else {

        filteredProducts =
            products.filter(
                product => {

                    return (
                        product.category ===
                        currentFilter
                    );

                }
            );

    }


    /* =====================================================
       STEP 2 — SEARCH FILTER
    ===================================================== */

    if (normalizedQuery) {

        filteredProducts =
            filteredProducts.filter(
                product => {

                    const productName =
                        product.name
                            .toLowerCase();

                    const productCategory =
                        product.category
                            .toLowerCase();


                    return (
                        productName.includes(
                            normalizedQuery
                        )

                        ||

                        productCategory.includes(
                            normalizedQuery
                        )
                    );

                }
            );

    }


    /* =====================================================
       STEP 3 — SAVE CURRENT PRODUCTS
    ===================================================== */

    currentProducts = [
        ...filteredProducts
    ];


    /* =====================================================
       STEP 4 — RENDER
    ===================================================== */

    renderProducts(
        filteredProducts
    );

}


/* ================= LIVE SEARCH ================= */

DOM.searchInput?.addEventListener(

    "input",

    event => {

        searchProducts(
            event.target.value
        );

    }

);


/* =========================================================
   12. NAVBAR SEARCH
========================================================= */

DOM.navSearchBtn?.addEventListener(

    "click",

    () => {


        /* Scroll to products */

        document
            .getElementById(
                "products"
            )
            ?.scrollIntoView({

                behavior: "smooth"

            });


        /* Focus search box */

        setTimeout(

            () => {

                DOM.searchInput?.focus();

            },

            500

        );

    }

);


/* =========================================================
   13. CATEGORY FILTER
========================================================= */

document
    .querySelectorAll(
        ".category-card"
    )
    .forEach(card => {


        card.addEventListener(

            "click",

            () => {


                const category =
                    card.dataset.category;


                /* Safety check */

                if (!category) {

                    return;

                }


                /* Apply same filter system */

applyProductFilter(
    category
);


/* Update filter buttons */

updateFilterButtons(
    category
);


                /* Scroll */

                document
                    .getElementById(
                        "products"
                    )
                    ?.scrollIntoView({

                        behavior: "smooth"

                    });

            }

        );

    });


/* =========================================================
   14. THEME / DARK MODE
   ---------------------------------------------------------
   Theme localStorage mein save hota hai.
   Refresh ke baad bhi same theme rahega.
========================================================= */


/* ================= UPDATE THEME ICON ================= */

function updateThemeIcon() {

    const icon =
        DOM.themeBtn
            ?.querySelector("i");


    if (!icon) {

        return;

    }


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    icon.className =
        isDark

            ? "fa-solid fa-sun"

            : "fa-solid fa-moon";

}


/* ================= APPLY SAVED THEME ================= */

function applySavedTheme() {

    const savedTheme =
        localStorage.getItem(
            CONFIG.storageKeys.theme
        );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

    }


    updateThemeIcon();

}


/* ================= TOGGLE THEME ================= */

DOM.themeBtn?.addEventListener(

    "click",

    () => {


        const isDark =
            document.body.classList.toggle(
                "dark"
            );


        localStorage.setItem(

            CONFIG.storageKeys.theme,

            isDark
                ? "dark"
                : "light"

        );


        updateThemeIcon();

    }

);


/* =========================================================
   15. WISHLIST SYSTEM
========================================================= */


/* ================= TOGGLE WISHLIST ================= */

function toggleWishlist(

    id,

    button = null

) {

    const product =
        getProductById(id);


    /* Product check */

    if (!product) {

        return;

    }


    /* Find product */

    const existingIndex =
        wishlist.indexOf(
            product.id
        );


    /* ================= ADD ================= */

    if (
        existingIndex === -1
    ) {

        wishlist.push(
            product.id
        );


        showToast(

            `${product.name} added to wishlist ❤️`,

            "success"

        );

    }


    /* ================= REMOVE ================= */

    else {

        wishlist.splice(

            existingIndex,

            1

        );


        showToast(

            `${product.name} removed from wishlist`,

            "info"

        );

    }


    /* Save */

    saveWishlist();


    /* Update navbar */

    updateWishlistCount();


    /*
        Re-render so every heart stays
        synchronized.
    */

    renderProducts(
        currentProducts
    );

}


/* =========================================================
   16. WISHLIST COUNT
========================================================= */

function updateWishlistCount() {

    const badge =
        DOM.wishlistBtn
            ?.querySelector(
                ".nav-count"
            );


    if (!badge) {

        return;

    }


    badge.textContent =
        wishlist.length;

}


/* =========================================================
   17. WISHLIST BUTTON
========================================================= */

DOM.wishlistBtn?.addEventListener(

    "click",

    () => {


        /* Empty wishlist */

        if (
            wishlist.length === 0
        ) {

            showToast(

                "Your wishlist is empty.",

                "info"

            );

            return;

        }


        /* Get saved products */

        const wishlistProducts =
            products.filter(

                product =>
                    wishlist.includes(
                        product.id
                    )

            );


        /* Display */

        renderProducts(
            wishlistProducts
        );


        /* Scroll */

        document
            .getElementById(
                "products"
            )
            ?.scrollIntoView({

                behavior: "smooth"

            });


        showToast(

            `${wishlist.length} saved item(s) shown`,

            "success"

        );

    }

);


/* =========================================================
   18. QUICK VIEW MODAL
   ---------------------------------------------------------
   Modal dynamically create hota hai.
   index.html mein extra HTML ki zarurat nahi.
========================================================= */

function quickView(id) {

    const product =
        getProductById(id);


    if (!product) {

        return;

    }


    /* Remove existing modal */

    document
        .querySelector(
            ".quick-view-modal"
        )
        ?.remove();


    /* Create modal */

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "quick-view-modal";


    /* Modal HTML */

    modal.innerHTML = `

        <!-- BACKDROP -->

        <div
            class="quick-view-backdrop"
        ></div>


        <!-- MODAL CONTENT -->

        <div
            class="quick-view-content"
        >


            <!-- CLOSE -->

            <button

                class="quick-view-close"

                type="button"

                aria-label="Close"

            >

                <i
                    class="fa-solid fa-xmark"
                ></i>

            </button>


            <!-- IMAGE -->

            <div
                class="quick-view-image"
            >

                <img

                    src="${product.image}"

                    alt="${product.name}"

                >

            </div>


            <!-- DETAILS -->

            <div
                class="quick-view-details"
            >


                <span
                    class="product-category"
                >

                    ${product.category}

                </span>


                <h2>

                    ${product.name}

                </h2>


                <!-- RATING -->

                <div
                    class="quick-view-rating"
                >

                    ★ ${product.rating}

                    <span>

                        (${product.reviews}
                        reviews)

                    </span>

                </div>


                <!-- PRICE -->

                <div
                    class="quick-view-price"
                >

                    ${formatPrice(
                        product.price
                    )}


                    <del>

                        ${formatPrice(
                            product.oldPrice
                        )}

                    </del>

                </div>


                <!-- DESCRIPTION -->

                <p>

                    A premium
                    ${product.category}
                    product selected for the
                    NovaStore collection.

                </p>


                <!-- ADD BUTTON -->

                <button

                    class="quick-view-add"

                    data-id="${product.id}"

                    type="button"

                >

                    Add to Cart

                    <i
                        class="
                            fa-solid
                            fa-cart-plus
                        "
                    ></i>

                </button>

            </div>

        </div>

    `;


    /* Add modal */

    document.body.appendChild(
        modal
    );


    /* Trigger animation */

    requestAnimationFrame(

        () => {

            modal.classList.add(
                "active"
            );

        }

    );


    /* ================= CLOSE FUNCTION ================= */

    const closeModal = () => {

        modal.classList.remove(
            "active"
        );


        setTimeout(

            () => {

                modal.remove();

            },

            250

        );

    };


    /* Close button */

    modal
        .querySelector(
            ".quick-view-close"
        )
        ?.addEventListener(

            "click",

            closeModal

        );


    /* Close backdrop */

    modal
        .querySelector(
            ".quick-view-backdrop"
        )
        ?.addEventListener(

            "click",

            closeModal

        );


    /* Add to cart */

    modal
        .querySelector(
            ".quick-view-add"
        )
        ?.addEventListener(

            "click",

            () => {

                addToCart(
                    product.id
                );


                closeModal();

            }

        );


    /* Escape key */

    const escapeHandler =
        event => {

            if (
                event.key === "Escape"
            ) {

                closeModal();


                document.removeEventListener(

                    "keydown",

                    escapeHandler

                );

            }

        };


    document.addEventListener(

        "keydown",

        escapeHandler

    );

}


/* =========================================================
   19. NEWSLETTER
========================================================= */

DOM.newsletterForm?.addEventListener(

    "submit",

    event => {

        /* Stop page reload */

        event.preventDefault();


        /* Get email */

        const emailInput =
            event.target.querySelector(
                'input[type="email"]'
            );


        const email =
            emailInput?.value.trim();


        /* Empty check */

        if (!email) {

            return;

        }


        /* Success */

        showToast(

            "You're subscribed! 🎉",

            "success"

        );


        /* Clear form */

        event.target.reset();

    }

);


/* =========================================================
   20. TOAST NOTIFICATIONS
========================================================= */

function showToast(

    message,

    type = "info"

) {

    /* Find existing toast */

    let toast =
        document.getElementById(
            "novaToast"
        );


    /* Create if missing */

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "novaToast";


        document.body.appendChild(
            toast
        );

    }


    /* Toast class */

    toast.className =
        `nova-toast ${type}`;


    /* Icon */

    let icon =
        "fa-solid fa-circle-info";


    if (
        type === "success"
    ) {

        icon =
            "fa-solid fa-circle-check";

    }


    if (
        type === "error"
    ) {

        icon =
            "fa-solid fa-circle-exclamation";

    }


    /* Content */

    toast.innerHTML = `

        <i
            class="${icon}"
        ></i>


        <span>

            ${message}

        </span>

    `;


    /* Clear old timer */

    clearTimeout(
        toast.hideTimer
    );


    /* Show */

    requestAnimationFrame(

        () => {

            toast.classList.add(
                "show"
            );

        }

    );


    /* Hide */

    toast.hideTimer =
        setTimeout(

            () => {

                toast.classList.remove(
                    "show"
                );

            },

            2200

        );

}


/* =========================================================
   21. KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(

    "keydown",

    event => {


        /* ESC = close cart */

        if (

            event.key === "Escape" &&

            DOM.cartDrawer
                ?.classList.contains(
                    "active"
                )

        ) {

            closeCart();

        }

    }

);


/* =========================================================
   22. INITIALIZE STORE
   ---------------------------------------------------------
   Website load hote hi:
   - Theme load
   - Cart load
   - Wishlist load
   - Products render
========================================================= */

function initializeStore() {


    /* Load saved cart */

    cart =
        loadCart();


    /* Load saved wishlist */

    wishlist =
        loadWishlist();


    /* Apply saved theme */

    applySavedTheme();


    /* Wishlist count */

    updateWishlistCount();


    /* Product cards */

    renderProducts();


    /* Cart */

    updateCart();

}


/* =========================================================
   START NOVASTORE
========================================================= */

initializeStore();


/* =========================================================
   PART 4 COMPLETE
   =========================================================

   COMPLETE FEATURES:

   ✓ Search
   ✓ Navbar search
   ✓ Category filtering
   ✓ Dark mode
   ✓ Theme persistence
   ✓ Wishlist
   ✓ Wishlist persistence
   ✓ Quick View modal
   ✓ Add to cart from Quick View
   ✓ Newsletter
   ✓ Toast notifications
   ✓ Escape key support
   ✓ Cart persistence
   ✓ Product rendering
   ✓ Premium cart

   NEXT:
   Final testing + polish
========================================================= */

/* =========================================================
   23. FINAL UX POLISH
   ---------------------------------------------------------
   Part 5:
   - Image fallback
   - Search clear behavior
   - Better keyboard support
   - Scroll-to-top helper
   - Product image error handling
   - Final safety checks
========================================================= */


/* =========================================================
   23.1 PRODUCT IMAGE FALLBACK
   ---------------------------------------------------------
   Agar kisi product ki image load na ho to broken-image
   icon ke bajaye clean placeholder show hoga.
========================================================= */

function setupImageFallbacks() {

    document
        .querySelectorAll(
            ".product-image img, .cart-item img"
        )
        .forEach(image => {

            image.addEventListener(
                "error",
                () => {

                    image.src =
                        "https://placehold.co/900x900/f2f2f2/777?text=NovaStore";

                },
                {
                    once: true
                }
            );

        });

}


/* =========================================================
   23.2 SEARCH KEYBOARD SUPPORT
   ---------------------------------------------------------
   "/" press karne par search box focus.
========================================================= */

document.addEventListener(

    "keydown",

    event => {

        /* Don't trigger while typing */

        const activeElement =
            document.activeElement;


        const isTyping =
            activeElement &&
            (
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA" ||
                activeElement.isContentEditable
            );


        if (
            event.key === "/" &&
            !isTyping
        ) {

            event.preventDefault();

            DOM.searchInput?.focus();

        }

    }

);


/* =========================================================
   23.3 SEARCH ESCAPE
   ---------------------------------------------------------
   Search box focused ho aur Escape press karo ->
   search clear + all products.
========================================================= */

DOM.searchInput?.addEventListener(

    "keydown",

    event => {

        if (
            event.key === "Escape"
        ) {

            DOM.searchInput.value = "";

            renderProducts(products);

            DOM.searchInput.blur();

        }

    }

);


/* =========================================================
   23.4 PRODUCT SCROLL HELPER
========================================================= */

function scrollToProducts() {

    document
        .getElementById(
            "products"
        )
        ?.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

}


/* =========================================================
   23.5 HOME / LOGO CLICK
========================================================= */

document
    .querySelectorAll(
        'a[href="#home"]'
    )
    .forEach(link => {

        link.addEventListener(

            "click",

            () => {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }

        );

    });


/* =========================================================
   23.6 CART BODY SCROLL LOCK
   ---------------------------------------------------------
   Cart open hone par background page unnecessary scroll
   nahi karega.
========================================================= */

function updateBodyScrollLock() {

    const cartIsOpen =
        DOM.cartDrawer
            ?.classList.contains(
                "active"
            );


    document.body.style.overflow =
        cartIsOpen
            ? "hidden"
            : "";

}


/* Patch openCart */

const originalOpenCart =
    openCart;


openCart = function () {

    originalOpenCart();

    updateBodyScrollLock();

};


/* Patch closeCart */

const originalCloseCart =
    closeCart;


closeCart = function () {

    originalCloseCart();

    updateBodyScrollLock();

};


/* =========================================================
   23.7 PRODUCT IMAGE FALLBACK AFTER RENDER
========================================================= */

const originalRenderProducts =
    renderProducts;


renderProducts = function (list = products) {

    originalRenderProducts(list);

    setupImageFallbacks();

};


/* =========================================================
   23.8 CART IMAGE FALLBACK AFTER UPDATE
========================================================= */

const originalUpdateCart =
    updateCart;


updateCart = function () {

    originalUpdateCart();

    setupImageFallbacks();

};


/* =========================================================
   23.9 NAVBAR CART COUNT ANIMATION
========================================================= */

function animateCartCount() {

    if (!DOM.cartCount) {

        return;

    }


    DOM.cartCount.classList.remove(
        "cart-count-pop"
    );


    /* Force browser reflow */

    void DOM.cartCount.offsetWidth;


    DOM.cartCount.classList.add(
        "cart-count-pop"
    );

}


/* =========================================================
   23.10 FINAL PRODUCT DATA VALIDATION
   ---------------------------------------------------------
   Development helper:
   Product data mein missing ID/name/price ho to console
   mein clear warning milegi.
========================================================= */

function validateProducts() {

    const ids = new Set();


    products.forEach(
        product => {

            if (
                ids.has(product.id)
            ) {

                console.warn(
                    `Duplicate product ID: ${product.id}`
                );

            }


            ids.add(
                product.id
            );


            if (
                !product.name
            ) {

                console.warn(
                    `Product ${product.id} has no name.`
                );

            }


            if (
                typeof product.price !== "number"
            ) {

                console.warn(
                    `Product ${product.id} has invalid price.`
                );

            }


            if (
                !product.image
            ) {

                console.warn(
                    `Product ${product.id} has no image.`
                );

            }

        }
    );

}


/* =========================================================
   23.11 CART DATA CLEANUP
   ---------------------------------------------------------
   Old/broken localStorage data se app crash na ho.
========================================================= */

function cleanCartData() {

    cart =
        cart.filter(item => {

            const validProduct =
                getProductById(
                    item.id
                );


            if (!validProduct) {

                return false;

            }


            if (
                typeof item.quantity !== "number" ||
                item.quantity <= 0
            ) {

                return false;

            }


            return true;

        });


    saveCart();

}


/* =========================================================
   23.12 WISHLIST DATA CLEANUP
========================================================= */

function cleanWishlistData() {

    wishlist =
        wishlist.filter(

            id =>
                Boolean(
                    getProductById(id)
                )

        );


    saveWishlist();

}


/* =========================================================
   23.13 FINAL APP HEALTH CHECK
========================================================= */

function runStoreHealthCheck() {

    console.log(
        "NovaStore initialized successfully."
    );


    console.log(
        `Products: ${products.length}`
    );


    console.log(
        `Cart items: ${getCartQuantity()}`
    );


    console.log(
        `Wishlist items: ${wishlist.length}`
    );

}


/* =========================================================
   23.14 RUN FINAL CHECKS
========================================================= */

validateProducts();

cleanCartData();

cleanWishlistData();

setupImageFallbacks();

updateWishlistCount();

updateCart();

runStoreHealthCheck();


/* =========================================================
   23.15 CLEAR SEARCH BUTTON

   Clear search only.
   Current category filter remains active.
========================================================= */

DOM.clearSearchBtn?.addEventListener(
    "click",
    () => {

        /* Safety check */

        if (!DOM.searchInput) {
            return;
        }


        /* Clear search input */

        DOM.searchInput.value = "";


        /* Re-run search/filter system */

        searchProducts("");


        /* Focus search input */

        DOM.searchInput.focus();


        /* User feedback */

        showToast(
            "Search cleared",
            "info"
        );

    }
);


/* =========================================================
   23.16 SCROLL TO TOP BUTTON
   ---------------------------------------------------------
   Creates a floating button automatically.

   ✓ Appears after scrolling
   ✓ Smooth scroll
   ✓ Keyboard accessible
   ✓ Mobile friendly
========================================================= */

function createScrollTopButton() {

    if (
        document.getElementById(
            "scrollTopBtn"
        )
    ) {
        return;
    }


    const button =
        document.createElement(
            "button"
        );


    button.id =
        "scrollTopBtn";


    button.type =
        "button";


    button.className =
        "scroll-top-btn";


    button.setAttribute(
        "aria-label",
        "Scroll to top"
    );


    button.setAttribute(
        "title",
        "Back to top"
    );


    button.innerHTML = `
        <i
            class="fa-solid fa-arrow-up"
            aria-hidden="true"
        ></i>
    `;


    document.body.appendChild(
        button
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    const updateVisibility =
        () => {

            if (
                window.scrollY > 500
            ) {

                button.classList.add(
                    "show"
                );

            } else {

                button.classList.remove(
                    "show"
                );

            }

        };


    window.addEventListener(
        "scroll",
        updateVisibility,
        {
            passive: true
        }
    );


    updateVisibility();

}


/* Create button */

createScrollTopButton();


/* =========================================================
   23.17 FINAL KEYBOARD SAFETY
   ---------------------------------------------------------
   Enter / Space works naturally on buttons.
   Escape closes active UI where possible.
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        /* Close cart */

        if (
            DOM.cartDrawer?.classList.contains(
                "active"
            )
        ) {

            closeCart();

            return;

        }


        /* Close quick view */

        const quickView =
            document.querySelector(
                ".quick-view-modal.active"
            );


        if (quickView) {

            quickView
                .querySelector(
                    ".quick-view-close"
                )
                ?.click();

        }

    }
);


/* =========================================================
   23.18 FINAL SAFETY
========================================================= */

window.addEventListener(
    "error",
    event => {

        console.warn(
            "NovaStore runtime warning:",
            event.message
        );

    }
);