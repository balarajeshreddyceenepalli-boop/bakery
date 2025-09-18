import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Carousel from '../components/ui/Carousel';
import CategoryCard from '../components/ui/CategoryCard';
import ProductCard from '../components/ui/ProductCard';
import { supabase } from '../lib/supabase';
import { Category, Product, Promotion } from '../types';

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topDeals, setTopDeals] = useState<Product[]>([]);
  const [mostSelling, setMostSelling] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (categoriesError) throw categoriesError;

      // Fetch promotions with products
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('promotions')
        .select(`
          *,
          product:products(
            *,
            subcategory:subcategories(
              *,
              category:categories(*)
            ),
            flavors:product_flavors(*)
          )
        `)
        .eq('is_active', true)
        .order('display_order');

      if (promotionsError) throw promotionsError;

      setCategories(categoriesData || []);

      // Separate top deals and most selling
      const deals = promotionsData?.filter(p => p.promotion_type === 'top_deal')
        .map(p => p.product).filter(Boolean) || [];
      const selling = promotionsData?.filter(p => p.promotion_type === 'most_selling')
        .map(p => p.product).filter(Boolean) || [];

      setTopDeals(deals);
      setMostSelling(selling);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const carouselItems = [
    {
      id: '1',
      image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
      title: 'Fresh Baked Daily',
      subtitle: 'Delicious cakes and pastries made with love',
      cta: 'Shop Now',
    },
    {
      id: '2',
      image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
      title: 'Custom Cakes',
      subtitle: 'Perfect for your special occasions',
      cta: 'Order Custom',
    },
    {
      id: '3',
      image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg',
      title: 'Premium Ingredients',
      subtitle: 'Only the finest ingredients in every bite',
      cta: 'Learn More',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delicious treats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <Carousel items={carouselItems} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of freshly baked goods, from celebration cakes to daily treats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          {categories.length > 6 && (
            <div className="text-center">
              <Link
                to="/categories"
                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
              >
                View All Categories
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          )}
        </section>

        {/* Top Deals Section */}
        {topDeals.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Deals</h2>
              <p className="text-gray-600">Don't miss out on these amazing offers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topDeals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Most Selling Section */}
        {mostSelling.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Most Popular</h2>
              <p className="text-gray-600">Our customers' favorite treats</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mostSelling.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="bg-amber-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 mb-6">
            We create custom cakes and treats for any occasion. Get in touch with us!
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/contact"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/categories"
              className="inline-block border border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;