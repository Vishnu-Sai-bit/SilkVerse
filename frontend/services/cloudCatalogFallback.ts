import catalogData from "@/data/catalog.json";

const TELUGU_MAP: Record<string, string> = {
  "పెళ్లి": "wedding",
  "వధువు": "bridal",
  "పెళ్లికూతురు": "bridal",
  "పండుగ": "festive",
  "మెరూన్": "maroon",
  "బంగారు": "gold",
  "గోల్డ్": "gold",
  "ఆకుపచ్చ": "green",
  "గ్రీన్": "green",
  "ఎరుపు": "red",
  "రెడ్": "red",
  "నీలం": "blue",
  "బ్లూ": "blue",
  "గులాబీ": "pink",
  "పింక్": "pink",
  "కంచి": "kanchipuram",
  "కాంచీపురం": "kanchipuram",
  "ధర్మవరం": "dharmavaram",
  "బనారసి": "banarasi",
  "పైథాని": "paithani",
  "సాఫ్ట్": "soft",
};

const rawProducts: any[] = [...((catalogData as any).products || [])];
const rawCoupons: any[] = [...((catalogData as any).coupons || [])];

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const val = window.localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key: string, val: any) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

function jsonResponse(payload: any, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const DEFAULT_ADDRESS = {
  _id: "addr_default_1",
  fullName: "Vishnu Sai",
  mobile: "9876543210",
  pincode: "515671",
  houseNumber: "Plot 42, Weaver Colony",
  area: "Dharmavaram Silk Weaver Street",
  landmark: "Near Sri Lakshmi Chennakesava Temple",
  city: "Dharmavaram",
  state: "Andhra Pradesh",
  country: "India",
  addressType: "Home",
  isDefault: true,
};

export async function handleCloudApiRequest(
  rawUrl: string,
  init?: RequestInit
): Promise<Response> {
  const method = (init?.method || "GET").toUpperCase();
  const parsed = new URL(rawUrl, "http://localhost:5001");
  const route = parsed.pathname.replace(/^\/api\/?/, "").replace(/\/+$/, "");
  const path = route.split("/").filter(Boolean);
  const searchParams = parsed.searchParams;

  let body: any = {};
  if (init?.body && typeof init.body === "string") {
    try {
      body = JSON.parse(init.body);
    } catch {
      body = {};
    }
  }

  // 1. Products Categories
  if (route === "products/categories") {
    const counts: Record<string, number> = { All: rawProducts.length };
    const categoriesSet = new Set<string>();
    const occasionCounts: Record<string, number> = {};
    const fabricCounts: Record<string, number> = {};

    for (const p of rawProducts) {
      if (p.category) {
        categoriesSet.add(p.category);
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
      if (p.occasion) {
        occasionCounts[p.occasion] = (occasionCounts[p.occasion] || 0) + 1;
      }
      if (p.fabric) {
        fabricCounts[p.fabric] = (fabricCounts[p.fabric] || 0) + 1;
      }
    }

    return jsonResponse({
      success: true,
      categories: Array.from(categoriesSet).sort(),
      counts,
      occasionCounts,
      fabricCounts,
      total: rawProducts.length,
    });
  }

  // 2. Related Products
  if (path[0] === "products" && path.length === 3 && path[2] === "related") {
    const id = path[1];
    const target = rawProducts.find((p) => p._id === id);
    const related = rawProducts
      .filter((p) => p._id !== id && (!target || p.category === target.category))
      .slice(0, 5);
    return jsonResponse({
      success: true,
      products: related.length > 0 ? related : rawProducts.slice(0, 5),
    });
  }

  // 3. Single Product
  if (path[0] === "products" && path.length === 2) {
    const id = path[1];
    const product = rawProducts.find((p) => p._id === id) || rawProducts[0];
    return jsonResponse({ success: true, product });
  }

  // 4. All Products (Filter + Search + Sort + Pagination)
  if (route === "products") {
    let filtered = [...rawProducts];
    const keyword = searchParams.get("keyword")?.trim();
    const category = searchParams.get("category")?.trim();
    const occasion = searchParams.get("occasion")?.trim();
    const weave = searchParams.get("weave")?.trim();
    const fabric = searchParams.get("fabric")?.trim();
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 0);
    const rating = Number(searchParams.get("rating") || 0);
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.max(Number(searchParams.get("limit") || 200), 1);

    if (keyword) {
      let kw = keyword.toLowerCase();
      for (const [tel, eng] of Object.entries(TELUGU_MAP)) {
        kw = kw.replace(new RegExp(tel, "g"), eng);
      }
      const tokens = kw
        .split(/\s+/)
        .filter(
          (t) =>
            t.length > 1 &&
            !["saree", "sarees", "silk", "pattu", "with", "under", "below"].includes(t)
        );
      if (tokens.length > 0) {
        filtered = filtered.filter((p) => {
          const hay = `${p.name} ${p.description} ${p.category} ${p.color} ${p.fabric} ${p.weave} ${p.occasion}`.toLowerCase();
          return tokens.every((t) => hay.includes(t));
        });
      }
    }

    if (category && category !== "All") {
      const cats = category.split(",").map((c) => c.trim().toLowerCase());
      filtered = filtered.filter((p) =>
        cats.some(
          (c) =>
            p.category?.toLowerCase().includes(c) ||
            p.occasion?.toLowerCase().includes(c)
        )
      );
    }

    if (occasion && occasion !== "All") {
      const occs = occasion.split(",").map((o) => o.trim().toLowerCase());
      filtered = filtered.filter((p) =>
        occs.some(
          (o) =>
            p.occasion?.toLowerCase().includes(o) ||
            p.category?.toLowerCase().includes(o)
        )
      );
    }

    if (fabric && fabric !== "All") {
      const fabs = fabric.split(",").map((f) => f.trim().toLowerCase());
      filtered = filtered.filter((p) =>
        fabs.some(
          (f) =>
            p.fabric?.toLowerCase().includes(f) ||
            p.name?.toLowerCase().includes(f)
        )
      );
    }

    if (weave && weave !== "All") {
      filtered = filtered.filter((p) =>
        p.weave?.toLowerCase().includes(weave.toLowerCase())
      );
    }

    if (minPrice > 0) filtered = filtered.filter((p) => p.price >= minPrice);
    if (maxPrice > 0) filtered = filtered.filter((p) => p.price <= maxPrice);
    if (rating > 0) filtered = filtered.filter((p) => (p.averageRating || 0) >= rating);

    if (sort === "priceAsc" || sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "priceDesc" || sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (sort === "bestseller" || sort === "popularity") {
      filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }

    const totalProducts = filtered.length;
    const totalPages = Math.max(Math.ceil(totalProducts / limit), 1);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return jsonResponse({
      success: true,
      totalProducts,
      totalPages,
      currentPage: page,
      count: paginated.length,
      products: paginated,
    });
  }

  // 5. Coupons
  if (route === "coupons/apply" || route === "coupons/validate") {
    const code = (body.code || "").trim().toUpperCase();
    const subtotal = Number(body.subtotal || body.cartTotal || body.orderAmount || 0);
    const coupon = rawCoupons.find((c) => c.code.toUpperCase() === code);
    if (!coupon) {
      return jsonResponse(
        { success: false, message: "Invalid or expired coupon code." },
        400
      );
    }
    if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
      return jsonResponse(
        {
          success: false,
          message: `Minimum order of ₹${coupon.minimumOrder} required for ${coupon.code}.`,
        },
        400
      );
    }
    let discount =
      coupon.discountType === "Percentage"
        ? Math.round((subtotal * coupon.discountValue) / 100)
        : coupon.discountValue;
    if (coupon.maxDiscount && coupon.maxDiscount > 0) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
    return jsonResponse({
      success: true,
      discount,
      coupon,
      code: coupon.code,
      finalAmount: Math.max(subtotal - discount, 0),
    });
  }

  if (route.startsWith("coupons")) {
    return jsonResponse({ success: true, coupons: rawCoupons });
  }

  // 6. Auth
  if (route === "auth/me") {
    const savedUser = getStorage("silkverse-cloud-user", {
      _id: "user_demo_1",
      name: "Vishnu Sai",
      email: "vishnubeere91@gmail.com",
      mobile: "9876543210",
      role: "admin",
    });
    return jsonResponse({ success: true, user: savedUser });
  }

  if (
    route === "auth/login" ||
    route === "auth/register" ||
    route === "auth/google" ||
    route === "auth/facebook" ||
    route === "auth/apple" ||
    route === "auth/demo-social"
  ) {
    const email = body.email || body.identifier || "vishnubeere91@gmail.com";
    const name = body.name || email.split("@")[0] || "Vishnu Sai";
    const userObj = {
      _id: "user_demo_1",
      name,
      email,
      mobile: body.mobile || "9876543210",
      role: email.includes("vishnu") ? "admin" : "user",
    };
    setStorage("silkverse-cloud-user", userObj);
    return jsonResponse({
      success: true,
      token: "silkverse_cloud_jwt_token",
      user: userObj,
    });
  }

  if (route === "auth/profile") {
    const current = getStorage("silkverse-cloud-user", {
      _id: "user_demo_1",
      name: "Vishnu Sai",
      email: "vishnubeere91@gmail.com",
      mobile: "9876543210",
      role: "admin",
    });
    const updated = { ...current, ...body };
    setStorage("silkverse-cloud-user", updated);
    return jsonResponse({ success: true, user: updated });
  }

  // 7. Addresses
  if (route.startsWith("addresses")) {
    const addresses = getStorage<any[]>("silkverse-cloud-addresses", [DEFAULT_ADDRESS]);
    if (method === "POST") {
      const newAddr = { _id: "addr_" + Date.now(), ...body };
      const next = [...addresses, newAddr];
      setStorage("silkverse-cloud-addresses", next);
      return jsonResponse({ success: true, address: newAddr, addresses: next });
    }
    if (method === "PUT" && path[1]) {
      const next = addresses.map((a) => (a._id === path[1] ? { ...a, ...body } : a));
      setStorage("silkverse-cloud-addresses", next);
      return jsonResponse({
        success: true,
        address: next.find((a) => a._id === path[1]),
      });
    }
    if (method === "DELETE" && path[1]) {
      const next = addresses.filter((a) => a._id !== path[1]);
      setStorage("silkverse-cloud-addresses", next);
      return jsonResponse({ success: true });
    }
    return jsonResponse({ success: true, addresses });
  }

  // 8. Orders
  if (route.startsWith("orders")) {
    const orders = getStorage<any[]>("silkverse-cloud-orders", []);
    if (method === "POST") {
      const items = (body.items || []).map((it: any) => {
        const prod = rawProducts.find((p) => p._id === it.product) || rawProducts[0];
        return {
          product: prod._id,
          name: it.name || prod.name,
          image: it.image || prod.image,
          price: Number(it.price || prod.price),
          quantity: Number(it.quantity || 1),
        };
      });
      const subtotal = items.reduce(
        (s: number, i: any) => s + i.price * i.quantity,
        0
      );
      const shippingCharge = subtotal >= 1000 ? 0 : 100;
      let discount = 0;
      if (body.couponCode) {
        const c = rawCoupons.find(
          (cp) => cp.code.toUpperCase() === String(body.couponCode).toUpperCase()
        );
        if (c) {
          discount =
            c.discountType === "Percentage"
              ? Math.round((subtotal * c.discountValue) / 100)
              : c.discountValue;
          if (c.maxDiscount && c.maxDiscount > 0) {
            discount = Math.min(discount, c.maxDiscount);
          }
        }
      }
      const tax = Math.round(Math.max(subtotal - discount, 0) * 0.05);
      const totalAmount = Math.max(subtotal - discount, 0) + shippingCharge + tax;
      const addresses = getStorage<any[]>("silkverse-cloud-addresses", [DEFAULT_ADDRESS]);
      const addrObj =
        addresses.find((a) => a._id === body.address) || addresses[0] || DEFAULT_ADDRESS;

      const newOrder = {
        _id: "67" + Date.now().toString(16).padStart(22, "0").slice(0, 22),
        user: { _id: "user_demo_1", name: "Vishnu Sai", email: "vishnubeere91@gmail.com" },
        items,
        address: addrObj,
        subtotal,
        shippingCharge,
        tax,
        discount,
        totalAmount,
        couponCode: body.couponCode || null,
        paymentMethod: body.paymentMethod || "COD",
        paymentStatus: body.paymentMethod === "COD" ? "Pending" : "Paid",
        orderStatus: "Confirmed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const next = [newOrder, ...orders];
      setStorage("silkverse-cloud-orders", next);
      return jsonResponse({ success: true, order: newOrder });
    }

    if (path.length === 2) {
      const ord =
        orders.find((o) => o._id === path[1]) || {
          _id: path[1],
          user: { name: "Vishnu Sai", email: "vishnubeere91@gmail.com" },
          items: [
            {
              product: rawProducts[0]._id,
              name: rawProducts[0].name,
              image: rawProducts[0].image,
              price: rawProducts[0].price,
              quantity: 1,
            },
          ],
          address: DEFAULT_ADDRESS,
          subtotal: rawProducts[0].price,
          shippingCharge: 0,
          tax: Math.round(rawProducts[0].price * 0.05),
          discount: 0,
          totalAmount: Math.round(rawProducts[0].price * 1.05),
          paymentMethod: "COD",
          paymentStatus: "Pending",
          orderStatus: "Confirmed",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      return jsonResponse({ success: true, order: ord });
    }

    if (path.length === 3 && path[2] === "cancel") {
      const next = orders.map((o) =>
        o._id === path[1] ? { ...o, orderStatus: "Cancelled" } : o
      );
      setStorage("silkverse-cloud-orders", next);
      return jsonResponse({
        success: true,
        order: next.find((o) => o._id === path[1]),
      });
    }

    return jsonResponse({ success: true, orders });
  }

  // 9. Payment
  if (route === "payment/create-order") {
    return jsonResponse({
      success: true,
      order: {
        id: "order_rzp_" + Date.now(),
        amount: 1500000,
        currency: "INR",
      },
      paymentRecovered: false,
    });
  }
  if (route === "payment/verify") {
    return jsonResponse({ success: true });
  }

  // 10. Reviews
  if (route.startsWith("reviews")) {
    return jsonResponse({ success: true, reviews: [] });
  }

  // 11. Wishlist
  if (route.startsWith("wishlist")) {
    return jsonResponse({ success: true, wishlist: [] });
  }

  // 12. Admin
  if (route.startsWith("admin")) {
    const orders = getStorage<any[]>("silkverse-cloud-orders", []);
    const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    return jsonResponse({
      success: true,
      products: rawProducts,
      product: rawProducts.find((p) => p._id === path[2]) || rawProducts[0],
      orders,
      order: orders.find((o) => o._id === path[2]) || orders[0] || null,
      users: [
        {
          _id: "user_demo_1",
          name: "Vishnu Sai",
          email: "vishnubeere91@gmail.com",
          mobile: "9876543210",
          role: "admin",
        },
      ],
      dashboard: {
        totalUsers: 2,
        totalProducts: rawProducts.length,
        totalOrders: orders.length,
        totalRevenue,
      },
      analytics: {
        totalUsers: 2,
        totalProducts: rawProducts.length,
        totalOrders: orders.length,
        totalRevenue,
        averageOrderValue: 18500,
      },
    });
  }

  return jsonResponse({ success: true });
}
