import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Glassmorphism header */}
      <header className="relative z-10 p-6 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center text-2xl animate-bounce">
              💰
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              ExpenseTracker
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-white/90 font-medium hover:text-emerald-400 transition-all duration-300 transform hover:scale-105"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2.5 rounded-full font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section with enhanced animations */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="mb-8 animate-bounce">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-emerald-500/25 transform rotate-12 hover:rotate-0 transition-transform duration-500">
            📊
          </div>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent leading-tight animate-pulse">
          Track your expenses
          <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            effortlessly
          </span>
        </h2>
        
        <p className="text-xl md:text-2xl mb-12 max-w-3xl text-white/80 leading-relaxed">
          Stay in control of your budget with 
          <span className="text-emerald-400 font-semibold"> real-time insights</span>, 
          <span className="text-cyan-400 font-semibold"> interactive charts</span>, and 
          <span className="text-blue-400 font-semibold"> simple tracking</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/register"
            className="group bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white px-10 py-4 rounded-full text-xl font-bold hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/25 relative overflow-hidden"
          >
            <span className="relative z-10">Get Started Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link
            to="/demo"
            className="group bg-transparent text-white px-10 py-4 rounded-full text-xl font-bold border-2 border-white/30 hover:border-emerald-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/15 relative overflow-hidden"
          >
            <span className="relative z-10">Try Demo</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </main>

      {/* Enhanced features section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Powerful Features
            </h3>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Everything you need to master your finances in one beautiful, intuitive platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-3xl border border-white/20 hover:border-emerald-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors duration-300">
                Visual Charts
              </h4>
              <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                Understand your spending patterns with beautiful, interactive charts and real-time analytics that make budgeting effortless.
              </p>
            </div>
            
            <div className="group backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-3xl border border-white/20 hover:border-cyan-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                🔒
              </div>
              <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors duration-300">
                Bank-Level Security
              </h4>
              <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                Your financial data is protected with enterprise-grade encryption and JWT-based authentication protocols.
              </p>
            </div>
            
            <div className="group backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-3xl border border-white/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                ⚡
              </div>
              <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">
                Lightning Fast
              </h4>
              <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                Add, categorize, and analyze expenses in seconds with our intuitive interface and smart automation features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced footer */}
      <footer className="relative z-10 text-center p-8 backdrop-blur-xl bg-white/5 border-t border-white/10">
        <div className="flex justify-center items-center space-x-2 text-white/60">
          <span>© {new Date().getFullYear()} ExpenseTracker</span>
          <span className="text-pink-400">·</span>
          <span>Made with</span>
          <span className="text-red-400 animate-pulse text-xl">❤️</span>
          <span>for financial freedom</span>
        </div>
      </footer>
    </div>
  );
}