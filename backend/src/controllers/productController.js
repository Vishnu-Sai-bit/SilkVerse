const Product = require("../models/Product");
const mongoose = require("mongoose");

// =====================================
// Escape Regex Special Characters
// =====================================

function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

// =====================================
// Get All Products
// Search + Filter + Sort + Pagination
// =====================================

exports.getProducts = async (
  req,
  res
) => {
  try {
    const {
      keyword,
      category,
      occasion,
      weave,
      fabric,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 200,
    } = req.query;

    // ===================================
    // Pagination
    // ===================================

    const currentPage = Math.max(
      Number.parseInt(page, 10) || 1,
      1
    );

    const requestedLimit = Math.max(
      Number.parseInt(limit, 10) || 200,
      1
    );

    const itemsPerPage = Math.min(
      requestedLimit,
      500
    );

    // ===================================
    // Query Conditions
    // ===================================

    const andConditions = [];

    // ===================================
    // Keyword & AI Semantic Search
    // ===================================
    let semanticMinPrice;
    let semanticMaxPrice;

    if (
      typeof keyword === "string" &&
      keyword.trim()
    ) {
      let normalizedKw = keyword.trim();

      // 1. Map common Telugu search words to English silk attributes
      const teluguMap = {
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

      for (const [teWord, enWord] of Object.entries(teluguMap)) {
        if (normalizedKw.includes(teWord)) {
          normalizedKw = normalizedKw.replace(new RegExp(teWord, "g"), ` ${enWord} `);
        }
      }

      // 2. Extract inline price limits (e.g., "under 20000", "below ₹15,000", "above 10000")
      const underMatch = normalizedKw.match(
        /(?:under|below|less\s+than|upto|up\s+to|max|within|లోపు)\s*₹?\s*([\d,]+)/i
      );
      if (underMatch) {
        const val = Number(underMatch[1].replace(/,/g, ""));
        if (Number.isFinite(val) && val > 0) {
          semanticMaxPrice = val;
        }
        normalizedKw = normalizedKw.replace(underMatch[0], " ");
      }

      const aboveMatch = normalizedKw.match(
        /(?:above|over|more\s+than|min|starting\s+from|పైన)\s*₹?\s*([\d,]+)/i
      );
      if (aboveMatch) {
        const val = Number(aboveMatch[1].replace(/,/g, ""));
        if (Number.isFinite(val) && val >= 0) {
          semanticMinPrice = val;
        }
        normalizedKw = normalizedKw.replace(aboveMatch[0], " ");
      }

      // 3. Extract meaningful semantic tokens by stripping conversational stopwords
      const stopWords = new Set([
        "a", "an", "the", "for", "with", "in", "on", "of", "to", "and", "or",
        "saree", "sarees", "silk", "pure", "handloom", "pattu", "cheera",
        "చీర", "చీరలు", "పట్టు", "కోసం", "best", "show", "me", "looking", "want", "buy",
      ]);

      const rawTokens = normalizedKw
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, " ")
        .split(/\s+/)
        .filter(Boolean);

      const semanticTokens = rawTokens.filter(
        (t) => t.length >= 2 && !stopWords.has(t)
      );

      // Synonym normalization (e.g. kanjeevaram -> kanchipuram)
      const normalizedTokens = semanticTokens.map((t) => {
        if (t === "kanjeevaram" || t === "kanchi") return "kanchipuram";
        if (t === "banaras") return "banarasi";
        if (t === "golden") return "gold";
        if (t === "crimson" || t === "wine") return "maroon";
        return t;
      });

      const fullRegex = new RegExp(
        escapeRegex(keyword.trim()),
        "i"
      );

      const fullMatchCondition = {
        $or: [
          { name: fullRegex },
          { description: fullRegex },
          { category: fullRegex },
          { occasion: fullRegex },
          { weave: fullRegex },
          { fabric: fullRegex },
          { color: fullRegex },
        ],
      };

      if (normalizedTokens.length > 0) {
        // Match products that satisfy ALL semantic tokens across any product field
        const tokenConditions = normalizedTokens.map((tok) => {
          const tokRegex = new RegExp(escapeRegex(tok), "i");
          return {
            $or: [
              { name: tokRegex },
              { description: tokRegex },
              { category: tokRegex },
              { occasion: tokRegex },
              { weave: tokRegex },
              { fabric: tokRegex },
              { color: tokRegex },
            ],
          };
        });

        andConditions.push({
          $or: [
            fullMatchCondition,
            { $and: tokenConditions },
          ],
        });
      } else if (semanticMaxPrice === undefined && semanticMinPrice === undefined) {
        // E.g. user searched just "silk saree" or "pattu saree" — match all silk sarees
        const fallbackRegex = new RegExp("silk|saree", "i");
        andConditions.push({
          $or: [
            { name: fallbackRegex },
            { description: fallbackRegex },
            { category: fallbackRegex },
            { fabric: fallbackRegex },
          ],
        });
      }
    }

    // Occasion Filter
    if (
      typeof occasion === "string" &&
      occasion.trim() &&
      occasion.trim().toLowerCase() !== "all"
    ) {
      const occRegex = new RegExp(
        escapeRegex(occasion.trim()),
        "i"
      );
      andConditions.push({
        $or: [
          { occasion: occRegex },
          { category: occRegex },
          { name: occRegex },
          { description: occRegex },
        ],
      });
    }

    // Category / Silk Type Filter
    if (
      typeof category === "string" &&
      category.trim() &&
      category.trim().toLowerCase() !== "all"
    ) {
      const catRegex = new RegExp(
        escapeRegex(category.trim()),
        "i"
      );
      andConditions.push({
        $or: [
          { category: catRegex },
          { occasion: catRegex },
          { weave: catRegex },
          { fabric: catRegex },
          { name: catRegex },
          { description: catRegex },
        ],
      });
    }

    // Weave Filter
    if (
      typeof weave === "string" &&
      weave.trim() &&
      weave.trim().toLowerCase() !== "all"
    ) {
      const weaveRegex = new RegExp(
        escapeRegex(weave.trim()),
        "i"
      );
      andConditions.push({
        $or: [
          { weave: weaveRegex },
          { name: weaveRegex },
          { description: weaveRegex },
        ],
      });
    }

    const query =
      andConditions.length > 0
        ? { $and: andConditions }
        : {};

    // ===================================
    // Price Validation
    // ===================================

    let parsedMinPrice = semanticMinPrice;
    let parsedMaxPrice = semanticMaxPrice;

    if (
      minPrice !== undefined &&
      minPrice !== ""
    ) {
      parsedMinPrice =
        Number(minPrice);

      if (
        !Number.isFinite(
          parsedMinPrice
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid minimum price",
        });
      }

      if (parsedMinPrice < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Minimum price cannot be negative",
        });
      }
    }

    if (
      maxPrice !== undefined &&
      maxPrice !== ""
    ) {
      parsedMaxPrice =
        Number(maxPrice);

      if (
        !Number.isFinite(
          parsedMaxPrice
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid maximum price",
        });
      }

      if (parsedMaxPrice < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Maximum price cannot be negative",
        });
      }
    }

    // ===================================
    // Price Range
    // ===================================

    if (
      parsedMinPrice !== undefined &&
      parsedMaxPrice !== undefined &&
      parsedMinPrice >
        parsedMaxPrice
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum price cannot be greater than maximum price",
      });
    }

    if (
      parsedMinPrice !== undefined ||
      parsedMaxPrice !== undefined
    ) {
      query.price = {};

      if (
        parsedMinPrice !== undefined
      ) {
        query.price.$gte =
          parsedMinPrice;
      }

      if (
        parsedMaxPrice !== undefined
      ) {
        query.price.$lte =
          parsedMaxPrice;
      }
    }

    // ===================================
    // Rating
    // ===================================

    if (
      rating !== undefined &&
      rating !== ""
    ) {
      const parsedRating =
        Number(rating);

      if (
        !Number.isFinite(
          parsedRating
        ) ||
        parsedRating < 0 ||
        parsedRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rating must be between 0 and 5",
        });
      }

      query.averageRating = {
        $gte: parsedRating,
      };
    }

    // ===================================
    // Sorting
    // ===================================

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "popularity":
      case "bestseller":
      case "bestsellers":
        // Prioritizes best-selling & popular sarees: highest sales volume, highest reviews, and highest customer ratings
        sortOption = {
          isBestSeller: -1,
          salesCount: -1,
          averageRating: -1,
          numReviews: -1,
          createdAt: -1,
        };
        break;

      case "priceAsc":
        sortOption = {
          price: 1,
          createdAt: -1,
        };
        break;

      case "priceDesc":
        sortOption = {
          price: -1,
          createdAt: -1,
        };
        break;

      case "rating":
        sortOption = {
          averageRating: -1,
          numReviews: -1,
          createdAt: -1,
        };
        break;

      case "newest":
        sortOption = {
          createdAt: -1,
        };
        break;

      default:
        sortOption = {
          isBestSeller: -1,
          salesCount: -1,
          averageRating: -1,
          createdAt: -1,
        };
        break;
    }

    // ===================================
    // Count
    // ===================================

    const totalProducts =
      await Product.countDocuments(
        query
      );

    // ===================================
    // Total Pages
    // ===================================

    const totalPages =
      Math.ceil(
        totalProducts /
          itemsPerPage
      );

    // ===================================
    // Safe Page
    // ===================================

    const safePage =
      totalPages > 0
        ? Math.min(
            currentPage,
            totalPages
          )
        : 1;

    const skip =
      (safePage - 1) *
      itemsPerPage;

    // ===================================
    // Products
    // ===================================

    const products =
      await Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(itemsPerPage);

    // ===================================
    // Response
    // ===================================

    return res.status(200).json({
      success: true,
      totalProducts,
      totalPages,
      currentPage: safePage,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch products",
    });
  }
};

// =====================================
// Get Dynamic Product Categories
// GET /api/products/categories
// =====================================

exports.getCategories = async (req, res) => {
  try {
    const rawCategories = await Product.aggregate([
      {
        $match: {
          category: { $exists: true, $nin: [null, ""] },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const total = await Product.countDocuments();

    const counts = { All: total };
    const categories = [];

    rawCategories.forEach((item) => {
      if (item._id && typeof item._id === "string") {
        const name = item._id.trim();
        if (name) {
          categories.push(name);
          counts[name] = item.count;
        }
      }
    });

    const rawOccasions = await Product.aggregate([
      {
        $match: {
          occasion: { $exists: true, $nin: [null, ""] },
        },
      },
      {
        $group: {
          _id: "$occasion",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const occasionCounts = {};
    rawOccasions.forEach((item) => {
      if (item._id && typeof item._id === "string") {
        const name = item._id.trim();
        if (name) {
          occasionCounts[name] = item.count;
        }
      }
    });

    const rawFabrics = await Product.aggregate([
      {
        $match: {
          fabric: { $exists: true, $nin: [null, ""] },
        },
      },
      {
        $group: {
          _id: "$fabric",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const fabricCounts = {};
    rawFabrics.forEach((item) => {
      if (item._id && typeof item._id === "string") {
        const name = item._id.trim();
        if (name) {
          fabricCounts[name] = item.count;
        }
      }
    });

    return res.status(200).json({
      success: true,
      categories,
      counts,
      occasionCounts,
      fabricCounts,
      total,
    });
  } catch (error) {
    console.error(
      "Get categories error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch categories",
    });
  }
};

// =====================================
// Get Single Product
// =====================================

exports.getProductById = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID",
      });
    }

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch product",
    });
  }
};

// =====================================
// Get Related Products
// GET /api/products/:id/related
// =====================================

exports.getRelatedProducts = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID",
      });
    }

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    // 1. Primary: Products in the same category
    let relatedProducts =
      await Product.find({
        _id: {
          $ne: product._id,
        },
        category:
          product.category,
      })
        .sort({
          isBestSeller: -1,
          salesCount: -1,
          averageRating: -1,
          createdAt: -1,
        })
        .limit(5);

    // 2. Secondary: If fewer than 5, supplement with same occasion or fabric
    if (relatedProducts.length < 5) {
      const existingIds = [
        product._id,
        ...relatedProducts.map((p) => p._id),
      ];

      const supplemental =
        await Product.find({
          _id: {
            $nin: existingIds,
          },
          $or: [
            { occasion: product.occasion },
            { fabric: product.fabric },
          ],
        })
          .sort({
            isBestSeller: -1,
            salesCount: -1,
            averageRating: -1,
            createdAt: -1,
          })
          .limit(5 - relatedProducts.length);

      relatedProducts =
        relatedProducts.concat(supplemental);
    }

    // 3. Fallback: If still fewer than 5, supplement with other top authentic handloom sarees
    if (relatedProducts.length < 5) {
      const existingIds = [
        product._id,
        ...relatedProducts.map((p) => p._id),
      ];

      const fallback =
        await Product.find({
          _id: {
            $nin: existingIds,
          },
        })
          .sort({
            isBestSeller: -1,
            salesCount: -1,
            averageRating: -1,
            createdAt: -1,
          })
          .limit(5 - relatedProducts.length);

      relatedProducts =
        relatedProducts.concat(fallback);
    }

    return res.status(200).json({
      success: true,
      products:
        relatedProducts,
    });
  } catch (error) {
    console.error(
      "Get related products error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch related products",
    });
  }
};