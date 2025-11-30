import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">زراعتي</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              متجرك المفضل للمنتجات الزراعية الطبيعية. نقدم أجود الشتلات والأعشاب والنباتات الجاهزة للزراعة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link to="/consultations" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  الاستشارات
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">الأقسام</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=seedlings" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  الشتلات
                </Link>
              </li>
              <li>
                <Link to="/products?category=ready-plants" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  النباتات الجاهزة
                </Link>
              </li>
              <li>
                <Link to="/products?category=herbs" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  الأعشاب
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-primary-foreground/80">01234567890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-primary-foreground/80">info@zeraaty.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-primary-foreground/80">القاهرة، مصر</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60 text-sm">
          <p>© 2024 زراعتي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
