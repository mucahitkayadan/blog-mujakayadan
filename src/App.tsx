import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link,
  Navigate,
} from 'react-router-dom'
import { motion } from 'framer-motion'
import { styles } from './styles'
import { logo, herobg } from './assets'
import { useState, useEffect } from 'react'
import { chatbotPost } from './posts/chatbot'
import ReactMarkdown from 'react-markdown'
import { navLinks } from './constants'
import { SharedChat } from './components/SharedChat'

interface BlogPost {
  title: string;
  date: string;
  summary: string;
  content: string;
}

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
}

// Blog post card component
const BlogCard = ({ post, onClick }: BlogCardProps) => (
  <motion.article
    className="bg-tertiary/30 rounded-lg p-8 backdrop-blur-sm hover:bg-tertiary/40 transition-all cursor-pointer"
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
  >
    <h3 className="text-2xl font-bold mb-3 text-white break-words leading-relaxed">{post.title}</h3>
    <p className="text-secondary text-sm mb-4">{post.date}</p>
    <p className="text-gray-300 text-base leading-relaxed">{post.summary}</p>
    <div className="mt-6">
      <span className="text-[#915EFF] hover:text-[#00BFFF] transition-colors duration-300">Read more →</span>
    </div>
  </motion.article>
);

// Full blog post component
const BlogPost = ({ post }: { post: any }) => (
  <div className="prose prose-invert max-w-none">
    <h1 className="text-3xl font-bold mb-6 text-white">{post.title}</h1>
    <div className="text-secondary mb-8">{post.date}</div>
    <div className="markdown-content space-y-6">
      <ReactMarkdown 
        components={{
          h1: ({...props}) => <h1 className="text-2xl font-bold mt-8 mb-4 text-white" {...props} />,
          h2: ({...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-[#915EFF]" {...props} />,
          p: ({...props}) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
          code: ({className, children, ...props}: any) => 
            className?.includes('language-') ? (
              <pre className="bg-tertiary/50 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm" {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-tertiary/50 rounded px-1 py-0.5 text-sm" {...props}>
                {children}
              </code>
            ),
          ul: ({...props}) => <ul className="list-disc list-inside space-y-2 text-gray-300" {...props} />,
          li: ({...props}) => <li className="text-gray-300" {...props} />,
        }}
      >
        {post.content}
      </ReactMarkdown>
    </div>
  </div>
);

function App() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div style={{
          backgroundImage: `url(${herobg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1
        }} />
        <div className="relative">
          <nav className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 transition-all duration-300 ${scrolled ? "bg-primary shadow-lg" : "bg-transparent"}`}>
            <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
              <Link to='/' className='flex items-center gap-2'>
                <img src={logo} alt='logo' className='w-9 h-9 object-contain' />
                <motion.p 
                  className='text-white text-[18px] font-bold cursor-pointer flex items-center'
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span 
                    className='block' 
                    style={{
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: "26px",
                      background: "linear-gradient(90deg, #915EFF, #00BFFF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {"</"}Muja Kayadan{">"}
                  </span>
                </motion.p>
              </Link>
              <ul className='list-none hidden sm:flex flex-row gap-10'>
                {[...navLinks, { title: 'Blog', path: 'https://blog.mujakayadan.com' }].map((item) => (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <a 
                      href={item.path}
                      className={`${active === item.title ? "text-white" : "text-secondary"} hover:text-white text-[18px] font-medium cursor-pointer transition-colors duration-300`}
                      onClick={() => setActive(item.title)}
                    >
                      {item.title}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </nav>
          <main className={`${styles.padding} max-w-7xl mx-auto relative z-0 pt-28`}>
            <Routes>
              <Route path="/" element={
                <div>
                  <h1 className="category-title">{"<"}Blog{">"}</h1>
                  <div className="grid gap-8 mt-8 mb-8">
                    <BlogCard 
                      post={chatbotPost} 
                      onClick={() => {
                        window.location.href = '/post/chatbot';
                      }} 
                    />
                  </div>
                  <h1 className="category-title bottom">{"</"}Blog{">"}</h1>
                </div>
              } />
              <Route path="/post" element={
                <div>
                  <h1 className="category-title">{"<"}All Posts{">"}</h1>
                  <div className="grid gap-8 mt-8 mb-8">
                    <BlogCard 
                      post={chatbotPost} 
                      onClick={() => {
                        window.location.href = '/post/chatbot';
                      }} 
                    />
                  </div>
                  <h1 className="category-title bottom">{"</"}All Posts{">"}</h1>
                </div>
              } />
              <Route path="/post/chatbot" element={
                <div>
                  <h1 className="category-title">{"<"}Post{">"}</h1>
                  <div className="bg-tertiary/30 rounded-lg p-8 backdrop-blur-sm mt-8 mb-8">
                    <BlogPost post={chatbotPost} />
                  </div>
                  <h1 className="category-title bottom">{"</"}Post{">"}</h1>
                </div>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <SharedChat />
      </div>
    </BrowserRouter>
  );
}

export default App;
