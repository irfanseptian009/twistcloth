import { useState } from "react";
import AddProduct from "../../components/modal/AddProduct.jsx";
import ProductsTable from "../../components/admin/ProductTable.jsx";
import NavBarAdmin from "../../components/admin/NavBarAdmin.jsx";
import CloudinaryCleanup from "../../components/admin/CloudinaryCleanup.jsx";
import Toast from "../../components/UI/Toast.jsx";
import Modal from "../../components/UI/Modal.jsx";
import { FiPlus, FiPackage, FiTrendingUp, FiUsers, FiDollarSign } from "react-icons/fi";

export default function Admin() {
  const [showAddModal, setShowAddModal] = useState(false);

  const statsCards = [
    {
      title: "Total Products",
      value: "156",
      change: "+12%",
      changeType: "increase",
      icon: FiPackage,
      color: "bg-blue-500"
    },
    {
      title: "Total Sales",
      value: "$24,500",
      change: "+8%",
      changeType: "increase",
      icon: FiDollarSign,
      color: "bg-green-500"
    },
    {
      title: "Active Users",
      value: "1,240",
      change: "+15%",
      changeType: "increase",
      icon: FiUsers,
      color: "bg-purple-500"
    },
    {
      title: "Growth Rate",
      value: "23%",
      change: "+3%",
      changeType: "increase",
      icon: FiTrendingUp,
      color: "bg-orange-500"
    }
  ];

  return (
    <>
      <Toast />
      <NavBarAdmin />
      
      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage your products and monitor your business</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-lg"
                >
                  <FiPlus className="w-5 h-5 mr-2" />
                  Add New Product
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>          {/* Products Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Product Management</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage your product inventory</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Export
                  </button>
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Filter
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ProductsTable />
            </div>
          </div>

          {/* Cloudinary Cleanup Section */}
          <CloudinaryCleanup />
        </div>
      </div>      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        maxWidth="max-w-4xl"
      >
        <AddProduct onClose={() => setShowAddModal(false)} />
      </Modal>
    </>
  );
}