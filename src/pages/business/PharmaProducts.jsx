import { useMemo, useState } from "react";
import {
  Package,
  CheckCircle2,
  MessageSquare,
  IndianRupee,
  Search,
  Plus,
  Download,
  Pencil,
  Eye,
  FileText,
  X,
} from "lucide-react";
import { jsPDF } from "jspdf";

import {
  initialPharmaProducts,
  initialPharmaEnquiries,
  formatINR,
} from "../../data/pharmaData";

import PharmaProductModal from "../../components/PharmaProductModal";
import PharmaEnquiryModal from "../../components/PharmaEnquiryModal";

const PharmaProducts = () => {
  const [products, setProducts] = useState(initialPharmaProducts);
  const [enquiries, setEnquiries] = useState(initialPharmaEnquiries);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Product statistics
  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.status === "Active"
  ).length;

  const totalEnquiries = enquiries.length;

  const newEnquiries = enquiries.filter(
    (enquiry) => enquiry.status === "New"
  ).length;

  const totalInventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  // Product search and filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.id.toLowerCase().includes(search) ||
        product.manufacturer.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Enquiry search
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enquiry) => {
      const search = searchTerm.toLowerCase();

      const product = products.find(
        (item) => item.id === enquiry.productId
      );

      return (
        enquiry.customerName.toLowerCase().includes(search) ||
        enquiry.email.toLowerCase().includes(search) ||
        enquiry.id.toLowerCase().includes(search) ||
        (product?.name || "").toLowerCase().includes(search)
      );
    });
  }, [enquiries, products, searchTerm]);

  // Add or update product
  const handleSaveProduct = (formData) => {
    if (selectedProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === selectedProduct.id
            ? { ...formData, id: selectedProduct.id }
            : product
        )
      );
    } else {
      const newProduct = {
        ...formData,
        id: `PH-${Date.now().toString().slice(-6)}`,
      };

      setProducts((prev) => [newProduct, ...prev]);
    }

    setShowProductModal(false);
    setSelectedProduct(null);
  };

  // Update enquiry
  const handleSaveEnquiry = (updatedEnquiry) => {
    setEnquiries((prev) =>
      prev.map((enquiry) =>
        enquiry.id === updatedEnquiry.id
          ? updatedEnquiry
          : enquiry
      )
    );

    setSelectedEnquiry(null);
  };

  // Download price list PDF
  const downloadPriceList = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Pharma Product Price List", 14, 20);

    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      14,
      28
    );

    doc.setFontSize(9);

    let y = 42;

    doc.setFont(undefined, "bold");
    doc.text("Product", 14, y);
    doc.text("Category", 75, y);
    doc.text("Manufacturer", 115, y);
    doc.text("Price", 175, y);

    doc.line(14, y + 3, 195, y + 3);

    y += 12;

    doc.setFont(undefined, "normal");

    products.forEach((product) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }

      doc.text(product.name.substring(0, 30), 14, y);
      doc.text(product.category.substring(0, 20), 75, y);
      doc.text(product.manufacturer.substring(0, 22), 115, y);
      doc.text(formatINR(product.price), 175, y);

      y += 10;
    });

    doc.save("pharma-product-price-list.pdf");
  };

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      description: "Products in catalogue",
      icon: Package,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Products",
      value: activeProducts,
      description: "Currently active listings",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Enquiries",
      value: totalEnquiries,
      description: `${newEnquiries} new enquiries`,
      icon: MessageSquare,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Inventory Value",
      value: formatINR(totalInventoryValue),
      description: "Demo price × stock calculation",
      icon: IndianRupee,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const getProductStatusStyle = (status) =>
    status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-slate-100 text-slate-500";

  const getEnquiryStatusStyle = (status) => {
    const styles = {
      New: "bg-blue-50 text-blue-700",
      Contacted: "bg-orange-50 text-orange-700",
      Converted: "bg-emerald-50 text-emerald-700",
      Lost: "bg-rose-50 text-rose-700",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Pharma Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage product listings, pricing and customer enquiries.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={downloadPriceList}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Download size={17} />
            Download Price List
          </button>

          <button
            onClick={() => {
              setSelectedProduct(null);
              setShowProductModal(true);
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Product
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-800">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.iconBg}`}>
                  <Icon size={21} className={stat.iconColor} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab("products");
            setSearchTerm("");
          }}
          className={`border-b-2 pb-3 text-sm font-semibold transition ${
            activeTab === "products"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Products ({products.length})
        </button>

        <button
          onClick={() => {
            setActiveTab("enquiries");
            setSearchTerm("");
          }}
          className={`border-b-2 pb-3 text-sm font-semibold transition ${
            activeTab === "enquiries"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Enquiries ({enquiries.length})
        </button>
      </div>

      {/* Main content */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        {/* Search and filters */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-bold text-slate-800">
              {activeTab === "products"
                ? "Product Catalogue"
                : "Product Enquiries"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "products"
                ? "Manage your pharma product information."
                : "Review and update customer enquiries."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  activeTab === "products"
                    ? "Search products..."
                    : "Search enquiries..."
                }
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-60"
              />
            </div>

            {activeTab === "products" && (
              <>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Diabetes Care">Diabetes Care</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Orthopaedics">Orthopaedics</option>
                  <option value="Healthcare">Healthcare</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Products table */}
        {activeTab === "products" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Manufacturer</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="text-sm transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {product.id}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {product.manufacturer}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {formatINR(product.price)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          product.stock === 0
                            ? "font-medium text-rose-600"
                            : "text-slate-600"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getProductStatusStyle(product.status)}`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowProductModal(true);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-sm text-slate-400"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Enquiries table */}
        {activeTab === "enquiries" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Quantity</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map((enquiry) => {
                  const product = products.find(
                    (item) => item.id === enquiry.productId
                  );

                  return (
                    <tr
                      key={enquiry.id}
                      className="text-sm transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {enquiry.customerName}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {enquiry.email}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {enquiry.id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {product?.name || "Product unavailable"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {product?.id || enquiry.productId}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {enquiry.quantity}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {new Date(`${enquiry.date}T00:00:00`).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getEnquiryStatusStyle(enquiry.status)}`}
                        >
                          {enquiry.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredEnquiries.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-sm text-slate-400"
                    >
                      No enquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-500">
            {activeTab === "products"
              ? `Showing ${filteredProducts.length} of ${products.length} products`
              : `Showing ${filteredEnquiries.length} of ${enquiries.length} enquiries`}
          </p>
        </div>
      </div>

      {/* Product modal */}
      {showProductModal && (
        <PharmaProductModal
          product={selectedProduct}
          onClose={() => {
            setShowProductModal(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Enquiry modal */}
      {selectedEnquiry && (
        <PharmaEnquiryModal
          enquiry={selectedEnquiry}
          product={products.find(
            (item) => item.id === selectedEnquiry.productId
          )}
          onClose={() => setSelectedEnquiry(null)}
          onSave={handleSaveEnquiry}
        />
      )}
    </div>
  );
};

export default PharmaProducts;